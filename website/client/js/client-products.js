const urlParams = new URLSearchParams(window.location.search); // connecting to url params of html
let boothId = 0;
/*
checking value in url parameter
*/
if((urlParams.get('id'))==="none"){

    const customerId = localStorage.getItem('id');// get customer id 
  
    const hasCart =  getCart(customerId); //  result of getCart
  
    if(hasCart){// a pedning order exists
      console.log("customer has existing cart")
    }else{
      window.location.href = 'http://localhost:8080/client/html/client-home.html';
    }
  
  }else{ // id has value
    boothId = urlParams.get('id');
    alert("from products bothid: "+boothId); // REMOVE BEFORE PASSING
    localStorage.setItem('BoothId',boothId);
    alert("from products bothid storage: "+localStorage.getItem('BoothId'));// REMOVE BEFORE PASSING

  } 

function getData() {
  const searchInput = document.querySelector('input[type="search"]').value.trim();
  const filterSelect = document.getElementById('filter').value;
  const orderSelect = document.getElementById('order').value;
  fetchProducts(boothId, searchInput, filterSelect, orderSelect);
}

function displayProducts(products) {
    const container = document.querySelector(".row.gx-4.gx-lg-5.row-cols-2.row-cols-md-3.row-cols-xl-4.justify-content-center");
    container.innerHTML = ""; // Clear any previous product cards
  

    if (products.length === 0) {
      // Show no results message
      container.innerHTML = `
          <div class="col-12 text-center">
              <p class="text-muted my-5">No products found matching your criteria.</p>
          </div>
      `;
      return;
  }


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
function fetchProducts(boothId, search = '', filter = 'all', order = 'asc') {
  let queryParams = new URLSearchParams();
  queryParams.append('sort', `name:${order}`);

  if (filter !== 'all') {
    queryParams.append('filter', 'active');
}

  fetch(`http://localhost:3000/products/booth/${boothId}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      let filteredProducts = data;

      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
            product.Name.toLowerCase().includes(searchLower)
        );
    }

    // Apply stock filter
    if (filter === 'in-stock') {
        filteredProducts = filteredProducts.filter(product => product.Stocks > 0);
    } else if (filter === 'out-of-stock') {
        filteredProducts = filteredProducts.filter(product => product.Stocks === 0);
    }

    // Sort products
    filteredProducts.sort((a, b) => {
        const nameA = a.Name.toLowerCase();
        const nameB = b.Name.toLowerCase();
        if (order === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
          product.Name.toLowerCase().includes(searchLower)
      );
  }

  // Apply stock filter
  if (filter === 'in-stock') {
      filteredProducts = filteredProducts.filter(product => product.Stocks > 0);
  } else if (filter === 'out-of-stock') {
      filteredProducts = filteredProducts.filter(product => product.Stocks === 0);
  }

  // Sort products
  filteredProducts.sort((a, b) => {
      const nameA = a.Name.toLowerCase();
      const nameB = b.Name.toLowerCase();
      if (order === 'asc') {
          return nameA.localeCompare(nameB);
      } else {
          return nameB.localeCompare(nameA);
      }
  });

      displayProducts(filteredProducts);
  })
  .catch(error => {
      console.error("Error fetching products:", error);
      alert("Failed to load products. Please try again.");
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
  let cid = parseInt(customerId);
  fetch(`http://localhost:3000/orders/checkPendingOrder/${cid}`, { // URL for Cancel order
    method: 'GET', 
    headers: {
        'Content-Type': 'application/json', 
    },
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
           
          
          localStorage.setItem('BoothId',data[0]['Booth ID']);

          const boothIdData = data[0]['Booth ID'];
          boothId =boothIdData;

          const orderId = data[0]['Order ID'];
          localStorage.setItem("OrderId",orderId);
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


/*
logout
*/
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

    localStorage.setItem("Status", "client-product.html");  // adding status
}

document.addEventListener('DOMContentLoaded', () => {
  // Set up My Purchases link (just once)
  const myPurchasesLink = document.getElementById('my-purchases');
  if (myPurchasesLink) {
      myPurchasesLink.href = `client-purchases.html?id=${boothId}`;
  }

  // Set up search and filter handlers
  const searchForm = document.querySelector('form[role="search"]');
  const searchInput = document.querySelector('input[type="search"]');
  const filterSelect = document.getElementById('filter');
  const orderSelect = document.getElementById('order');
  const logoutBtn = document.getElementById("logout-btn");

  //\
  searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      getData();
  });

  // Handle filter and sort changes
  filterSelect.addEventListener('change', getData);
  orderSelect.addEventListener('change', getData);

  // Handle logout
  if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          logout();
      });
  }

  // Initial load of products (just once)
  getData();
});
