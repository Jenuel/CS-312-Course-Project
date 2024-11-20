let cart = [];
let totalValue = 0;

function displayBooths() {
    const box = document.querySelector(".specific-product-container");
    box.innerHTML = "";
    const valueDiv = document.createElement('div');
    valueDiv.classList.add('box');

    valueDiv.innerHTML = `
        <div class="image"></div>
        <div class="title">
            <p>Product Name</p>
        </div>
        <div class="description">
            <h1>DESCRIPTION:</h1>
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
        </div>`;
    
    box.appendChild(valueDiv);
}

function preorderItem(name, price, image) {
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


displayBooths();