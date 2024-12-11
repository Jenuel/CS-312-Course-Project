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

function getSessionId() {
    return document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("PHPSESSID="))
      ?.split("=")[1];
  }

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
/* ----------------------------------------------------------------------------------------------------- */
// THE FOLLOWING FUNCTIONS BELOW ARE USED TO FETCH DATA FROM THE SERVER 

/**
 * Fetch for retrieving all complete orders
 * @param {Integer} boothID 
 */
function getCompletedOrder(boothID){
  
    fetch(`http://localhost:3000/orders/complete/${boothID}`,{
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

 /**
 * Fetch for retrieving all pending orders
 * @param {Integer} boothID 
 */
 function getPendingOrder(boothID){
  
    fetch(`http://localhost:3000/orders/pending/${boothID}`,{
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

 /**
 * Fetch for approving  all  orders (PATCH)
 * @param {Integer} orderId
 */
 function approveOrder(orderId){
    const data = {
        datePaid:getCurrentDateWithMicroseconds(),
    }
    data
    fetch(`http://localhost:3000/approve/${orderId}`,{
     method: 'PATCH', 
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
     })
     .catch(error => {
         console.error("Error fetching products:", error);
     });
 }


 // END FOR FETCH FUNCIONS
 /* ----------------------------------------------------------------------------------------------------- */

 /*
 helpoer functio top get date in 'YYYY-MM-DD HH:MM:SS'
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


// Initialize tables
updateTables();