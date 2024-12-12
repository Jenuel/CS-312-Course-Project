// Implementation of the logic

/*
VENDOR CONTROLLER

This function is for getting the advanced/pending orders of a certain booth 
*/
const getReservedOrders = async (request, response) => {
    const db = request.db;
    const{boothId} = request.params;
    try {
        // Validate boothID
        if (!boothId || isNaN(boothId)) {
            return response.status(400).json({ error: 'Invalid booth ID' });
        }
        
        const [rows] = await db.query(`
            SELECT 
                o.OrderID AS "OrderId", 
                o.Price AS "TotalPrice", 
                o.Status AS "Status", 
                p.Quantity AS "Quantity", 
                c.Name AS "ProductName" 
            FROM 
                \`order\` o 
            JOIN 
                \`order_products\` p ON o.OrderID = p.OrderID 
            JOIN 
                \`product\` c ON p.ProductID = c.ProductID 
            WHERE 
                o.Status = "Reserved" 
                AND o.BoothID = ? 
            ORDER BY 
                o.OrderID ASC
        `, [boothId]);

        response.json(rows);
    } catch (error) {
        console.error('Error fetching completed orders:', error);
        response.status(500).send('Failed to fetch completed orders');
    }
};

/*
VENDOR CONTROLLER

This function is for getting the completed orders of a certain booth 
*/
const getCompletedOrders = async (request, response) => {
    const db = request.db;
    const { boothId } = request.params;

    try {
        const [rows] = await db.query(`
            SELECT 
                o.OrderID AS "OrderId", 
                o.Price AS "TotalPrice", 
                o.Status AS "Status", 
                p.Quantity AS "Quantity", 
                c.Name AS "ProductName" 
            FROM 
                \`order\` o 
            JOIN 
                \`order_products\` p ON o.OrderID = p.OrderID 
            JOIN 
                \`product\` c ON p.ProductID = c.ProductID 
            WHERE 
                o.Status = "Complete" 
                AND o.BoothID = ? 
            ORDER BY 
                o.OrderID ASC
        `, [boothId]);

        response.json(rows);
    } catch (error) {
        console.error('Error fetching completed orders:', error);
        response.status(500).send('Failed to fetch completed orders');
    }
};


/*
CLIENT CONTROLLER

This function is for finalizing an order and sends it to the specific booth

HTTP PUT /<orderRoutes>/<boothId>
{
  "products":[
    ["productID":value, "quantity": value,  "totalPricePerProduct":value ], FOLLOW THE FORMAT HERE SA PAG COMPOSE NG BODY
    ["productID":100, "quantity": 100,  "totalPricePerProduct":100.00 ] MAKE SURE DECIMAL SIYA
    ],
  "totalPrice": 450
  "date": 2024-11-19 10:31:54
} 
*/ 
const createOrder = async (request, response) => {
    const db = request.db;
    const { boothID } = request.params;
    const { products, totalPrice, date, customerId } = request.body;

    console.log("Request body:", request.body);

    try {
        // Validate inputs
        if (!boothID || isNaN(boothID)) {
            return response.status(400).send('Invalid boothID');
        }

        if (!products || !Array.isArray(products) || products.length === 0) {
            return response.status(400).send('Invalid or empty products array');
        }

        if (!totalPrice || typeof totalPrice !== 'number' || totalPrice <= 0) {
            return response.status(400).send('Invalid totalPrice');
        }

        if (!customerId || isNaN(customerId)) {
            return response.status(400).send('Invalid customerId');
        }

        console.log("Received boothID:", boothID);
        console.log("Received products:", products);
        console.log("Received totalPrice:", totalPrice);
        console.log("Received date:", date);

        // Insert order into the database
        const { orderQuery } = await db.query(
            "INSERT INTO order (OrderID, BoothID, Status, DateOrdered, DatePaid, Price, customerID) VALUES (NULL, ?, 'Pending',?, NULL, ?, ?)",
            [boothId, date, totalPrice,customerId]);

        const latestOrderID = orderQuery.insertId;

        if (!latestOrderID) {
            throw new Error("Failed to create order. No insertId returned.");
        }

        console.log("New Order ID:", latestOrderID);

        // Insert each product into `order_products`
        for (const product of products) {
            const { productID, quantity, totalPricePerProduct } = product;

            if (!productID || isNaN(productID) || !quantity || isNaN(quantity) || !totalPricePerProduct || isNaN(totalPricePerProduct)) {
                throw new Error(`Invalid product data: ${JSON.stringify(product)}`);
            }

            await db.query(
                'INSERT INTO order_products (ProductID,`OrderID`, Quantity, Total) VALUES (?, ?, ?, ?)',
                [productID, latestOrderID, quantity, totalPricePerProduct]
            );

            console.log(`Product inserted: ${JSON.stringify(product)}`);
        }

        console.log(`Total price of all products: ${totalPrice}`);

        // Return the latest order ID
        response.status(201).json({ id: latestOrderID });

    } catch (error) {
        console.error('Error creating order:', error.message || error);
        response.status(500).json({ error: 'Failed to create order', details: error.message });
    }
};

