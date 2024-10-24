function handleLogin(event) {
    event.preventDefault(); // Prevent form from submitting the default way

    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        action: 'signIn'
    };

   
    fetch('http://localhost/CS-312-Course-Project/backend/php/auth/authRoutes.php', {
        method: 'POST',
        body: JSON.stringify(formData), 
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(response);
        
        if (!response.ok) {
            console.log("success")
            throw new Error('Network response was not ok');
        } else {
            console.log("failure")
        }
        return response.json();
    })
  
    .then(data => {
        if (data.success) {
            console.log("Login successful"); 
            if(data.role == "vendor"){ //checks the role of the newly authenticated user
                window.location.href = 'http://localhost/CS-312-Course-Project/website/client/html/client-home.html';//redirect to vendor side
            } else {
                window.location.href = 'http://localhost/CS-312-Course-Project/website/vendor/html/vendor-home.html'; //redirect to customer side
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
