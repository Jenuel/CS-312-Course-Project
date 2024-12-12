document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let isValid = true;

    // Clear previous error messages
    document.getElementById('firstNameError').textContent = '';
    document.getElementById('lastNameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';

    // First Name validation
    const firstName = document.getElementById('firstName').value;
    if (firstName.length < 3) {
        document.getElementById('firstNameError').textContent = 'Name must be at least 3 characters long.';
        isValid = false;
    }

    //Last Name validation
    const lastName = document.getElementById('lastName').value;
    if (lastName.length < 3) {
        document.getElementById('lastNameError').textContent = 'Name must be at least 3 characters long.';
        isValid = false;
    }

    // Email validation
    const email = document.getElementById('email').value;
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email.';
        isValid = false;
    }

    // Password validation
    const password = document.getElementById('password').value;
    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters long.';
        isValid = false;
    }

    // Confirm password validation
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match.';
        isValid = false;
    }

    if (isValid) {
        handleRegistration(password);
    }
});

function handleRegistration(password) {
    event.preventDefault(); // Prevent form from submitting the default way

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: password,
        action: 'signUp'
    };

    fetch('../../../backend/php/auth/authRoutes.php', {
        method: 'POST',
        body: JSON.stringify(formData), 
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("Registration successful"); 
            window.location.href = '../html/login.html';   
        } else {
            console.error(data.error);
            // Show error message to the user
            alert(data.error || 'Registration failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

document.getElementById('userType').addEventListener('change', function() {
    const label = document.getElementById('userTypeLabel');
    if (this.checked) {
        label.textContent = 'Vendor'; 
    } else {
        label.textContent = 'Customer';
    }
});
