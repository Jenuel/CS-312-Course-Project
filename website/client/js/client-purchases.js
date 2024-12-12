

// Retrieve the parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const boothId = decodeURIComponent(urlParams.get('boothId'));

let box = document.querySelector(".purchase-list"); // where the child will be appended

function displayCart(cartItems) {
    const cartList = document.getElementById('purchase-list');

    if (!cartList) {
        console.error("Cart list container not found.");
        return;
    }

    // Clear existing rows
    cartList.innerHTML = "";

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        // Show a placeholder row if the cart is empty
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="7" class="text-center">Your cart is empty.</td>
        `;
        cartList.appendChild(emptyRow);
        return;
    }

    cartItems.forEach((item, index) => {
        const row = document.createElement('tr');

        // Add content dynamically based on item properties
        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>
                <img 
                    src="${item.image || 'https://via.placeholder.com/50'}" 
                    alt="${item.productName || 'Product Image'}" 
                    class="img-fluid" 
                    style="max-height: 50px; max-width: 50px;">
            </td>
            <td>${item.productName || 'Unknown Product'}</td>
            <td>
                <input 
                    type="number" 
                    class="form-control form-control-sm" 
                    value="${item.quantity || 1}" 
                    min="1" 
                    onchange="updateCartItem(${item.id}, this.value)">
            </td>
            <td>${item.price ? `₱${parseFloat(item.price).toFixed(2)}` : '₱0.00'}</td>
            <td>${item.total ? `₱${parseFloat(item.total).toFixed(2)}` : '₱0.00'}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeCartItem(${item.id})">Remove</button>
            </td>
        `;

        cartList.appendChild(row);
    });

    // Update the cart total after rendering
    updateCartTotal(cartItems);
}

// Function to update the total amount dynamically
function updateCartTotal(cartItems) {
    const cartTotalElement = document.getElementById('cart-total');
    if (!cartTotalElement) {
        console.error("Cart total element not found.");
        return;
    }

    const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity || 0);
    }, 0);

    cartTotalElement.textContent = totalAmount.toFixed(2);
}



/* ----------------------------------------------------------------------------------------------------- */
// THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER


/**
 * Fetch for order cancelation (PATCH)
 * @param {Integer} orderId 
 */
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

function removeProductFromDB(orderID){
    etch(`http://localhost:3000/products/buy/${orderID}`, { // URL for updaeting product in db
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



//END FOR FETCH FUNCTIONS
/* ----------------------------------------------------------------------------------------------------- */


 /*
Helper method to retrive date in YYYY-MM-DD HH:MM:SS'
*/
const getCurrentDateWithMicroseconds = () => {
    const date = new Date();
    
    // Get the date in the format 'YYYY-MM-DD HH:MM:SS'
    let formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
    
    // Get microseconds (using a simple approximation as JavaScript doesn't have built-in microsecond precision)
    const microseconds = (date.getMilliseconds() * 1000).toString().padStart(6, '0');
    
    // Add microseconds to the date
    return `${formattedDate}.${microseconds}`;
};

      


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

function checkout() { 
    alert("checking out products");
    const cartJSON = JSON.stringify(cart);
    window.location.href = "client-purchases.html?cart=" + encodeURIComponent(cartJSON) + "&total=" + encodeURIComponent(grandTotal);
}


function createOrder(boothID, data, totalPrice) {
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
        totalPrice: parseFloat(totalPrice).toFixed(2),
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    fetch(`http://localhost:3000/orders/create/${boothID}`, {
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


function fetchCartData() {
    fetch("http://localhost:3000/cart")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(cartData => {
        console.log("Fetched cart data:", cartData);

        // Pass the cart data to displayCart function to render the updated cart
        displayCart(cartData);
    })
    .catch(error => {
        console.error("Error fetching cart data:", error);
    });
}

fetchCartData(boothId);