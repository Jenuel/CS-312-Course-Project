// Retrieve the parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const cartJSON = decodeURIComponent(urlParams.get('cart'));
const grandTotal = parseFloat(decodeURIComponent(urlParams.get('total')));


// Parse the cart JSON string back into an array of objects
const cart = JSON.parse(cartJSON);

let box = document.querySelector(".purchase-list"); // where the child will be appended

function displayBooths(data) {

    const id = localStorage.getItem('id');
    console.log("id on cart", id);
    const purchaseList = document.getElementById('purchase-list');

    if (!purchaseList) {
        console.error("Purchase list container not found.");
        return;
    }

    purchaseList.innerHTML = ""; // Clear existing rows

    data.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td><img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.productName || 'Product Image'}" class="img-fluid"></td>
            <td>${item.productName || 'Unknown Product'}</td>
            <td>${item.status || 'Unknown Status'}</td>
            <td>${item.date || 'Unknown Date'}</td>
            <td>${item.total ? `₱${parseFloat(item.total).toFixed(2)}` : '₱0.00'}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="cancelOrder(${item.id})">Cancel</button>
            </td>
        `;

        purchaseList.appendChild(row);
    });
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

      



displayBooths();

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