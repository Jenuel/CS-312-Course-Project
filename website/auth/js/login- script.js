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
        // mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData), 
    })
    .then(response => {
        
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        responseClone = response.clone(); // 2
        return response.json();
    })
  
    .then(data => {
        if (data.success) {
            console.log("Login successful"); 
            if(data.role == "vendor"){ //checks the role of the newly authenticated user
                const id = data.UserID;
                // set your values in the first page
                localStorage.setItem('id', id);
                console.log("ID : ", id);
                window.location.href = 'http://localhost:8080/vendor/html/vendor-home.html';//redirect to vendor side
              
            } else {
                const id = data.UserID;
                localStorage.setItem('id', id);
                console.log("ID customer : ", id);
                if(localStorage.getItem("Status") === "client-purchases.html"){
                    window.location.href = 'http://localhost:8080/client/html/client-purchases.html?orderID=none';
                }
                if(localStorage.getItem("Status") === "client-specific-products.html"){
                    window.location.href = 'http://localhost:8080/client/html/client-specific-product.html?productID=none&boothID=none';
                }
                if(localStorage.getItem("Status") === "client-product.html"){
                    window.location.href = 'http://localhost:8080/client/html/client-products.html?id=none';
                }else{
                    window.location.href = 'http://localhost:8080/client/html/client-home.html'; //redirect to customer side
                }
                
                
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
