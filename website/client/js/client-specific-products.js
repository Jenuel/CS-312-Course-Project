let cart = [];
let totalValue = 0;
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id'); 

function displaySpecificProductUI(product) {
    const container = document.querySelector(".container.px-4.px-lg-5.my-5"); // Fix class selector
    container.innerHTML = "";
  
    const valueDiv = document.createElement('div');
    valueDiv.classList.add('row', 'gx-4', 'gx-lg-5', 'align-items-center'); // Use class names as arguments
  
    valueDiv.innerHTML = `
      <div class="col-md-6">
        <img id="product-image" class="card-img-top mb-5 mb-md-0"
             src="${product.Image ? `data:image/png;base64,${product.Image}` : 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg'}"
             alt="${product.Name || 'Product Name'}"/>
      </div>
      <div class="col-md-6">
        <h1 id="product-name" class="display-5 fw-bolder">${product.Name || 'Product Name'}</h1>
        <div class="fs-5 mb-2">
          <span id="product-price">₱${product.Price || 0.00}</span>
        </div>
        <p id="product-description" class="lead">Product Description</p>
        <div class="d-flex align-items-center">
          <label for="quantityInput" class="me-2">Quantity:</label>
          <input type="number" id="quantityInput" min="1" value="1" class="form-control" style="width: 5rem;">
          <button class="btn btn-primary ms-3" type="button" onclick="addToCart(this.parentElement.querySelector('#quantityInput').value, ${product.ProductID}, ${product.Price})">Add to Cart</button>
        </div>
      </div>`;
  
    container.appendChild(valueDiv);
  }

function openProfile() {
    const profile = document.getElementById("profile");
    profile.classList.add("open-profile");
}

// Close profile form popup
function closeProfile() {
    const profile = document.getElementById("profile");
    profile.classList.remove("open-profile");
}

/*
// Optionally, handle form submission
document.getElementById("profile-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent page reload on form submit
    const name = document.getElementById("profile-name").value;
    const email = document.getElementById("profile-email").value;
    const password = document.getElementById("profile-password").value;

    // Send the updated data to the server or process accordingly
    console.log("Updated Profile:", name, email, password);
    // You can implement an API call to save the changes here

    closeProfile(); // Close the profile popup after submission
});
*/

function preorderItem(name, price, image) {
    alert("Added to cart!");
    const cartContainer = document.querySelector(".cart-container");
    cartContainer.classList.remove("hidden");

    const cartItems = document.querySelector(".cart-items");

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    updateCart();
}

function updateCart() {
    const cartItems = document.querySelector(".cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";
    totalValue = 0;

    cart.forEach(item => {
        totalValue += item.price * item.quantity;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');

        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-image">
            <div class="cart-details">
                <p>${item.name}</p>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
        cartItems.appendChild(itemDiv);
    });

    cartTotal.textContent = totalValue.toFixed(2);
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(cartItem => cartItem.name !== name);
    }
    updateCart();

    if (cart.length === 0) {
        document.querySelector(".cart-container").classList.add("hidden");
    }
}

function checkout() {
    alert("Proceeding to checkout...");
    // Implement checkout logic here
}

function toggleCart() {
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.classList.toggle('active'); // Toggle the active class
}

/* ----------------------------------------------------------------------------------------------------- */
// THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER

/**
 * Fetch for retreiving a specific product (GET)
 * @param {Integer} productId 
 */
function getSpecificProduct(productId){
  
   fetch(`http://localhost:3000/products/details/${productId}`,{
    method: 'GET', 
    headers: {
        'Content-Type': 'application/json', 
    }
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
            "Image": "base64"
        }

        */
       data.Name // name of product
       data.Stocks // remaining stocks of product
       data.Price // price of  product
       data.Status //status of product

        console.log("Products fetched successfully:", data);
        // Handle the "Image" field
   

        displaySpecificProductUI(data);
    })
    .catch(error => {
        console.error("Error fetching products:", error);
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


getSpecificProduct(productId);