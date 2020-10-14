/*
  Using Cloudflare workers to implement URL sanitisation / normalisation
*/

// Configuration of the rules we want
const trailing = true; // config flag to check whether we always want a trailing slash or not. In this case, we want a trailing slash
const scheme = 'https'; // config flag to show what scheme we want to use. In this case the secure 'https' scheme
const host = 'www.example.com'; // config flag for the host (full domain). We want URLs to redirect to the host 'www.example.com'

const redirCode = 301; // Config flag for the redirect status code. Recommended is '301' (permanent)

// Listen to the event and handle the request; keeping this as simple as possible
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

const handleRequest = async (request) => {
  // Retrieve the requested URL from the event and store it as a non-mutable object
  const originalUrl = new URL(request.url);

  // Retrieve the requested URL from the event and store it as a mutuble object
  let newUrl = new URL(request.url);

  // Test and store the right scheme
  newUrl.protocol = newUrl.protocol === scheme ? newUrl.protocol : scheme;

  // Test and store the right host
  newUrl.host = newUrl.host === host ? newUrl.host : host;

  // Ensure that the path is fully lowercase
  newUrl.pathname = newUrl.pathname.toLowerCase();

  // Trailing slash test - if trailing slash === true, add trailing slash, otherwise remove it
  newUrl.pathname = trailing ? newUrl.pathname.replace(/\/?$/, '/') : newUrl.pathname.replace(/\/?$/, '');

  // Check if the URL has changed - if it has changed, redirect. Need to stringify to use comparison operator as we are comparing objects
  if(JSON.stringify(originalUrl) !== JSON.stringify(newUrl)){
    
    // Return the redirect response to the event handler - with the new URL and new status code.
    return Response.redirect(newUrl, redirCode);
  }

  // URLs are the same, URL sanitasation is not needed and normal duty can resume
  return new Response('Hello world!', {status: 200})
}