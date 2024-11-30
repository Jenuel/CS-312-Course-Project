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

// Initialize tables
updateTables();