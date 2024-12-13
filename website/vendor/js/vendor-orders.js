// DOM Elements
const pendingOrdersTable = document.querySelector("#pendingOrders tbody");
const completedOrdersTable = document.querySelector("#completedOrders tbody");
const completedOrders = [];

// Helper: Get current date with microseconds
function getCurrentDateWithMicroseconds() {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
    const microseconds = (date.getMilliseconds() * 1000).toString().padStart(6, "0");
    return `${formattedDate}.${microseconds}`;
}

// Helper: Get booth ID from session
function getBoothIdFromSession() {
    return document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("PHPSESSID="))
        ?.split("=")[1];
}

// Populate Pending Orders
function populateReservedOrders(boothID) {
    fetch(`http://192.168.27.140:3000/orders/reserved/${boothID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then((orders) => {
            pendingOrdersTable.innerHTML = ""; // Clear existing rows
            if (orders.length === 0) {
                pendingOrdersTable.innerHTML = "<tr><td colspan='6'>No pending orders found.</td></tr>";
                return;
            }
            orders.forEach((order) => {
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

// Populate Completed Orders
function populateCompletedOrders() {
    completedOrdersTable.innerHTML = ""; // Clear existing rows
    if (completedOrders.length === 0) {
        completedOrdersTable.innerHTML = "<tr><td colspan='6'>No completed orders yet.</td></tr>";
        return;
    }
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

// Mark an Order as Completed
function markAsCompleted(orderId) {
    if (!confirm("Mark this order as completed?")) return;

    fetch(`http://192.168.27.140:3000/orders/update/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            status: "completed",
            dateCompleted: getCurrentDateWithMicroseconds(),
        }),
    })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then((order) => {
            completedOrders.push(order);
            updateTables();
        })
        .catch((error) => console.error("Error marking order as completed:", error));
}

// Remove a Completed Order
function removeCompletedOrder(orderId) {
    const index = completedOrders.findIndex((order) => order.orderId === orderId);
    if (index !== -1) {
        completedOrders.splice(index, 1);
        populateCompletedOrders();
    }
}

// Update Tables
function updateTables() {
    const boothID = getBoothIdFromSession();
    if (!boothID) {
        console.error("Booth ID is missing or invalid.");
        return;
    }
    populatePendingOrders(boothID);
    populateCompletedOrders();
}

// Event Handlers for Navigation
function showOrders() {
    document.getElementById("product-section").style.display = "none";
    document.getElementById("orders-section").style.display = "block";
    updateTables();
}

function showProducts() {
    document.getElementById("product-section").style.display = "block";
    document.getElementById("orders-section").style.display = "none";
}

// Initialize on Page Load
document.addEventListener("DOMContentLoaded", () => {
    const boothID = getBoothIdFromSession();
    if (boothID) {
        populatePendingOrders(boothID);
    } else {
        console.error("No valid booth ID found. Please check session or cookies.");
    }
});