import { Session } from "inspector/promises";

let cart = [];
let grandTotal;
if(sessionStorage.getItem("Grandtotal")) {
    grandTotal= parseFloat(sessionStorage.getItem("Grandtotal"));
}


const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productID');
const boothId = urlParams.get('boothID'); 
let cart = []; 
let grandTotal= 0.0;


document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        getSpecificProduct(productId);
    } else {
        console.error("Product ID is missing in the URL parameters.");
    }
});


function displaySpecficProduct(product) {
    console.log("Product received in displaySpecficProduct:", product); // Debugging log

    const container = document.querySelector(".container.px-4.px-lg-5.my-5");
    if (!container) {
        console.error("Container element not found. Check your HTML structure.");
        return;
    }

    // Parse product details
    const productName = product[0].Name || "Unknown Product";
    const productPrice = parseFloat(product[0].Price) || 0.0; // Convert Price to a number or fallback to 0.0
    const productImage = product[0].Image 
        ? `data:image/png;base64,${product[0].Image}` 
        : 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg'; // Fallback if Image is missing

    console.log("Parsed product details:", { productName, productPrice, productImage });

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
                    <span id="product-price">₱${productPrice.toFixed(2)}</span>
                </div>
                <p id="product-description" class="lead">Product Description</p>
                <div class="d-flex align-items-center">
                    <label for="quantityInput" class="me-2">Quantity:</label>
                    <input type="number" id="quantityInput" min="1" value="1" class="form-control" style="width: 5rem;">
                    <button class="btn btn-primary ms-3" type="button" 
                        onclick="addToCart(
                            this.parentElement.querySelector('#quantityInput').value,
                            ${product[0].ProductID},
                            ${productPrice}
                        )">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>`;
}





