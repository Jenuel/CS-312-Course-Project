

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

        // Use base64 image if available; otherwise, fallback to a placeholder
        const imageSrc = item.image 
            ? `data:image/png;base64,${item.image}` 
            : 'https://via.placeholder.com/50';

        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>
                <img 
                    src="${imageSrc}" 
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
                    onchange="updateCartItem(${item.productID}, this.value)">
            </td>
            <td>${item.price ? `₱${parseFloat(item.price).toFixed(2)}` : '₱0.00'}</td>
            <td>${item.total ? `₱${parseFloat(item.total).toFixed(2)}` : '₱0.00'}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeCartItem(${item.productID})">Remove</button>
            </td>
        `;

        cartList.appendChild(row);
    });

    // Update the cart total after rendering
    updateCartTotal(cartItems);
}


function updateCartTotal(cartItems) {
    const cartTotalElement = document.getElementById('cart-total');
    if (!cartTotalElement) {
        console.error("Cart total element not found.");
        return;
    }

    const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity || 0);
    }, 0);

    cartTotalElement.textContent = `₱${totalAmount.toFixed(2)}`;
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

function cancelOrders(){
    cancelOrder(orderID); 
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

function checkoutProducts(){

    let orderID = localStorage.getItem('orderId');
    fetch(`http://localhost:3000/products/buy/${orderID}`, { // URL for updaeting product in db
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

        const cartList = document.getElementById('purchase-list');

        if (!cartList) {
            console.error("Cart list container not found.");
            return;
        }
    
        // Clear existing rows
        cartList.innerHTML = "";
        
        // data is a json massgae no parsing needed
        console.log("Order bought succefully:", data);

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



function getCart(customerId) {
    let cid = parseInt(customerId);
    fetch(`http://localhost:3000/orders/checkPendingOrder/${cid}`, {
        method: 'GET', // Fetching pending orders
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }

            localStorage.setItem('orderId', data.orderId);
            
            // Map the API response to the format expected by `displayCart`
            const cartItems = data.map(product => ({
                productID: product['Product ID'],
                productName: product['Product Name'] || 'Unknown Product',
                image: product['Product Image'], // If image is base64 or URL
                quantity: product['Quantity'],
                price: parseFloat(product['Product price']),
                total: parseFloat(product['Total price per product']),
            }));

            // Update the cart display
            displayCart(cartItems);

            updateCartTotal(data.grandTotal);
            
        })
        .catch(error => {
            console.error("Error fetching cart items:", error);
        });
}

function updateCartTotal(total) {
    const totalElement = document.getElementById('cart-total');
    totalElement.textContent = parseFloat(total);
}

getCart(localStorage.getItem('id'));