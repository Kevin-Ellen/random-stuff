/*
  Using Cloudflare workers to implement a migration, where the redirects are performed by the Cloudflare Worker opposed to being done by the origin server.
  The external redirect file can be found at: https://raw.githubusercontent.com/croud-web-experience/public/master/cloudflare-workers-redirects/redirects.json
*/

// First listen to the fetch event, which will be handled by the Worker
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Handle the inbound request
const handleRequest = async (request) => {

  // Get the redirects from the (public) GitHub file. As there are two promises, I wrapped them into a single async method
  const redirectsObj = await(await fetch('https://raw.githubusercontent.com/croud-web-experience/public/master/cloudflare-workers-redirects/redirects.json')).json();

  // Get the requested path based on the request URL
  const path = new URL(request.url).pathname;

  // Check if the path is within the redirects object
  if(redirectsObj.hasOwnProperty(path)){

    // Redirect has been found, store the data in a variable for ease of use in this example
    const redirData = redirectsObj[path];

    // Check if status code is within the 3xx range (redirects)
    if(redirData.status>299 && redirData.status<400){
      
      // define the URL. If the string does not start with 'http', add the current domain
      const redirUrl = redirData.to.substring(0,4) === 'http' ? redirData.to : new URL(request.url).protocol + '//' + new URL(request.url).host + redirData.to;
      // Return the response with the redirecting URL and status
      return Response.redirect(redirUrl, redirData.status);
    }

    // Return the non-redirecting response and the message that the page does not exist anymore as default content.
    return new Response('Page does not exist anymore', {status: redirData.status});
  }

  // Return a normal response, for this example the default 'hello world' message.
  return new Response('hello world', {status: 200});

  // If all URLs will have to be migrated, this can also be done here by a catch-all. Example is below.
  /*
    return Response.redirect('https://example.com/', 301);
  */
}