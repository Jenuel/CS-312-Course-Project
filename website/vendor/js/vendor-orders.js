const pendingOrdersTable = document.querySelector("#pendingOrders tbody");
const completedOrdersTable = document.querySelector("#completedOrders tbody");
const completedOrders = [];

function getSessionId() {
    return document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("PHPSESSID="))
        ?.split("=")[1];
}

// Fetch and populate pending orders
function populatePendingOrders(boothID) {
    fetch(`http://localhost:3000/orders/pending/${boothID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            pendingOrdersTable.innerHTML = "";
            data.forEach((order) => {
                const row = `
                    <tr>
                        <td>${order.orderId}</td>
                        <td>${order.customerName}</td>
                        <td>${order.productName}</td>
                        <td>${order.quantity}</td>
                        <td>₱${order.total}</td>
                        <td><button class="btn btn-sm btn-success" onclick="markAsCompleted('${order.orderId}')">Complete</button></td>
                    </tr>`;
                pendingOrdersTable.insertAdjacentHTML("beforeend", row);
            });
        })
        .catch((error) => console.error("Error fetching pending orders:", error));
}

// Populate completed orders
function populateCompletedOrders() {
    completedOrdersTable.innerHTML = "";
    completedOrders.forEach((order) => {
        const row = `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.customerName}</td>
                <td>${order.productName}</td>
                <td>${order.quantity}</td>
                <td>₱${order.total}</td>
                <td><button class="btn btn-sm btn-danger" onclick="removeCompletedOrder('${order.orderId}')">Remove</button></td>
            </tr>`;
        completedOrdersTable.insertAdjacentHTML("beforeend", row);
    });
}

// Mark an order as completed
function markAsCompleted(orderId) {
    if (!confirm("Mark this order as completed?")) return;

    fetch(`http://localhost:3000/orders/update/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            status: "completed",
            dateCompleted: getCurrentDateWithMicroseconds(),
        }),
    })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then((order) => {
            completedOrders.push(order);
            updateTables();
        })
        .catch((error) => console.error("Error updating order status:", error));
}

// Remove a completed order
function removeCompletedOrder(orderId) {
    const index = completedOrders.findIndex((order) => order.orderId === orderId);
    if (index !== -1) {
        completedOrders.splice(index, 1);
        populateCompletedOrders();
    }
}

// Update tables
function updateTables() {
    const boothID = getSessionId();
    populatePendingOrders(boothID);
    populateCompletedOrders();
}

// Helper: Get current date with microseconds
function getCurrentDateWithMicroseconds() {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
    const microseconds = (date.getMilliseconds() * 1000).toString().padStart(6, "0");
    return `${formattedDate}.${microseconds}`;
}

// Navigation: Load pages
function loadPage(page) {
    const pageFrame = document.getElementById("page-frame");
    const boothContent = document.getElementById("booth-content");

    // Hide both booth content and iframe by default before updating
    boothContent.style.display = "none";
    pageFrame.style.display = "none"; // Hide iframe initially

    switch (page) {
        case "home":
            // Show the booth content and hide iframe for the "home" page
            boothContent.style.display = "none";  // hide booth content
            pageFrame.style.display = "block";      // show iframe
            pageFrame.src = "../html/vendor-home.html"; // Load vendor-sales.html in iframe
            break;

        case "orders":
            // Hide booth content and show iframe for the "orders" page
            boothContent.style.display = "block";   // show booth content
            pageFrame.style.display = "none";     // hide iframe
            break;

        case "sales":
            // Hide booth content and show iframe for the "sales" page
            boothContent.style.display = "none";   // Hide booth content
            pageFrame.style.display = "block";     // Show iframe
            pageFrame.src = "../html/vendor-sales.html"; // Load vendor-sales.html in iframe
            break;
    }
}


// Initialize
updateTables();