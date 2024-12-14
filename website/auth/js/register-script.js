/**
 * Handles form submission for the registration process. 
 * It validates the input fields and if valid, proceeds to handle the registration.
 * Displays error messages if any validation fails.
 */
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    let isValid = true; // Flag to track overall form validity

    // Clear previous error messages
    document.getElementById('firstNameError').textContent = '';
    document.getElementById('lastNameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';

    // First Name validation
    const firstName = document.getElementById('firstName').value;
    if (firstName.length < 3) { // Checks if the first name is at least 3 characters long
        document.getElementById('firstNameError').textContent = 'Name must be at least 3 characters long.';
        isValid = false;
    }

    // Last Name validation
    const lastName = document.getElementById('lastName').value;
    if (lastName.length < 3) { // Checks if the last name is at least 3 characters long
        document.getElementById('lastNameError').textContent = 'Name must be at least 3 characters long.';
        isValid = false;
    }

    // Email validation
    const email = document.getElementById('email').value;
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; // Regex to validate email format
    if (!email.match(emailPattern)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email.';
        isValid = false;
    }

    // Password validation
    const password = document.getElementById('password').value;
    if (password.length < 6) { // Checks if the password is at least 6 characters long
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters long.';
        isValid = false;
    }

    // Confirm Password validation
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) { // Checks if password and confirm password match
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match.';
        isValid = false;
    }

    // If all validations pass, proceed with registration
    if (isValid) {
        handleRegistration(password); // Calls handleRegistration if the form is valid
    }
});

/**
 * Handles the registration process by sending the form data to the server.
 * If successful, redirects the user to the login page. Otherwise, displays an error message.
 * @param {string} password - The password entered by the user (used for form data submission).
 */
function handleRegistration(password) {
    event.preventDefault(); // Prevents default form submission

    // Gather form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: password,
        action: 'signUp' // Specifies the action to be taken by the server
    };

    // Sends a POST request to the server to handle registration
    fetch('../../../backend/php/auth/authRoutes.php', {
        method: 'POST', // HTTP method used to send data
        body: JSON.stringify(formData), // Data to send in the request body
        headers: {
            'Content-Type': 'application/json' // Indicates that the body contains JSON data
        }
    })
    .then(response => {
        // Check if the server response is successful
        if (!response.ok) {
            throw new Error('Network response was not ok'); // If not, throw an error
        }
        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        // If registration is successful, redirect to login page
        if (data.success) {
            console.log("Registration successful");
            window.location.href = '../html/login.html'; // Redirect to login page
        } else {
            console.error(data.error); // Log error if registration failed
            alert(data.error || 'Registration failed'); // Show error message
        }
    })
    .catch(error => {
        // Catch any errors during the fetch process
        console.error('Error:', error);
        alert('An error occurred. Please try again.'); // Show error alert
    });
}

/**
 * Listens for changes in the user type selection and updates the label text accordingly.
 */
document.getElementById('userType').addEventListener('change', function() {
    const label = document.getElementById('userTypeLabel');
    // Updates label text based on the checkbox status
    if (this.checked) {
        label.textContent = 'Vendor'; // If checked, set label to 'Vendor'
    } else {
        label.textContent = 'Customer'; // If not checked, set label to 'Customer'
    }
});