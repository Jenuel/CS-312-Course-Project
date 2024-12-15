const API_BASE_URL = 'http://10.241.155.155:8080';
/**
 * Handles the login process by capturing the form submission event,
 * sending the login data to the server, and redirecting based on the
 * user role after successful authentication.
 * 
 * @param {Event} event - The event object triggered by the form submission.
 */
function handleLogin(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect the login credentials and action
    let formData = {
        email: document.getElementById('username').value, // Get the email value from the form
        password: document.getElementById('password').value, // Get the password value from the form
        action: 'signIn' // Indicate the login action
    };

    var responseClone; // Variable to store a clone of the response object for further processing

    /**
     * Send the login data to the server via a POST request.
     * The data is sent as JSON, and the server's response is expected to be in JSON format.
     */
    fetch( `${API_BASE_URL}/php/auth/authRoutes.php`, {
        method: 'POST', // HTTP method to be used
        headers: {
            'Content-Type': 'application/json' // Indicate that the request body is JSON
        },
        body: JSON.stringify(formData), // Convert the form data to JSON string
    })
    .then(response => {

        // If the response is not successful, throw an error
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        // Clone the response to handle any additional operations later (e.g., logging the body)
        responseClone = response.clone(); // 2
        
        // Parse the response body as JSON
        return response.json();
    })
    .then(data => {

        // Check if the login was successful
        if (data.success) {
            console.log("Login successful");

            // If the user is a vendor, redirect to the vendor page
            if (data.role == "vendor") {
                const id = data.UserID;

                // Store the vendor ID in localStorage
                localStorage.setItem('id', id.toString());
                console.log("ID : ", localStorage.getItem('id'));
                
                // Redirect to the vendor home page
                window.location.href = `${API_BASE_URL}/vendor/html/vendor-home.html`; 
            } else {
                const id = data.UserID;

                // Store the customer ID in localStorage
                localStorage.setItem('id', id);
                alert("from auth ID customer : " + localStorage.getItem('id'));

                // Check the stored status and redirect based on that
                if (localStorage.getItem("Status") === "client-purchases.html") {
                    window.location.href = `${API_BASE_URL}/client/html/client-purchases.html?orderID=none`;
                }
                if (localStorage.getItem("Status") === "client-specific-products.html") {
                    window.location.href = `${API_BASE_URL}/client/html/client-specific-product.html?productID=none&boothID=none`;
                }
                if (localStorage.getItem("Status") === "client-product.html") {
                    window.location.href = `${API_BASE_URL}/client/html/client-products.html?id=none`;
                } else {
                    // Redirect to the customer home page if no other conditions are met
                    window.location.href = `${API_BASE_URL}/client/html/client-home.html`; 
                }
            }
        } else {
            // If login failed, log the error message and alert the user
            console.error(data.message);
            alert(data.message || 'Login failed');
        }
    },
    
    /**
     * This function handles errors when the response CANNOT be parsed as JSON
     * or other unexpected issues occur.
     */
    function (rejectionReason) { // 3
        console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
        
        // Attempt to log the response body as text if it's not valid JSON
        responseClone.text() // 5
        .then(function (bodyText) {
            console.log('Received the following instead of valid JSON:', bodyText); // 6
        });
    })
    .catch(error => {
        // Catch any other errors in the fetch request process
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}
