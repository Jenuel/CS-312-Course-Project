let box = document.querySelector(".purchase-list"); // where the child will be appended

function displayBooths(){
    box.innerHTML = "";
        let valueDiv = document.createElement('div'); 
        valueDiv.classList.add('item');
        // creating the information of the product
        valueDiv.innerHTML = `
        <div class="box">
            <div class="image">
                               
            </div>
            <div class="product">
                <p id="status-title">STATUS</p>
                <p id="status">: insert status here</p>
            </div>
            <div class="product">
                <p id="date-title">DATE</p>
                <p id="date">: insert date here</p>
            </div>
                <div class="product">
                <p id="productid-title">PRODUCT ID</p>
                <p id="productid">: insert product id here</p>
            </div>
                <div class="product">
                <p id="total-title">TOTAL</p>
                <p id="total">: insert total here</p>
            </div>         
        </div>`;
        box.appendChild(valueDiv); // appending the child to "box"
}

/* ----------------------------------------------------------------------------------------------------- */
// THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER

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