let cart = [];
let grandTotal = sessionStorage.getItem("Grandtotal")
    ? parseFloat(sessionStorage.getItem("Grandtotal"))
    : 0.0;

const urlParams = new URLSearchParams(window.location.search);
const boothId = urlParams.get('boothID');

document.addEventListener("DOMContentLoaded", () => {
    const backToProductsButton = document.getElementById('backToProducts');
    backToProductsButton.addEventListener('click', (event) => {
    event.preventDefault(); 
    window.location.href = `client-products.html?id=${boothId}`; // Redirect 
}); 
    const productId = urlParams.get('productID');
    if (productId) {
        getSpecificProduct(productId);
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
                <div class="d-flex align-items-center">
                    <label for="quantityInput" class="me-2">Quantity:</label>
                    <input type="number" id="quantityInput" min="1" value="1" class="form-control" style="width: 5rem;">
                    <button class="btn btn-primary ms-3" type="button" 
                        onclick="addToCart(
                            this.parentElement.querySelector('#quantityInput').value,
                            ${ProductID},
                            ${parseFloat(productPrice)}
                        )">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>`;
}

function addToCart(quantity, ProductID, Price) {
    const totalPrice = parseFloat(quantity) * parseFloat(Price);
    cart.push(`${ProductID},${quantity},${totalPrice.toFixed(2)}`);

    grandTotal += totalPrice;
    sessionStorage.setItem("Grandtotal", grandTotal.toFixed(2));

    if (sessionStorage.getItem("OrderID")) { // there is an existing order
        const orderId = parseInt(sessionStorage.getItem("OrderID"), 10);
        addToOrder(orderId, cart);
    } else { // wala pang order
        const cid = localStorage.getItem('id');
        createOrder(boothId, cart, grandTotal,cid);// please assign calue for customerID
    }

}

function checkout() {
    alert("Checking out products");
    const cartJSON = JSON.stringify(cart);
    window.location.href = `client-purchases.html?orderID=${sessionStorage.getItem("OrderID")}`;// NEED TO FIND LIKE A SET OF VALUE GANUN
}

/* Fetch Functions */

function getSpecificProduct(productId) {
    fetch(`http://localhost:3000/products/details/${productId}`, {
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
    fetch(`http://localhost:3000/orders/create/${boothID}`, {
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
    const formattedProducts = data.map(entry => {
        const [productID, quantity, totalPricePerProduct] = entry.split(',');
        return {
            productID: parseInt(productID, 10),
            quantity: parseInt(quantity, 10),
            totalPricePerProduct: parseFloat(totalPricePerProduct).toFixed(2),
        };
    });

    const payload = {
        products: formattedProducts,
    };

    fetch(`http://localhost:3000/orders/addToOrder/${orderID}`, {
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