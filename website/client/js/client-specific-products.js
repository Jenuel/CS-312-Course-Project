const API_BASE_URL = 'http://10.241.155.155:8080';
const API_BASE_URL_NODE = 'http://10.241.155.155:3000';
let cart = [];
let grandTotal = 0 ;

const urlParams = new URLSearchParams(window.location.search);
let boothId = 0;
if (urlParams.get("boothId") === "none") {
  const localStorageId = localStorage.getItem("id"); // get customer id

  const hasCart = getCart(localStorageId); //  result of getCart

  if (hasCart) {
    // a pedning order exists
    console.log("customer has existing cart");
  } else {
    window.location.href = `${API_BASE_URL}/client/html/client-home.html`;
  }
} else {
  // boothId = urlParams.get('boothId');
  boothId = localStorage.getItem("BoothId");
  alert("boothid = " + boothId);
}
alert("from specs boothid" + localStorage.getItem("BoothId"));

document.addEventListener("DOMContentLoaded", () => {
  const backToProductsButton = document.getElementById("backToProducts");
  const addToCartBtn = document.getElementById("addToCart");

  addToCartBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const boothId = localStorage.getItem("BoothId");
    window.location.href = `client-products.html?id=${boothId}`;
  });

  backToProductsButton.addEventListener("click", (event) => {
    event.preventDefault();
    const boothId = localStorage.getItem("BoothId");
    window.location.href = `client-products.html?id=${boothId}`;
  });

  const productId = urlParams.get("productID");
  if (productId) {
    getSpecificProduct(productId);
    localStorage.setItem("currentpId", productId);
  } else {
    console.error("Product ID is missing in the URL parameters.");
  }
});

function displaySpecificProduct(product) {
  console.log("Product received in displaySpecificProduct:", product);

  const container = document.querySelector(".container.px-4.px-lg-5.my-5");
  if (!container) {
    console.error("Container element not found. Check your HTML structure.");
    return;
  }

  const {
    Name: productName = "Unknown Product",
    Price: productPrice = 0.0,
    Image,
    ProductID,
  } = product[0] || {};

  const productImage = Image
    ? `data:image/png;base64,${Image}`
    : "https://dummyimage.com/450x300/dee2e6/6c757d.jpg";

  container.innerHTML = `
        <div class="row gx-4 gx-lg-5 align-items-center">
            <div class="col-md-6">
                <img id="product-image" class="card-img-top mb-5 mb-md-0" 
                    src="${productImage}" 
                    alt="${productName}" />
            </div>
            <div class="col-md-6">
                <h1 id="product-name" class="display-5 fw-bolder">${productName}</h1>
                <div class="fs-5 mb-2">
                    <span id="product-price">₱${parseFloat(
                      productPrice
                    ).toFixed(2)}</span>
                </div>
                <p id="product-description" class="lead">Product Description</p>
                <div class="d-flex flex-column">
                    <div class="d-flex align-items-center mb-3">
                        <label for="quantityInput" class="me-2">Quantity:</label>
                        <input type="number" 
                               id="quantityInput" 
                               min="1" 
                               value="1" 
                               class="form-control" 
                               style="width: 5rem;">
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="fs-5">Total: ₱<span id="cart-total">${parseFloat(
                          productPrice
                        ).toFixed(2)}</span></span>
                        <button class="btn btn-primary" 
                                type="button" 
                                onclick="addToCart(
                                    this.parentElement.parentElement.querySelector('#quantityInput').value,
                                    ${ProductID},
                                    ${parseFloat(productPrice)}
                                )">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

  // Add event listener for quantity changes
  const quantityInput = container.querySelector("#quantityInput");
  quantityInput.addEventListener("input", (e) => {
    const quantity = parseInt(e.target.value) || 1;
    updateTotal(quantity, productPrice);
  });

  // Set initial total
  updateTotal(1, productPrice);
}

function initializeCart() {
    // Clear existing cart data
    cart = [];
    grandTotal = 0;
    
    // Check if there's an existing order
    const orderId = localStorage.getItem("OrderID");
    if (orderId) {
        // Load existing cart data if needed
        const existingCart = localStorage.getItem(`cart_${orderId}`);
        if (existingCart) {
            cart = JSON.parse(existingCart);
            grandTotal = cart.reduce((sum, item) => {
                const [, , itemTotal] = item.split(",");
                return sum + parseFloat(itemTotal);
            }, 0);
        }
    }
}

function addToCart(quantity, ProductID, Price) {
    if (cart.length === 0) {
        initializeCart();
    }
    
    const totalPrice = parseFloat(quantity) * parseFloat(Price);
    cart.push(`${ProductID},${quantity},${totalPrice.toFixed(2)}`);

    // Recalculate grand total from scratch
    grandTotal = cart.reduce((sum, item) => {
        const [, , itemTotal] = item.split(",");
        return sum + parseFloat(itemTotal);
    }, 0);


    if (localStorage.getItem("OrderID")) {
        const orderId = parseInt(localStorage.getItem("OrderID"), 10);
        // Save cart state before adding to order
        localStorage.setItem(`cart_${orderId}`, JSON.stringify(cart));
        addToOrder(orderId, cart);
    } else {
        const cid = localStorage.getItem("id");
        const boothId = localStorage.getItem("BoothId");
        createOrder(boothId, cart, grandTotal, cid);
    }

    // Clear cart after creating/updating order
    cart = [];
    grandTotal = 0;
    
    window.location.href = `client-products.html?id=${boothId}`;
}

function checkout() {
  alert("Checking out products");
  window.location.href = `client-purchases.html?orderID=${sessionStorage.getItem(
    "OrderID"
  )}`; // NEED TO FIND LIKE A SET OF VALUE GANUN
}

/* -------------------------------------Fetch Functions------------------------------------- */

/*
function to get the detils of a specific product
FROM: productController.js
*/
function getSpecificProduct(productId) {
  fetch(`${API_BASE_URL_NODE}/products/details/${productId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) =>
      response.ok ? response.json() : Promise.reject(response)
    )
    .then((data) => {
      console.log("Product data fetched successfully:", data);
      const { Status = "inactive" } = data[0] || {};
      if (Status.toLowerCase() === "active") {
        displaySpecificProduct(data);
      } else {
        alert("The requested product is not available.");
      }
    })
    .catch((error) => console.error("Error fetching product:", error));
}