/*
CLIENT CONTROLLER

This function is for adding new products to orders

HTTP PUT /<orderRoutes>/<orderID
{
  "products":[
    ["productID":value, "quantity": value,  "totalPricePerProduct":value ], FOLLOW THE FORMAT HERE SA PAG COMPOSE NG BODY
    ["productID":100, "quantity": 100,  "totalPricePerProduct":100.00 ] MAKE SURE DECIMAL SIYA
    ],
} 
*/ 

const addToOrder = async (request, response) => {
    const db = request.db;
    const{orderId} = request.params;
    const { productId, quantity, totalPricePerProduct } = request.body; // Extract updates map and total price

    try {
        // Validate totalPrice if needed
        const [insertResult] = await db.query(
            'INSERT INTO order_products (ProductID,`OrderID`, Quantity, Total) VALUES (?, ?, ?, ?)',
            [productId, orderId,quantity, totalPricePerProduct]);
            
        // Additional processing for totalPrice if needed
        console.log(`Total price of all products: ${totalPricePerProduct }`);

        response.json({ message: 'Products updated successfully', totalPricePerProduct  });
    } catch (error) {
        console.error('Error creating order:', error);
        response.status(500).send('Failed to create order');
    }
};



/*
CLIENT CONTROLLER

This function is for cancelling the order and returning the stocks ADD RETURN STOCKS

HTTP PUT /<orderRoutes>/<orderId>
*/ 
const cancelOrder = async (request, response) => {// RECENTLY DONE
    const db = request.db;
    const { orderId } = request.params;

    try {
        await returnStocks(orderId, db);
        const [rmOrder] = await db.query('DELETE FROM `order` o WHERE o.OrderID  ?',[orderId]);
        const [rmOrderPrd] = await db.query('DELETE FROM order_products p  WHERE  p.OrderID = ?',[orderId]);
        response.json({ 
            message: `Order with ID ${orderId} successfully canceled.`,
            removedOrder: rmOrder.affectedRows, // Number of rows removed from `order`
            removedOrderProducts: rmOrderPrd.affectedRows // Number of rows removed from `order_products`
        });
    } catch (error) {
        console.error('Error canceling order:', error);
        response.status(500).send('Failed to cancel order');
    }
};

async function returnStocks (orderId , db){
    try {
    const [getProduct] = await db.query(
        `SELECT o.ProductID as productID , o.Quantity as qty FROM order_products o WHERE o.OrderID = ?`,
         [orderId]
        );
    //extract rows and 
    for(let products of getProduct){
        const {productId , qty}= products;
         await db.query(
            `UPDATE product SET StocksRemaining = (StocksRemaining + ?) WHERE product.ProductID = ?`,
            [qty,productId]
        );
    }
    } catch (error) {
        console.error('Error returning stocks:', error);
        throw new Error('Failed to return stocks'); 
    }
}

/*
VENDOR CONTROLLER

This function is used to approve pending orders of the booth. It is used by the regulators of the booth

change pending order to complete

HTTP PUT /<orderRoute>/<orderID>
{
"datePaid": value
}
*/
const approveOrder = async (request, response) => {
    const db = request.db;
    const { orderId } = request.params;
    const {datePaid}= request.body;

    try {
        // First check if order exists and is not already completed
        const [orderCheck] = await db.query(
            'SELECT Status FROM `order` WHERE OrderID = ?',
            [orderId]
        );

        if (!orderCheck.length) {
            return response.status(404).json({ error: 'Order not found' });
        }

        if (orderCheck[0].Status === 'Complete') {
            return response.status(400).json({ error: 'Order is already completed' });
        }


        const [rows] = await db.query('UPDATE `order` SET `Status` = "Complete", `DatePaid` = ? WHERE `order`.`OrderID` = ?',
            [datePaid, orderId]);
        res.json(rows);
    } catch (error) {
        console.error('Error approving order:', error);
        response.status(500).send('Failed to approve order');
    }
};

const checkPendingOrder =async (request, response) => {
    const db = request.db;
    const {customerId} = request.params;

    try {
        // First check if order exists and is not already completed
        const [orderCheck] = await db.query(
          "SELECT b.BoothID as 'Booth ID',o.OrderID as 'orderId',o.Price as 'grandTotal', p.ProductID as 'Product ID', p.Quantity as 'Quantity',p.Total as 'Total price per product', x.name as 'Product Name', TO_BASE64(x.Image) as 'Product Image', x.Price as 'Product price'FROM `order` o JOIN `order_products` p ON o.OrderID = p.OrderID JOIN `product` x ON p.ProductID = x.ProductID JOIN `booth` b ON b.BoothID = x.BoothID WHERE o.customerID = 1 AND o.Status = 'Pending'",
           [customerId]
        );

        if (!orderCheck.length) {
            return response.status(404).json({ error: 'Order not found' });
        }

        response.json(orderCheck);
    } catch (error) {
        console.error('Error approving order:', error);
        response.status(500).send('Failed to approve order');
    }
};


export { getCompletedOrders, getReservedOrders, createOrder, cancelOrder, approveOrder, addToOrder, checkPendingOrder};