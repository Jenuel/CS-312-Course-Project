// Implementation of the logic

/*
VENDOR CONTROLLER

This function is for getting the advanced/pending orders of a certain booth 
*/
const getPendingOrders = async (request, response) => {
    const db = request.db;

    try {
        const [rows] = await db.query('SELECT o.OrderID AS "order id", o.Price AS "Total Price",o.Status AS "Status",p.Quantity AS "Product Quantiti", c.name AS "Product Name" FROM `order` o JOIN `order_products` p ON o.OrderID = p.OrderID JOIN `product` c ON p.ProductID = c.ProductID WHERE o.Status = "Pending" ORDER BY o.OrderID ASC;');
        response.json(rows);
    } catch (error) {
        console.error('Error fetching pending order:', error);
        response.status(500).send('Failed to fetch pending order');
    }
};

/*
VENDOR CONTROLLER

This function is for getting the completed orders of a certain booth 
*/
const getCompletedOrders = async (request, response) => {
    const db = request.db;

    try {
        const [rows] = await db.query('SELECT o.OrderID AS "order id", o.Price AS "Total Price",o.Status AS "Status",p.Quantity AS "Product Quantiti", c.name AS "Product Name" FROM `order` o JOIN `order_products` p ON o.OrderID = p.OrderID JOIN `product` c ON p.ProductID = c.ProductID WHERE o.Status = "Complete" ORDER BY o.OrderID ASC;');
        response.json(rows);
    } catch (error) {
        console.error('Error fetching completed order:', error);
        response.status(500).send('Failed to fetch completed order');
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
    const{boothID} = request.params;
    const { products, totalPrice, date } = request.body; // Extract updates map and total price

    try {
        // Validate totalPrice if needed
        if (!totalPrice || typeof totalPrice !== 'number' || totalPrice < 0) {
            return response.status(400).send('Invalid totalPrice');
        }

        const {orderQuery}= await db.query('INSERT INTO `order` (`OrderID`, `BoothID`, `Status`, `DateOrdered`, `DatePaid`, `Price`) VALUES (NULL, ?, "Pending", ?, NULL, ?)',[boothID, date, totalPrice]);

        const latestOrderID = orderQuery.insertId;

        // Process updates map
        for (const [fields] of Object.entries(products)) {

            const { productId, quantity, totalPricePerProduct } = fields; // Destructure fields

            // Execute the query for each product update
            const [insertResult] = await db.query('INSERT INTO `order_products` (`ProductID`, `OrderID`, `Quantity`, `Total`) VALUES (?, ?, ?, ?)',[productId, latestOrderID,quantity, totalPricePerProduct]);

            if (insertResult.affectedRows === 0) {
                console.warn(`Product with ID ${productId} was not found or not updated.`);
            }
        }

        // Additional processing for totalPrice if needed
        console.log(`Total price of all products: ${totalPrice}`);

        response.json({ message: 'Products updated successfully', totalPrice });
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
const cancelOrder = async (request, response) => {// NOT FINISHED // add quaery for returning stocks
    const db = request.db;
    const { orderId } = request.params;

    try {
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
        const [rows] = await db.query('UPDATE `order` SET `Status` = "Complete", `DatePaid` = ? WHERE `order`.`OrderID` = ?',[datePaid, orderId]);
        res.json(rows);
    } catch (error) {
        console.error('Error approving order:', error);
        response.status(500).send('Failed to approve order');
    }
};


export { getPendingOrders, getCompletedOrders, createOrder, cancelOrder, approveOrder};