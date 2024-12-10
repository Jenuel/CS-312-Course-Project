function handleLogin(event) {
    event.preventDefault(); // Prevent form from submitting the default way

    let formData = {
        email: document.getElementById('username').value,
        password: document.getElementById('password').value,
        action: 'signIn'
    };


    var responseClone; // 1
   
    fetch('http://localhost:8080/php/auth/authRoutes.php', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData), 
    })
    .then(response => {
        
        
        if (!response.ok) {
            console.log("success")
            throw new Error('Network response was not ok');
        } else {
            console.log("failure")
        }
        responseClone = response.clone(); // 2
        return response.json();
    })
  
    .then(data => {
        if (data.success) {
            console.log("Login successful"); 
            if(data.role == "vendor"){ //checks the role of the newly authenticated user
                window.location.href = 'http://localhost:8080/vendor/html/vendor-home.html';//redirect to vendor side
            } else {
                window.location.href = 'http://localhost:8080/client/html/client-home.html'; //redirect to customer side
            }                
        } else {
            console.error(data.message);
            // Show error message to the user
            alert(data.message || 'Login failed');
        }
    }, 


    
    function (rejectionReason) { // 3
        console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
        responseClone.text() // 5
        .then(function (bodyText) {
            console.log('Received the following instead of valid JSON:', bodyText); // 6
        });

    }

 

    )
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}
