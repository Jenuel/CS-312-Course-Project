// Sample test data only; to be replaced with actual data fetched from a database
const orders = [
    { orderId: "O001", customerName: "Jeremi Daks", productName: "Product A", quantity: 2, total: 200 },
    { orderId: "O002", customerName: "Jeremi Daks", productName: "Product B", quantity: 1, total: 150 },
    { orderId: "O003", customerName: "Neil Clarance Magsakay", productName: "Product C", quantity: 3, total: 450 },
    { orderId: "O004", customerName: "Liam Crushiecakes", productName: "Product D", quantity: 1, total: 300 },
    { orderId: "O005", customerName: "Melmar Frederick Bautista", productName: "Product E", quantity: 4, total: 400 }
];

const notPreparedOrdersTable = document.getElementById("notPreparedOrders");
const unclaimedOrdersTable = document.getElementById("unclaimedOrders");
const claimedOrdersTable = document.getElementById("claimedOrders");

const unclaimedOrders = [];
const claimedOrders = [];

// Populate orders not prepared
function populateNotPreparedOrders() {
    notPreparedOrdersTable.innerHTML = "";
    orders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.customerName}</td>
            <td>${order.productName}</td>
            <td>${order.quantity}</td>
            <td>₱${order.total}</td>
            <td><button onclick="markAsPrepared('${order.orderId}')">Mark as Prepared</button></td>
        `;
        notPreparedOrdersTable.appendChild(row);
    });
}

// Populate unclaimed orders
function populateUnclaimedOrders(unclaimedOrders) {
    unclaimedOrdersTable.innerHTML = "";
    unclaimedOrders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.customerName}</td>
            <td>${order.productName}</td>
            <td>${order.quantity}</td>
            <td>₱${order.total}</td>
            <td><button onclick="claimOrder('${order.orderId}')">Claim</button></td>
        `;
        unclaimedOrdersTable.appendChild(row);
    });
}

// Populate claimed orders
function populateClaimedOrders(claimedOrders) {
    claimedOrdersTable.innerHTML = "";
    claimedOrders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.customerName}</td>
            <td>${order.productName}</td>
            <td>${order.quantity}</td>
            <td>₱${order.total}</td>
            <td><button onclick="removeClaimedOrder('${order.orderId}')">Remove</button></td>
        `;
        claimedOrdersTable.appendChild(row);
    });
}

// Move order to unclaimed orders
function markAsPrepared(orderId) {
    const confirmPrepare = confirm("Are you sure this order was prepared?");
    if (!confirmPrepare) return;

    const orderIndex = orders.findIndex(order => order.orderId === orderId);
    if (orderIndex !== -1) {
        const unclaimedOrder = orders.splice(orderIndex, 1)[0];
        unclaimedOrders.push(unclaimedOrder);
        updateTables();
    }
}

// Move order to claimed orders
function claimOrder(orderId) {
    const confirmation = confirm("Are you sure this order was claimed?");
    if (!confirmation) return;

    const orderIndex = unclaimedOrders.findIndex(order => order.orderId === orderId);
    if (orderIndex !== -1) {
        const claimedOrder = unclaimedOrders.splice(orderIndex, 1)[0];
        claimedOrders.push(claimedOrder);
        updateTables();
    }
}

// Remove claimed order
function removeClaimedOrder(orderId) {
    const orderIndex = claimedOrders.findIndex(order => order.orderId === orderId);
    if (orderIndex !== -1) {
        claimedOrders.splice(orderIndex, 1);
        updateTables();
    }
}

// Update all tables
function updateTables() {
    populateNotPreparedOrders();
    populateUnclaimedOrders(unclaimedOrders);
    populateClaimedOrders(claimedOrders);
}
/*******************************************************************/
/**
 * FUNCTIONS IMAGE --> BASE64 --> BLOB
 * 
 * sample usage:

const fileInput = document.getElementById('imageInput'); // <input type="file" id="imageInput">
fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        try {
            const base64 = await imageToBase64(file); // Convert to Base64
            console.log('Base64:', base64);

            const blob = base64ToBlob(base64, file.type); // Convert Base64 to Blob
            console.log('Blob:', blob);
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
 */

// Function to convert an image file to Base64
const imageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Get Base64 string without "data:image/...;base64,"
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file); // Read file as Data URL
    });
};

// Function to convert Base64 to a Blob
const base64ToBlob = (base64, mimeType = 'image/png') => {
    const binary = atob(base64); // Decode Base64
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mimeType });
};
/**
 * FUNCTIONS BLOB --> BASE64 --> IMAGE  
 * 
 * sample application:
 * 
 * 
 */

// Function to convert a Blob to Base64
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Base64 string without prefix
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob); // Read Blob as Data URL
    });
};

// Function to create an image element from Base64
const base64ToImage = (base64, mimeType = 'image/png') => {
    const img = new Image();
    img.src = `data:${mimeType};base64,${base64}`;
    return img; // Return the image element
};

/*THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER */

function getCompletedOrder(boothID){
  
    fetch(`http://localhost:3000/complete/:${boothID}`,{// change this one
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
         console.log("Products fetched successfully:", data);
         // add handling of data
     })
     .catch(error => {
         console.error("Error fetching products:", error);
     });
 }

 function getPendingOrder(){
  
    fetch(`http://localhost:3000/pending`,{// change this one
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
         console.log("Products fetched successfully:", data);
         // add handling of data
     })
     .catch(error => {
         console.error("Error fetching products:", error);
     });
 }

 function approveOrder(orderId, dateInput){
    const data = {
        datePaid:dateInput 
    }
    data
    fetch(`http://localhost:3000/approve/:${orderId}`,{// change this one
     method: 'GET', 
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
     .then(data => {
         console.log("Products fetched successfully:", data);
         // add handling of data
     })
     .catch(error => {
         console.error("Error fetching products:", error);
     });
 }

// Initialize tables
updateTables();