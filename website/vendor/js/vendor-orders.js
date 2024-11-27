    // sample test data only, to do fetch from db
    const orders = [
        {
            orderId: "O001",
            customerName: "Jeremi Daks",
            productName: "Product A",
            quantity: 2,
            total: 200,
            status: "claimed"
        },
        {
            orderId: "O002",
            customerName: "Jeremi Daks",
            productName: "Product B",
            quantity: 1,
            total: 150,
            status: "claimed"
        },
        {
            orderId: "O003",
            customerName: "Neil Clarance Magsakay",
            productName: "Product C",
            quantity: 3,
            total: 450,
            status: "unclaimed"
        },
        {
            orderId: "O004",
            customerName: "Liam Crushiecakes",
            productName: "Product D",
            quantity: 1,
            total: 300,
            status: "claimed"
        },
        {
            orderId: "O005",
            customerName: "Melmar Frederick Bautista",
            productName: "Product E",
            quantity: 4,
            total: 400,
            status: "claimed"
        }
    ];

    // func to populate the orders table
    function populateOrders() {
        const tableBody = document.getElementById("orderTableBody");
        tableBody.innerHTML = ""; // Clear existing rows

        orders.forEach(order => {
            const row = document.createElement("tr");

            // Order ID
            const orderIdCell = document.createElement("td");
            orderIdCell.textContent = order.orderId;
            row.appendChild(orderIdCell);

            // Customer Name
            const customerNameCell = document.createElement("td");
            customerNameCell.textContent = order.customerName;
            row.appendChild(customerNameCell);

            // Product Name
            const productCell = document.createElement("td");
            productCell.textContent = order.productName;
            row.appendChild(productCell);

            // Quantity
            const quantityCell = document.createElement("td");
            quantityCell.textContent = order.quantity;
            row.appendChild(quantityCell);

            // Total
            const totalCell = document.createElement("td");
            totalCell.textContent = `₱${order.total}`;
            row.appendChild(totalCell);

            // Status
            const statusCell = document.createElement("td");
            const statusSpan = document.createElement("span");
            statusSpan.textContent = order.status;
            statusSpan.classList.add("status", order.status);
            statusCell.appendChild(statusSpan);
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        });
    }

    // populate orders on load
    populateOrders();