API_BASE_URL = "10.241.155.155";
let box = document.querySelector(".booth-container"); // where the child will be appended

// Variables for search and sort input
let searchInput = document.querySelector(".searchbox");
let sortSelect = document.getElementById("sortDropdown");
let boothId = 0;

/* ----------------------------------------------------------------------------------------------------- */
// THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER

/**
 * Fetch for retrieving booths (GET)
 */
function getData() {
  // Use the formData object for filter and order params
  fetch(`http://${API_BASE_URL}:8080/php/boothOps/boothRoutes.php`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Pass filter and order in query params or as part of the body, depending on how your server handles them.
    // Assuming the server expects query parameters, you can build a URL with them:
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if there's a response body before parsing
      if (response.headers.get("content-length") === "0") {
        return null; // No content
      }

      return response.json();
    })
    .then((data) => {
      if (data) {
        if (data.error) {
          console.error("Error:", data.error);
        } else {
          let filteredData = data;

          if (searchInput) {
            filteredData = data.filter((booth) =>
              booth.Title.toLowerCase().includes(
                searchInput.value.toLowerCase()
              )
            );
          }

          console.log(sortSelect.value);
          // Sort the filtered data based on the selected option
          filteredData.sort((a, b) => {
            if (sortSelect.value === "desc") {
              return b.Title.localeCompare(a.Title);
            }
            return a.Title.localeCompare(b.Title);
          });

          console.log("Booths data:", filteredData);

          let booth = localStorage.getItem("BoothId");
          if (booth != undefined) {
            window.location.href = `http://${API_BASE_URL}:8080/client/html/client-products.html?id=${localStorage.getItem(
              "BoothId"
            )}`;
          } else {
            displayBooths(filteredData);
          }
        }
      }
    })
    .catch((error) => {
      console.error("Request failed", error);
    });
}

function logout() {
  fetch("/php/auth/logout.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "logout=true",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        window.location.href = "/auth/html/index.html";
      } else {
        throw new Error(data.message || "Logout failed");
      }
    })
    .catch((error) => {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
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
            <img src="${
              booth.BoothIcon
                ? `data:image/png;base64,${booth.BoothIcon}`
                : "https://via.placeholder.com/150"
            }" 
                 class="card-img-top" 
                 alt="Booth ${booth.Title} Image">
            <div class="card-body">
              <h5 class="card-title">${booth.Title}</h5>
              <p class="card-text">Status: ${booth.Status}</p>
              <p class="card-text">Operating Days: ${
                booth.Schedules || "N/A"
              }</p>
              <p class="card-text">Location: ${booth.Location || "N/A"}</p>
              <p class="card-text">Description: ${booth.Description}</p>
              <a href="client-products.html?id=${
                booth.BoothID
              }" class="btn btn-primary">View Details</a>
            </div>
          </div>
        </div>
      `;

    // Append the card to the container
    container.innerHTML += cardHTML;
  });
}

// Call getData to fetch the booth data when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  searchInput.addEventListener("input", getData);
  sortSelect.addEventListener("change", getData);
  getData();
});

function getCart(customerId) {
  let cid = parseInt(customerId);
  fetch(`http://${API_BASE_URL}:3000/orders/checkReservedOrder/${cid}`, {
    // URL for Cancel order
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // add handling of data
      if (data.error) {
        // Handle the error message if the response contains an error
        console.error("Error:", data.error);
      } else {
        /*
     [
        {
            "Booth ID": 1,
            "Order ID": 123,
            "Grand total": 150.00,
            "Product ID": 101,
            "Quantity": 2,
            "Total price per product": 30.00,
            "Product Name": "Product A",
            "Product Image": "iVBORw0KGgoAAAANSUhEUgAA... (base64-encoded image)",
            "Product price": 69.0
        },
        {
            "Booth ID": 2,
            "Order ID": 123,
            "Grand total": 150.00,
            "Product ID": 102,
            "Quantity": 3,
            "Total price per product": 60.00,
            "Product Name": "Product B",
            "Product Image": "iVBORw0KGgoAAAANSUhEUgAA... (base64-encoded image)",
            "Product price": 69.0
        }
      ]

      sample handling of data 
        // Arrays to hold product IDs, quantities, and totals
           const orderId = data[0]['Order ID'];
           const grandTotal = data[0]['Grand total'];
           const boothIdData = data[0]['Booth ID'];
           const productIds = [];
           const quantities = [];
           const totals = [];
           const name = [];
           const image = [];
           const price = [];
 
           // Loop through the response data and extract the required values
           data.forEach(product => {
               productIds.push(product['Product ID']);
               quantities.push(product['Quantity']);
               totals.push(product['Total price per product']);
               name.push(product['Product Name']);
               image.push(product['Product Image']);
               price.push(product['Product price']);
           });
      */

        const orderId = data[0]["Order ID"];
        localStorage.setItem("OrderId", orderId);
      }
    })
    .catch((error) => {
      console.error("Error cancelling order:", error);
    });
}

if (getCart(localStorage.getItem("id"))) {
  window.location.href = `http://${API_BASE_URL}:8080/client/html/client-products.html?id=${localStorage.getItem(
    "BoothId"
  )}`;
}
