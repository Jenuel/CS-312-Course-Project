const urlParams = new URLSearchParams(window.location.search);
const boothId = urlParams.get('id'); 

function myPurchases() {
  alert("Checking out products");
  window.location.href = `client-purchases.html?orderID=${orderID}`;// NEED TO FIND LIKE A SET OF VALUE GANUN
}


    // Function to dynamically set the "My Purchases" URL
    document.addEventListener('DOMContentLoaded', () => {
      const myPurchasesLink = document.getElementById('my-purchases');

      if (customerID) {
        // Append the customerID as a query parameter to the URL
        myPurchasesLink.href = `client-purchases.html?id=${boothId}`;
      } else {
        console.warn('booth id not found!');
      }
    });

let box = document.querySelector(".product-list"); 

function displayProducts(products) {
    const container = document.querySelector(".row.gx-4.gx-lg-5.row-cols-2.row-cols-md-3.row-cols-xl-4.justify-content-center");
    container.innerHTML = ""; // Clear any previous product cards
  
    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("col", "mb-5");
  
      // Convert Price to a number and handle invalid values
      const price = product.Price ? parseFloat(product.Price) : null;
  
      productDiv.innerHTML = `
        <div class="card h-100"  style="min-height: 500px;">
          <img 
            class="card-img-top" 
            src="${product.Image ? `data:image/png;base64,${product.Image}` : 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg'}" 
            alt="${product.Name}" 
          />
          <div class="card-body p-4">
            <div class="text-center">
              <h5 class="fw-bolder">${product.Name}</h5>
              <span>${price !== null ? `₱${price.toFixed(2)}` : "Price not available"}</span>
            </div>
          </div>
          <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center">
              ${product.Stocks > 0 ? `
                <a class="btn btn-outline-primary mt-auto" href="client-specific-product.html?productID=${product.ProductID}&boothID=${boothId}">See more</a>
              ` : `
                <button class="btn btn-outline-primary mt-auto" disabled>Out of Stock</button>
              `}
            </div>
          </div>
        </div>
      `;
  
      container.appendChild(productDiv); // Append each product card to the container
    });
  }

  function cancelOrders(){
    cancelOrder(orderID);
  }
  

/* ----------------------------------------------------------------------------------------------------- */
// THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER

/**
 * Fetch for retrieving products (GET)
 * @param {Integer} boothId 
 * @param {String} type  choices: name || price 
 * @param {String} order  choices: ASC || DESC
 */
function fetchProducts(boothId,type, order ) {

    type = 'name';
    order = 'asc';

    fetch(`http://localhost:3000/products/booth/${boothId}?filter=active&sort=${type}:${order}`, { 
        method: 'GET',
        headers: {
            "Content-type": 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        /*
        sample data output
        [
            {
                "Name": "Handmade Bracelet",
                "Status": "active",
                "Image": "base64"
            },
            {
                "Name": "Handmade Bracelet",
                "Status": "active",
                "Image": "base64"
            }
        ]
        */
        console.log("Products fetched successfully:", data);

        displayProducts(data);
    })
    .catch(error => {
        console.error("Error purchasing product:", error);
    });
}


function cancelOrder(orderId) {
  fetch(`http://localhost:3000/orders/cancel/${orderId}`, { // URL for Cancel order
      method: 'PATCH', 
      headers: {
          'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ status: 'cancelled' }), 
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      // data is a json massgae no parsing needed
      console.log("Order cancelled successfully:", data);
  })
  .catch(error => {
      console.error("Error cancelling order:", error);
  });
}

function getCart(customerId){
  fetch(`http://localhost:3000/orders/checkPendingOrder/${customerId}`, { // URL for Cancel order
    method: 'PATCH', 
    headers: {
        'Content-Type': 'application/json', 
    },
    body: JSON.stringify({ status: 'cancelled' }), 
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      // add handling of data 
      if (data.error) {
        // Handle the error message if the response contains an error
        console.error("Error:", data.error);
    } else {
           // Arrays to hold product IDs, quantities, and totals
           const orderId = data[0]['Order ID'];
           const grandTotal = data[0]['Grand total'];
           const productIds = [];
           const quantities = [];
           const totals = [];
 
           // Loop through the response data and extract the required values
           data.forEach(product => {
               productIds.push(product['Product ID']);
               quantities.push(product['Quantity']);
               totals.push(product['Total price per product']);
           });
 
    }
  })
  .catch(error => {
      console.error("Error cancelling order:", error);
  });
}



//END FOR FETCH FUNCTIONS
/* ----------------------------------------------------------------------------------------------------- */

/*
Helper function to convert base64 --> image
*/


// Function to create an image element from Base64
function base64ToImage(base64, mimeType = 'image/png') {
    const img = new Image();
    img.src = `data:${mimeType};base64,${base64}`;
    return img; // Return the image element
}

fetchProducts(boothId);