/*
funtion for creating new order by a customer
FROM: orderController.js
*/
function createOrder(boothID, data, totalPrice, customerID) {
  console.log(customerID);
  const formattedProducts = data.map((entry) => {
    const [productID, quantity, totalPricePerProduct] = entry.split(",");
    return {
      productID: parseInt(productID, 10),
      quantity: parseInt(quantity, 10),
      totalPricePerProduct: parseFloat(totalPricePerProduct).toFixed(2),
    };
  });

  console.log("id: ", boothId);
  console.log("id: ", customerID);
 

  // Ensure the total price is a float (not a string)
  // Ensure the total price is a float (not a string)
  const formattedTotalPrice = parseFloat(totalPrice);
  const id = parseInt(customerID, 10);

  const payload = {
    products: formattedProducts,
    totalPrice: formattedTotalPrice, // Send as a number, not a string
    date: new Date().toISOString().slice(0, 19).replace("T", " "),
    customerId: id,
  };

  console.log("payload: ", payload);
  fetch(`${API_BASE_URL_NODE}/orders/create/${boothID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((err) => {
          throw new Error(err);
        });
      }
      return response.json(); // Parse the JSON response if it's okay
    })
    .then((orderData) => {
      console.log("Order created successfully:", orderData);
      sessionStorage.setItem("OrderID", orderData.id); // Save OrderID to sessionStorage
    })
    .catch((error) => {
      console.error("Error creating order:", error);
      alert(`Error creating order: ${error.message}`); // Provide an error message
    });
}

/*
function to add a product to an EXISTING order
FROM: orderController.js
*/
function addToOrder(orderID, data) {
  let productID = localStorage.getItem("currentpId");

  console.log("addtoorder", productID);

  const id = parseInt(productID, 10);

  const formattedProducts = data.map((entry) => {
    const [id, quantity, totalPricePerProduct] = entry.split(",");
    return {
      productID: id,
      quantity: parseInt(quantity, 10),
      totalPricePerProduct: parseFloat(totalPricePerProduct).toFixed(2),
    };
  });

  const payload = {
    products: formattedProducts,
    quantity: parseInt(quantity, 10),
    totalPricePerProduct: parseFloat(totalPricePerProduct).toFixed(2),
    productID: id,
  };

  console.log(payload);

  fetch(`${API_BASE_URL_NODE}/orders/addToOrder/${orderID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) =>
      response.ok ? response.json() : Promise.reject(response)
    )
    .then((orderData) => {
      console.log("Order created successfully:", orderData);
      sessionStorage.setItem("OrderID", orderData.id);
      // Update stocks for each product
    })
    .catch((error) => console.error("Error creating order:", error));
}
/*
use to get ordered that are in reserves status of a customer
FROM: orderController.js
*/
function getCart(customerId) {
  let cid = parseInt(customerId);
  fetch(`${API_BASE_URL_NODE}/orders/checkReservedOrder/${cid}`, {
    // URL for Cancel order
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "cancelled" }),
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

        const boothIdData = data[0]["Booth ID"];

        boothId = boothIdData;

        const orderId = data[0]["Order ID"];
        localStorage.setItem("OrderId", orderId);

        localStorage.setItem("BoothId", data[0]["Booth ID"]);
      }
    })
    .catch((error) => {
      console.error("Error cancelling order:", error);
    });
}

/**
 * Fetch for order cancelation (PATCH)
 * @param {Integer} orderId 
 */
function cancelOrder(orderId) {
  fetch(`${API_BASE_URL_NODE}/orders/cancel/${orderId}`, { // URL for Cancel order
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


/* -------------------------------------End Fetch Functions------------------------------------- */


function updateTotal(quantity, price) {
  const totalElement = document.getElementById("cart-total");
  if (!totalElement) {
    console.error("Cart total element not found");
    return;
  }

  const total = quantity * price;
  totalElement.textContent = total.toFixed(2);
  return total;
}

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

  localStorage.setItem("Status", "client-specific-products.html"); // adding status
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }
  getData();
});