function addToCart(quantity,ProductID,Price ){
    let totalPrice = quantity * Price;
    const qty = quantity.toString;
    const productID = ProductID.toString;
    const totalPricePerProduct = totalPrice.toString;

    cart.push("",productID,",",qty,",",totalPricePerProduct);
function addToCart(quantity, ProductID, Price) {
    quantity = parseInt(quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
        alert("Invalid quantity. Please enter a positive number.");
        return;
    }

    // Ensure Price is numeric
    const numericPrice = parseFloat(Price) || 0.0;

    let totalPrice = quantity * numericPrice;
    cart.push({
        ProductID: ProductID,
        quantity: quantity,
        price: numericPrice,
        total: totalPrice
    });

    grandTotal += totalPrice;
    sessionStorage.setItem("Grandtotal", grandTotal)

    console.log(`Added ${quantity} of Product ID ${ProductID} to the cart. Grand Total: ₱${grandTotal.toFixed(2)}`);
}
 
// function checkout() { 
//     alert("checking out products");
//     const cartJSON = JSON.stringify(cart);
//     window.location.href = "client-purchases.html?cart=" + encodeURIComponent(cartJSON) + "&total=" + encodeURIComponent(grandTotal);
// }

function checkout() { 
    alert("checking out products");
    const cartJSON = JSON.stringify(cart);
    window.location.href = "client-purchases.html?cart=" + encodeURIComponent(cartJSON) + "&total=" + encodeURIComponent(grandTotal);
}

if(sessionStorage.getItem("OrderID")){// true if orderID has value
    const orderId = parseInt(sessionStorage.getItem("OrderID"));
    addToOrder(orderId, cart);
}else{// false no order id
    createOrder(boothId, cart, grandTotal); 
}

/* ----------------------------------------------------------------------------------------------------- */
// THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER

/**
 * Fetch for retreiving a specific product (GET)
 * @param {Integer} productId 
 */
function getSpecificProduct(productId) {
    fetch(`http://localhost:3000/products/details/${productId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        /*SAMPLE data  OUTPUT
        
        {
            "Name": "Handmade Bracelet",
            "Stocks": 50,
            "Price": 29.99,
            "Status": "active",
            "Image": "base64",
            "ProductID":"id"
        }

        */
       console.log("Products fetched successfully:", data);

        displaySpecficProduct(data);
        console.log("Fetched product data:", data);

        // Safely access and log specific fields
        const status = data[0].Status || 'Status not found';
        const name = data[0].Name || 'Name not found';
        console.log("Status: ", status);
        console.log("Name: ", name);

        // Check if product is active
        if (status.toLowerCase() === "active") {
            displaySpecficProduct(data); // Call your display function
        } else {
            console.error("Product status is not active or undefined.");
            alert("The requested product is not available.");
        }
    })
    .catch(error => {
        console.error("Error fetching product:", error);
    });
}

/**
 * Fetch for creating an irder (POST)
 * @param {Integer} boothID 
 * @param {Array} Data 
 * @param {Integer} totalPriceInput 
 */

function createOrder(boothID, Data, totalPriceInput) {
    /*
     format of line in data[] :
     const Data = [
         "<productID> , <quantity> , <totalPricePerProduct>",
         "<productID> , <quantity> , <totalPricePerProduct>"
     ];
     refer the format of date input to the db
     */ 
     const products = Data.map(entry => {
         const [productID, quantity, totalPricePerProduct] = entry.split(',');
         return {
             productID: parseInt(productID.trim(), 10), // Ensure integer for productID
             quantity: parseInt(quantity.trim(), 10),  // Ensure integer for quantity
             totalPricePerProduct: parseFloat(totalPricePerProduct.trim()).toFixed(2), // Ensure decimal(10,2)
         };
     });
     
     const data = {
         products,
         totalPrice: parseFloat(totalPriceInput).toFixed(2), // Ensure decimal(10,2) for totalPrice
         date:  getCurrentDateWithMicroseconds(), // Date must be in the correct format: YYYY-MM-DD HH:MM:SS
     };
 
     // POST request to create an order
     fetch(`http://localhost:3000/orders/create/${boothID}`, {// URL for creating order
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
     })
         .then(response => {
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             }
             return response.json();


         })
         .then(orderData => {
             console.log("Order created successfully:", orderData);
             sessionStorage.setItem("OrderID", orderData);// set order id to session
 
             // For each product, send a PATCH request to update stock
             products.forEach(product => {
                 const productData = {
                     numberOfProductsSold: product.quantity, // Pass the integer value for quantity
                 };
 
                 fetch(`http://localhost:3000/products/buy/${product.productID}`, {// URL for buying product
                     method: 'PATCH',
                     headers: {
                         'Content-Type': 'application/json',
                     },
                     body: JSON.stringify(productData),
                 })
                     .then(response => {
                         if (!response.ok) {
                             throw new Error(`HTTP error! status: ${response.status}`);
                         }
                         return response.json();
                     })
                     .then(productData => {
                         console.log(`Product ${product.productID} updated successfully:`, productData);
                     })
                     .catch(error => {
                         console.error(`Error updating product ${product.productID}:`, error);
                     });
             });
         })
         .catch(error => {
             console.error("Error creating order:", error);
         });
 }

 function addToOrder(orderID, Data){
      /*
     format of line in data[] :
     const Data = [
         "<productID> , <quantity> , <totalPricePerProduct>",
         "<productID> , <quantity> , <totalPricePerProduct>"
     ];
     refer the format of date input to the db
     */ 
     const products = Data.map(entry => {
        const [productID, quantity, totalPricePerProduct] = entry.split(',');
        return {
            productID: parseInt(productID.trim(), 10), // Ensure integer for productID
            quantity: parseInt(quantity.trim(), 10),  // Ensure integer for quantity
            totalPricePerProduct: parseFloat(totalPricePerProduct.trim()).toFixed(2), // Ensure decimal(10,2)
        };
    });
    
    const data = {
        products,
    };

    // POST request to create an order
    fetch(`http://localhost:3000/orders/addToOrder/${orderID}`, {// URL for creating order
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(orderData => {
            console.log("Order created successfully:", orderData);

            // For each product, send a PATCH request to update stock
            products.forEach(product => {
                const productData = {
                    numberOfProductsSold: product.quantity, // Pass the integer value for quantity
                };

                fetch(`http://localhost:3000/products/buy/${product.productID}`, {// URL for buying product
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(productData => {
                        console.log(`Product ${product.productID} updated successfully:`, productData);
                    })
                    .catch(error => {
                        console.error(`Error updating product ${product.productID}:`, error);
                    });
            });
        })
        .catch(error => {
            console.error("Error creating order:", error);
        });

 }


//END OF FETCH FUNCTIONS
/* ----------------------------------------------------------------------------------------------------- */


/*
Helper function to convert  base64 --> image
*/

// Function to create an image element from Base64
function base64ToImage(base64, mimeType = 'image/png') {
    const img = new Image();
    img.src = `data:${mimeType};base64,${base64}`;
    return img; // Return the image element
}

