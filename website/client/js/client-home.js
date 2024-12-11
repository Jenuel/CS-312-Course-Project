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
    const container = document.querySelector("#booth-container"); // Select the container where the cards will go
    container.innerHTML = ""; // Clear any existing content
  
    booths.forEach((booth) => {
      // Create the card HTML using the booth data
      const cardHTML = `
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${booth.BoothIcon ? `data:image/png;base64,${booth.BoothIcon}` : 'https://via.placeholder.com/150'}" 
                 class="card-img-top" 
                 alt="Booth ${booth.Title} Image">
            <div class="card-body">
              <h5 class="card-title">${booth.Title}</h5>
              <p class="card-text">Status: ${booth.Status}</p>
              <p class="card-text">Operating Days: ${booth.Schedules || 'N/A'}</p>
              <p class="card-text">Location: ${booth.Location || 'N/A'}</p>
              <p class="card-text">Description: ${booth.Description}</p>
              <a href="client-products.html?id=${booth.BoothID}" class="btn btn-primary">View Details</a>
            </div>
          </div>
        </div>
      `;
  
      // Append the card to the container
      container.innerHTML += cardHTML;
    });
  
}

// Call getData to fetch the booth data when the page loads
getData();