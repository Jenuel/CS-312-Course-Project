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
    const productName = product.Name || "Unknown Product";
    const productPrice = parseFloat(product.Price) || 0.0; // Convert Price to a number or fallback to 0.0
    const productImage = product.Image 
        ? `data:image/png;base64,${product.Image}` 
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
                            ${product.ProductID},
                            ${productPrice}
                        )">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>`;
}





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

    console.log(`Added ${quantity} of Product ID ${ProductID} to the cart. Grand Total: ₱${grandTotal.toFixed(2)}`);
}

function checkout() { 
    alert("checking out products");
    const cartJSON = JSON.stringify(cart);
    window.location.href = "client-purchases.html?cart=" + encodeURIComponent(cartJSON) + "&total=" + encodeURIComponent(grandTotal);
}


/* ----------------------------------------------------------------------------------------------------- */
// THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER

/**
 * Fetch for retreiving a specific product (GET)
 * @param {Integer} productId 
 */
function getSpecificProduct(productId){
  
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
        console.log("Status: ", data.Status);
        console.log("Fetched product data:", data);
        if (data && data.Status === "active") {
            displaySpecficProduct(data);
        } else {
            console.error("Product status is not active or undefined.");
            alert("The requested product is not available.");
        }
    })
    .catch(error => {
        console.error("Error fetching product:", error);
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

