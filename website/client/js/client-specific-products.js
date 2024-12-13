let cart = [];
let grandTotal = sessionStorage.getItem("Grandtotal")
    ? parseFloat(sessionStorage.getItem("Grandtotal"))
    : 0.0;

const urlParams = new URLSearchParams(window.location.search);
let boothId = 0;
if((urlParams.get('boothId'))==="none"){

    const localStorageId = localStorage.getItem('id');// get customer id 
  
    const hasCart =  getCart(localStorageId); //  result of getCart
  
    if(hasCart){// a pedning order exists
      console.log("customer has existing cart")
    }else{
      window.location.href = 'http://192.168.27.140:8080/client/html/client-home.html';
    }
  
  }else{
    // boothId = urlParams.get('boothId');
    boothId = localStorage.getItem('BoothId');
    alert("boothid = "+ boothId);
  }
  alert("from specs boothid" + localStorage.getItem('BoothId'));
  

document.addEventListener("DOMContentLoaded", () => {
    const backToProductsButton = document.getElementById('backToProducts');
    backToProductsButton.addEventListener('click', (event) => {
    event.preventDefault(); 
    window.location.href = `client-products.html?id=${boothId}`; // Redirect 
}); 
    const productId = urlParams.get('productID');
    if (productId) {
        getSpecificProduct(productId);
        localStorage.setItem('currentpId', productId);
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

    const { Name: productName = "Unknown Product", 
            Price: productPrice = 0.0, 
            Image, 
            ProductID } = product[0] || {};

    const productImage = Image 
        ? `data:image/png;base64,${Image}` 
        : 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg';

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
                    <span id="product-price">₱${parseFloat(productPrice).toFixed(2)}</span>
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
                        <span class="fs-5">Total: ₱<span id="cart-total">${parseFloat(productPrice).toFixed(2)}</span></span>
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
    const quantityInput = container.querySelector('#quantityInput');
    quantityInput.addEventListener('input', (e) => {
        const quantity = parseInt(e.target.value) || 1;
        updateTotal(quantity, productPrice);
    });

    // Set initial total
    updateTotal(1, productPrice);
}

function addToCart(quantity, ProductID, Price) {
    const totalPrice = parseFloat(quantity) * parseFloat(Price);
    cart.push(`${ProductID},${quantity},${totalPrice.toFixed(2)}`);

    grandTotal += totalPrice;
    sessionStorage.setItem("Grandtotal", grandTotal.toFixed(2));

    if (localStorage.getItem("OrderID")) { // there is an existing order
        const orderId = parseInt(localStorage.getItem("OrderID"), 10);
        alert("add to order, ordeid : " + orderId);
        addToOrder(orderId, cart);
    } else { // wala pang order
        const cid = localStorage.getItem('id');// get customer id
        alert("user id is 000: "+ localStorage.getItem('id'));
        alert("user id is 123: "+ cid);
        createOrder(localStorage.getItem('BoothId'), cart, grandTotal,cid);
    }

}

function checkout() {
    alert("Checking out products");
    window.location.href = `client-purchases.html?orderID=${sessionStorage.getItem("OrderID")}`;// NEED TO FIND LIKE A SET OF VALUE GANUN
}

/* Fetch Functions */

function getSpecificProduct(productId) {
    fetch(`http://192.168.27.140:3000/products/details/${productId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => {
            console.log("Product data fetched successfully:", data);
            const { Status = "inactive" } = data[0] || {};
            if (Status.toLowerCase() === "active") {
                displaySpecificProduct(data);
            } else {
                alert("The requested product is not available.");
            }
        })
        .catch(error => console.error("Error fetching product:", error));
}

function createOrder(boothID, data, totalPrice,customerID) {

    console.log(customerID);
    const formattedProducts = data.map(entry => {
        const [productID, quantity, totalPricePerProduct] = entry.split(',');
        return {
            productID: parseInt(productID, 10),
            quantity: parseInt(quantity, 10),
            totalPricePerProduct: parseFloat(totalPricePerProduct).toFixed(2),
        };
    });

    console.log("id: " ,boothId);
    console.log("id: " ,customerID);
    
    // Ensure the total price is a float (not a string)
    // Ensure the total price is a float (not a string)
    const formattedTotalPrice = parseFloat(totalPrice); 
    const id = parseInt(customerID, 10);

    const payload = {
        products: formattedProducts,
        totalPrice: formattedTotalPrice, // Send as a number, not a string
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        customerId:id,
    };

    console.log("payload: ", payload);
    fetch(`http://192.168.27.140:3000/orders/create/${boothID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(err => { throw new Error(err); });
            }
            return response.json(); // Parse the JSON response if it's okay
        })
        .then(orderData => {
            console.log("Order created successfully:", orderData);
            sessionStorage.setItem("OrderID", orderData.id); // Save OrderID to sessionStorage
        })
        .catch(error => {
            console.error("Error creating order:", error);
            alert(`Error creating order: ${error.message}`); // Provide an error message
        });
}



function addToOrder(orderID, data,) {

    let productID = localStorage.getItem('currentpId');


    console.log("addtoorder", productID );

    const id = parseInt(productID, 10);

    const formattedProducts = data.map(entry => {
        
        const [id, quantity, totalPricePerProduct] = entry.split(',');
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

    fetch(`http://192.168.27.140:3000/orders/addToOrder/${orderID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(orderData => {
            console.log("Order created successfully:", orderData);
            sessionStorage.setItem("OrderID", orderData.id);
            // Update stocks for each product
        })
        .catch(error => console.error("Error creating order:", error));
}

function getCustomerID(id){
    fetch(`http://192.168.27.140:3000/orders/getCustomerID/${id}`, { // URL for Cancel order
      method: 'GET', 
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
          return null;
      } else {
        /*
        date output:
        [
          {
              "Customer ID": 12345
          }
        ]
        */
        if (data.length > 0) {
          custID = data[0]['Customer ID'];
          alert("SUCCESS"+ custID)
          console.log("Customer ID:", custID);
          return data[0]['Customer ID'];
        } else {
          console.log("No customer found.");
        }
  
       
      }
    })
    .catch(error => {
        console.error("Error cancelling order:", error);
    });
  
  }
  
  function getCart(customerId){
    let cid = parseInt(customerId);
    fetch(`http://192.168.27.140:3000/orders/checkPendingOrder/${cid}`, { // URL for Cancel order
      method: 'GET', 
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
             
            const boothIdData = data[0]['Booth ID'];
            
            boothId =boothIdData;
  
            const orderId = data[0]['Order ID'];
            localStorage.setItem("OrderId",orderId);

            localStorage.setItem('BoothId',data[0]['Booth ID']);
      }
    })
    .catch(error => {
        console.error("Error cancelling order:", error);
    });
  }
  
  function updateTotal(quantity, price) {
    const totalElement = document.getElementById('cart-total');
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
    });}
        getData();
  });