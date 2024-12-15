const API_BASE_URL = 'http://10.241.155.155:8080';
/**
 * Logs out the current user by sending a POST request to the server's logout endpoint.
 * If the logout is successful, the user is redirected to the login page.
 * If the logout fails, an error message is displayed.
 */
function logout() {
  // Send a POST request to the logout endpoint with the appropriate headers and body
  fetch(`${API_BASE_URL}/php/auth/logout.php`, {
    method: "POST", // HTTP method for the request
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // Indicate that the body is URL-encoded
    },
    body: "logout=true", // The data sent to the server indicating the logout action
    credentials: "include", // Include cookies (e.g., session cookies) in the request
  })
    .then((response) => {
      // Check if the response from the server is successful
      if (!response.ok) {
        // If the response is not ok (e.g., status 404 or 500), throw an error
        throw new Error("Network response was not ok");
      }
      // Parse the response body as JSON
      return response.json();
    })
    .then((data) => {
      // If the server indicates success, redirect the user to the login page
      if (data.success) {
        window.location.href =
          `${API_BASE_URL}/auth/html/index.html`;
      } else {
        // If the server indicates failure, throw an error with the message from the server
        throw new Error(data.message || "Logout failed");
      }
    })
    .catch((error) => {
      // If any error occurs in the fetch process, log it and alert the user
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    });
}
