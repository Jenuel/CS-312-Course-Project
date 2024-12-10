let cart = [];
let totalValue = 0;

function displayBooths() {
    const box = document.querySelector(".specific-product-container");
    box.innerHTML = "";
    const valueDiv = document.createElement('div');
    valueDiv.classList.add('box');
    valueDiv.innerHTML = `
    <div class="image">
    </div>
    <div class="right-side">
        <div class="button-container">
            <button type="button" class="row-button back-button">
                <img src="back.png" alt="Back">
            </button>
            <button type="button" class="row-button cart-button" onclick="toggleCart()">
                <img src="..\res\cart_icon.png" alt="Cart">
            </button>
        </div>
        <div class="title">
            <p>Product Name</p>
        </div>
        <div class="description">
            <p>Amazing product description here.</p>
        </div> 
        <div class="buttons">
            <button type="button" onclick="preorderItem('Product Name', 100, 'image/path.jpg')" id="preorder-button">
                PRE-ORDER
            </button>
            <div class="quantity-container">
                <button onclick="minusQuantity()" id="minus-button">-</button>
                <span class="quantity-text">1</span>
                <button onclick="addQuantity()" id="add-button">+</button>
            </div>
        </div>
    </div>`;
    box.appendChild(valueDiv);
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

/*
function to convert blob --> base64 --> image
*/

// Function to convert a Blob to Base64
function blobToBase64(blob, callback, errorCallback) {
    const reader = new FileReader();
    reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Get Base64 without the prefix
        callback(base64);
    };
    reader.onerror = (error) => {
        errorCallback(error);
    };
    reader.readAsDataURL(blob); // Read Blob as Data URL
}

// Function to create an image element from Base64
function base64ToImage(base64, mimeType = 'image/png') {
    const img = new Image();
    img.src = `data:${mimeType};base64,${base64}`;
    return img; // Return the image element
}

/*THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER */

/*
use get details of a specific Product method in productController.js
*/
function getSpecificProduct(productId){
  
   fetch(`http://localhost:3000/details/:${productId}`,{// change this one
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
     /*SAMPLE data  OUTPUT
    
    {
        "name": "Handmade Bracelet",
        "Stocks": 50,
        "Price": 29.99,
        "status": "active",
        "Image": "BLOB"
    }

    */
        console.log("Products fetched successfully:", data);
        // Handle the "Image" field
        if (data.Image) {
            blobToBase64(
                data.Image, // Assuming Image is a Blob
                (base64) => {
                    console.log("Base64 String:", base64);

                    // Convert Base64 to an image element
                    const imgElement = base64ToImage(base64, 'image/png');
                    document.body.appendChild(imgElement); // Append the image to the body
                },
                (error) => {
                    console.error("Error converting Blob to Base64:", error);
                }
            );
        }
        // add handling of data
    })
    .catch(error => {
        console.error("Error fetching products:", error);
    });
}

displayBooths();