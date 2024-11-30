 // sample test data only, to do fetch from db
 const orders = [
    {
        orderId: "O001",
        customerName: "Jeremi Daks",
        productName: "Product A",
        quantity: 2,
        total: 200,
    },
    {
        orderId: "O002",
        customerName: "Jeremi Daks",
        productName: "Product B",
        quantity: 1,
        total: 150,
    },
    {
        orderId: "O003",
        customerName: "Neil Clarance Magsakay",
        productName: "Product C",
        quantity: 3,
        total: 450,
    },
    {
        orderId: "O004",
        customerName: "Liam Crushiecakes",
        productName: "Product D",
        quantity: 1,
        total: 300,
    },
    {
        orderId: "O005",
        customerName: "Melmar Frederick Bautista",
        productName: "Product E",
        quantity: 4,
        total: 400,
    }
];

const unclaimedOrdersTable = document.getElementById("unclaimedOrders");
const claimedOrdersTable = document.getElementById("claimedOrders");

// populate unclaimed orders
function populateUnclaimedOrders() {
    unclaimedOrdersTable.innerHTML = "";
    orders.forEach(order => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.customerName}</td>
            <td>${order.productName}</td>
            <td>${order.quantity}</td>
            <td>₱${order.total}</td>
            <td><button onclick="claimOrder('${order.orderId}')">Claimed</button></td>
            `;

        unclaimedOrdersTable.appendChild(row);
    });
}

// populate claimed orders
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

// move unclaimed to claimed orders
function claimOrder(orderId) {
    const confirmation = confirm("Are you sure this order was claimed?");
    if (!confirmation) return;

    const orderIndex = orders.findIndex(order => order.orderId === orderId);
    if (orderIndex !== -1) {
        const claimedOrder = orders.splice(orderIndex, 1)[0];
        claimedOrders.push(claimedOrder);
        updateTables();
    }
}

// remove claimed order
const claimedOrders = [];
function removeClaimedOrder(orderId) {
    const orderIndex = claimedOrders.findIndex(order => order.orderId === orderId);
    if (orderIndex !== -1) {
        claimedOrders.splice(orderIndex, 1);
        updateTables();
    }
}

// update both tables
function updateTables() {
    populateUnclaimedOrders();
    populateClaimedOrders(claimedOrders);
}

// initialize tables
updateTables();