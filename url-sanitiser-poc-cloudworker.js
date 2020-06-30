addEventListener('fetch', event => {

  // Retrieving the requested URL from the event and saving it as a const to check change later
  const url = new URL(event.request.url);

  // Checking if protocol is HTTPS, if not - change to HTTPS
  const protocol = url.protocol === 'https:' ? url.protocol : 'https:';

  // Checking if hostname is what we want it to be, if not - change to what we want
  const hostname = url.hostname === 'www.example.com' ? url.hostname : 'www.example.com';

  // Ensuring that full path is lowercase
  const pathname = url.pathname.toLowerCase();

  // Get the QSP, so we don't lose tracking parameters etc
  const search = url.search;

  // Construct the new URL as a nice object.
  const newURL = new URL(protocol+'//'+hostname+pathname+search);


  // Console logging for checks
  console.log(url);
  console.log('protocol: '+newURL.protocol);
  console.log('hostname: '+newURL.hostname);
  console.log('pathname: '+newURL.pathname);
  console.log('QSE: '+newURL.search);

  if(url!==newURL){
    // if the URLs don't match, redirect to the new URL with the correct items
    event.respondWith(redirectRequest(newURL));
  }else{
    // if the URLs match, do what you normally do.
    event.respondWith(handleRequest(event.request));
  }
})

// Do your normal stuff
async function handleRequest(request) {
  return new Response('hello world', {status: 200})
}

// Redirect to sanitised URL
async function redirectRequest(request) {
  return Response.redirect(request, 301)
}