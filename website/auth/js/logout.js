

function logout() {
    fetch('http://localhost/CS-312-Course-Project/backend/php/auth/logout.php' + new URLSearchParams({
        logout: 'true',
    }).toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('sessionID')  
        },


    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        responseClone = response.clone()
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            window.location.href = 'http://localhost/CS-312-Course-Project/website/auth/html/login.html'
        }

        
    },

    function (rejectionReason) { // 3
        console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
        responseClone.text() // 5
        .then(function (bodyText) {
            console.log('Received the following instead of valid JSON:', bodyText); // 6
        });

    })

   
    .catch(error => {
        console.error('Request failed', error);
    });
}

