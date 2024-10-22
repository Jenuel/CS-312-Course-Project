function handleLogin(event) {
    event.preventDefault(); // Prevent form from submitting the default way

    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        action: 'signIn'
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
            console.log("Login successful"); 
            if(data.role == "vendor"){ //checks the role of the newly authenticated user
                window.location.href = '../../vendor/html/client-home.html';//redirect to vendor side
            } else {
                window.location.href = '../../client/html/vendor-home.html'; //redirect to customer side
            }                
        } else {
            console.error(data.message);
            // Show error message to the user
            alert(data.message || 'Login failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}
