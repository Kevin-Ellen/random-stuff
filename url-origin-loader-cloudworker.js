// Object with where the pages should point to, based on path. This can be to another system or domain. Path is the key, with the value being where the data needs to come from
const pagesObj = {
  next: 'https://nextjs.org/',
  wordpress: 'https://wordpress.org/',
  example: 'https://example.com'
}

// Listen to fetch events and attach event to 'event' variable. As it is not async, we will go straight into a function
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Handle the inbound request
const handleRequest = async (request) => {

  // Set up configuration (headers etc.) - For now, keeping it simple and using text/HTML UTF-8
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8'
    }
  }
  
  // Store the requested URL as an URL object
  const url = new URL(request.url);

  // Store the path, as we will use the path to see if it exists in the object. Remove first character with substr
  const path = url.pathname.substr(1);

  // Check if the key exists in the object. If yes, grab the page. If no, continue
  if(pagesObj.hasOwnProperty(path)){
    
    //gather the page etc using the getPage function - providing the URL we have found in the object
    const response = await getPage(pagesObj[path]);

    // Conditions have been met, response has been gathered. Return Response.
    return new Response(response, init);
  }


  // Conditions have not been met, do your normal thing - set the response to show 'Hello world'
  return new Response('hello world', {status: 200})
}

// Async function to get the page
const getPage = async (url) => {

  // Fetch the requested URL
  const response = await fetch(url);
  
  // Return the response (body text/code)
  return response.text();
}