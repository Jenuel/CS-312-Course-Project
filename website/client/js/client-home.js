let box = document.querySelector(".booth-container"); // where the child will be appended

// Get filter and order values
let formData = {
    filter: document.getElementById("filter").value,
    order: document.getElementById("order").value
};

/* ----------------------------------------------------------------------------------------------------- */
// THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER

/**
 * Fetch for retrieving booths (GET)
 */
function getData() {
    // Use the formData object for filter and order params
    fetch('http://localhost:8080/php/boothOps/boothRoutes.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // Pass filter and order in query params or as part of the body, depending on how your server handles them.
        // Assuming the server expects query parameters, you can build a URL with them:

    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if there's a response body before parsing
        if (response.headers.get("content-length") === "0") {
            return null; // No content
        }

        return response.json();
    })
    .then(data => {
        if (data) {
            if (data.error) {
                console.error('Error:', data.error);
            } else {
                console.log('Booths data:', data);
                displayBooths(data);
            }
        } else {
            console.warn('Empty response from server');
        }
    })
    .catch(error => {
        console.error('Request failed', error);
    });
}

// END FOR FETCH FUNCTIONS
/* ----------------------------------------------------------------------------------------------------- */

// Function to display booths dynamically
function displayBooths(booths) {
    box.innerHTML = "";  // Clear previous booths

    booths.forEach((booth, index) => { 
        let valueDiv = document.createElement('div'); 
        valueDiv.classList.add('item');
        
        // Creating the information of the booth
        valueDiv.innerHTML = `
            <a href="client-products.html" class="box">
                <div class="booth-header">
                    <h2>Booth ${index + 1}</h2>  <!-- Display booth number -->
                </div>
                <div class="booth status">
                    <p class="label">STATUS</p>
                    <p class="content">${booth.status}</p>  <!-- Dynamically set booth status -->
                </div>
                <div class="booth schedule">
                    <p class="label">SCHEDULE</p>
                    <p class="content">${booth.schedule}</p>  <!-- Dynamically set booth schedule -->
                </div> 
                <div class="booth location">
                    <p class="label">LOCATION</p>
                    <p class="content">${booth.location}</p>  <!-- Dynamically set booth location -->
                </div>
                <div class="booth description">
                    <p class="label">DESCRIPTION</p>
                    <p class="content">${booth.description}</p>  <!-- Dynamically set booth description -->
                </div>    
            </a>`;

        // Adding event listener for redirecting to the details page of the booth
        valueDiv.addEventListener('click', function() {
            window.location.href = `boothDetails.html?id=${booth.id}`;  // Redirect to booth details page
        });

        box.appendChild(valueDiv);  // Append the booth to the container
    });
}

// Call getData to fetch the booth data when the page loads
getData();