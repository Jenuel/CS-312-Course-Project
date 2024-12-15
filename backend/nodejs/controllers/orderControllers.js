/*
function to get pending order of a booth
- selects order detail from order and order_products table

USED BY: vendor
*/
const getPendingOrders = async (request, response) => {
  const db = request.db;
  const { boothId } = request.params;

  try {
    const [rows] = await db.query(
      "SELECT o.OrderID AS 'OrderId', GROUP_CONCAT(c.Name ORDER BY c.Name) AS 'ProductName', GROUP_CONCAT(p.Quantity ORDER BY c.Name) AS 'Quantity', o.Price AS 'TotalPrice', o.Status AS 'Status', CONCAT(u.FirstName, ' ', u.LastName) AS 'CustomerName' FROM `order` o JOIN `order_products` p ON o.OrderID = p.OrderID JOIN `product` c ON p.ProductID = c.ProductID JOIN `customer` x ON o.customerID = x.CustomerID JOIN `users` u ON x.UserID = u.UserID WHERE o.Status = 'Pending' AND o.BoothID = ? GROUP BY o.OrderID, u.FirstName, u.LastName ORDER BY o.OrderID ASC",
      [boothId]
    );

    response.json(rows);
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    response.status(500).send("Failed to fetch pending orders");
  }
};

/*
function to get pending order of a booth
- selects order detail from order and order_products table

USED BY: vendor
*/
const getCompletedOrders = async (request, response) => {
  const db = request.db;
  const { boothId } = request.params;

  try {
    const [rows] = await db.query(
      "SELECT o.OrderID AS 'OrderId', GROUP_CONCAT(c.Name ORDER BY c.Name) AS 'ProductName', GROUP_CONCAT(p.Quantity ORDER BY c.Name) AS 'Quantity', o.Price AS 'TotalPrice', o.Status AS 'Status', CONCAT(u.FirstName, ' ', u.LastName) AS 'CustomerName',o.DatePaid as 'date paid' FROM `order` o JOIN `order_products` p ON o.OrderID = p.OrderID JOIN `product` c ON p.ProductID = c.ProductID JOIN `customer` x ON o.customerID = x.CustomerID JOIN `users` u ON x.UserID = u.UserID WHERE o.Status = 'Complete' AND o.BoothID = ? GROUP BY o.OrderID, u.FirstName, u.LastName ORDER BY o.DatePaid DESC",
      [boothId]
    );

    response.json(rows);
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    response.status(500).send("Failed to fetch completed orders");
  }
};

/*
creates an order
- add new order in order table
- add new line/s in order_products

USED BY: customer
*/
const createOrder = async (request, response) => {
  const db = request.db;
  const { boothID } = request.params;
  const { products, totalPrice, date, customerId } = request.body;

  //TESTER LOGS
  //console.log("Request body:", request.body);

  //TESTER LOGS
  console.log("Received boothID:", boothID);
  console.log("Received products:", products);
  console.log("Received totalPrice:", totalPrice);
  console.log("Received date:", date);

  try {
    // Validate inputs
    if (!boothID || isNaN(boothID)) {
      return response.status(400).send("Invalid boothID");
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return response.status(400).send("Invalid or empty products array");
    }

    if (!totalPrice || typeof totalPrice !== "number" || totalPrice <= 0) {
      return response.status(400).send("Invalid totalPrice");
    }

    if (!customerId || isNaN(customerId)) {
      return response.status(400).send("Invalid customerId");
    }

    // Insert order into the database
    const [orderQuery] = await db.query(
      "INSERT INTO `order` (OrderID, BoothID, Status, DateOrdered, DatePaid, Price, customerID) VALUES (NULL, ?, 'Reserved', ?, NULL, ?, ?)",
      [boothID, date, totalPrice, customerId]
    );

    const latestOrderID = orderQuery.insertId;

    if (!latestOrderID) {
      alert("Failed to create order. No insertId returned.");
      throw new Error("Failed to create order. No insertId returned.");
    }

    //TESTER LOGS
    console.log("New Order ID:", latestOrderID);

    // Insert each product into `order_products`
    for (const product of products) {
      const { productID, quantity, totalPricePerProduct } = product;

      if (
        !productID ||
        isNaN(productID) ||
        !quantity ||
        isNaN(quantity) ||
        !totalPricePerProduct ||
        isNaN(totalPricePerProduct)
      ) {
        throw new Error(`Invalid product data: ${JSON.stringify(product)}`);
      }

      await db.query(
        "INSERT INTO order_products (ProductID,`OrderID`, Quantity, Total) VALUES (?, ?, ?, ?)",
        [productID, latestOrderID, quantity, totalPricePerProduct]
      );

      //TESTER LOGS
      console.log(`Product inserted: ${JSON.stringify(product)}`);
    }

    //TESTER LOGS
    console.log(`Total price of all products: ${totalPrice}`);

    // Return the latest order ID
    response.status(201).json({ id: latestOrderID });
  } catch (error) {
    console.error("Error creating order:", error.message || error);
    response
      .status(500)
      .json({ error: "Failed to create order", details: error.message });
  }
};

/*
add products to order
- add new line/s in order_products

USED BY: customer
*/

const addToOrder = async (request, response) => {
  const db = request.db;
  const { orderId } = request.params;
  const { productID, quantity, totalPricePerProduct } = request.body; // Extract updates map and total price

  //TESTER LOGS
  console.log("add prd ", productID, " to ord ", orderId);

  try {
    // Validate totalPrice if needed
    for (const product of products) {
      const { productID, quantity, totalPricePerProduct } = product;

      if (
        !productID ||
        isNaN(productID) ||
        !quantity ||
        isNaN(quantity) ||
        !totalPricePerProduct ||
        isNaN(totalPricePerProduct)
      ) {
        throw new Error(`Invalid product data: ${JSON.stringify(product)}`);
      }

      await db.query(
        "INSERT INTO order_products (ProductID,`OrderID`, Quantity, Total) VALUES (?, ?, ?, ?)",
        [productID, orderId, quantity, totalPricePerProduct]
      );

      //TESTER LOGS
      console.log(`Product inserted: ${JSON.stringify(product)}`);
    }

    response.json({
      message: "Products added successfully to order: ",
      orderId,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    response.status(500).send("Failed to create order");
  }
};

/*
deletes an order
- delete a line in order table
- delete line/s in order_products table

USED BY: customer
*/
const cancelOrder = async (request, response) => {
  const db = request.db;
  const { orderId } = request.params;

  try {
    const [rmOrderPrd] = await db.query(
      "DELETE FROM order_products p  WHERE  p.OrderID = ?",
      [orderId]
    );
    const [rmOrder] = await db.query(
      "DELETE FROM `order` o WHERE o.OrderID  ?",
      [orderId]
    );

    response.json({
      message: `Order with ID ${orderId} successfully canceled.`,
      removedOrder: rmOrder.affectedRows, // Number of rows removed from `order`
      removedOrderProducts: rmOrderPrd.affectedRows, // Number of rows removed from `order_products`
    });
  } catch (error) {
    console.error("Error canceling order:", error);
    response.status(500).send("Failed to cancel order");
  }
};

/*
completes an order
- changes status of order to Complete

USED BY: vendor
*/
const completeOrder = async (request, response) => {
  const db = request.db;
  const { orderId } = request.params;
  const { datePaid } = request.body;

  try {
    // First check if order exists and is not already completed
    // Validate inputs
    if (!orderId) {
      return response.status(400).json({ error: "Order ID is required" });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}$/;
    if (!dateRegex.test(datePaid)) {
      return response.status(400).json({
        error: "Invalid date format",
        expectedFormat: "YYYY-MM-DD HH:MM:SS.MICROSECONDS",
      });
    }

    // Check order exists
    const [orderCheck] = await db.query(
      "SELECT Status FROM `order` WHERE OrderID = ?",
      [orderId]
    );

    if (orderCheck[0].Status === "Complete") {
      return response.status(400).json({ error: "Order is already completed" });
    }

    const [rows] = await db.query(
      'UPDATE `order` SET `Status` = "Complete", `DatePaid` = ? WHERE `order`.`OrderID` = ?',
      [datePaid, orderId]
    );

    console.log("Update Query Result:", rows);

    // Check if update was successful
    if (rows.affectedRows === 0) {
      console.error("Failed to update order status");
      throw new Error("Failed to update order status");
    }

    response.json({
      message: "Order completed successfully",
      updatedOrder: rows,
    });
  } catch (error) {
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
  }
};
/*
check reserved order of a cutsomer
- used for storing cart order for customer

USED BY: customer
*/
const checkReservedOrder = async (request, response) => {
  const db = request.db;
  const { customerId } = request.params;

  try {
    // First check if order exists and is not already completed
    const [orderCheck] = await db.query(
      "SELECT b.BoothID as 'boothID', o.OrderID as 'orderID', o.Price as 'grandTotal', p.ProductID as 'productID', p.Quantity as 'quantity', p.Total as 'totalPricePerProduct', x.name as 'productName', TO_BASE64(x.Image) as 'productImage', x.Price as 'productPrice' FROM `order` o JOIN `order_products` p ON o.OrderID = p.OrderID JOIN `product` x ON p.ProductID = x.ProductID JOIN `booth` b ON b.BoothID = x.BoothID WHERE o.customerID = ? AND o.Status = 'Reserved'",
      [customerId]
    );

    if (!orderCheck.length) {
      return response.status(404).json({ error: "Order not found" });
    }

    response.json(orderCheck);
  } catch (error) {
    console.error("Error approving order:", error);
    response.status(500).send("Failed to approve order");
  }
};

/*
use to remnove a product of ordered items
- edit in order_products 
- edit in orders (price or delete)

USED BY: customer
*/

const removeItemFromOrder = async (request, response) => {
  const db = request.db;
  const { orderId, productId } = request.params;

  try {
    // First check if the order exists and is pending
    const [orderCheck] = await db.query(
      "SELECT Status FROM `order` WHERE OrderID = ?",
      [orderId]
    );

    if (!orderCheck.length) {
      return response.status(404).json({ error: "Order not found" });
    }

    if (orderCheck[0].Status !== "Reserved") {
      return response
        .status(400)
        .json({ error: "Can only remove items from reserved orders" });
    }

    // Get the product's total price before removing
    const [productInfo] = await db.query(
      "SELECT Total, Quantity FROM order_products WHERE OrderID = ? AND ProductID = ?",
      [orderId, productId]
    );

    if (!productInfo.length) {
      return response.status(404).json({ error: "Product not found in order" });
    }

    const productTotal = productInfo[0].Total;

    // Begin transaction
    await db.beginTransaction();

    try {
      const [removeResult] = await db.query(
        "DELETE FROM order_products WHERE OrderID = ? AND ProductID = ?",
        [orderId, productId]
      );

      if (removeResult.affectedRows === 0) {
        throw new Error("Failed to remove product from order");
      }

      await db.query(
        "UPDATE `order` SET Price = (Price - ?) WHERE OrderID = ?",
        [productTotal, orderId]
      );

      const [remainingItems] = await db.query(
        "SELECT COUNT(*) as count FROM order_products WHERE OrderID = ?",
        [orderId]
      );

      let isEmpty = false;

      if (remainingItems[0].count === 0) {
        // If no items left, delete the order
        const [deleteOrder] = await db.query(
          "DELETE FROM `order` WHERE OrderID = ?",
          [orderId]
        );
        isEmpty = true;
      }

      await db.commit();

      response.json({
        message: "Product removed from order successfully",
        isEmpty: isEmpty,
        removedProduct: {
          productId,
          quantity: productInfo[0].Quantity,
          total: productTotal,
        },
      });
    } catch (error) {
      await db.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error removing product from order:", error);
    response.status(500).json({
      error: "Failed to remove product from order",
      details: error.message,
    });
  }
};

/*
use to alter quantity of ordered products
- edit in order_products

USED BY: customer
*/
const alterOrder = async (request, response) => {
  const db = request.db;
  const { orderId } = request.params;
  const { products } = request.body;

  try {
    const [orderCheck] = await db.query(
      "SELECT Status FROM `order` WHERE OrderID = ?",
      [orderId]
    );

    if (!orderCheck.length) {
      return response.status(404).json({ error: "Order not found" });
    }

    if (orderCheck[0].Status !== "Reserved") {
      return response
        .status(400)
        .json({ error: "Can only remove items from reserved orders" });
    }

    let isOrderEmpty = false;

    await db.beginTransaction();

    try {
      for (const field of products) {
        const { productID, quantity } = field;

        const [difference] = await db.query(
          "SELECT o.Quantity as `Initial Quantity`, (o.Quantity - ?) as `Updated Quantity` FROM order_products o WHERE o.ProductID = ? AND o.OrderID = ?",
          [quantity, productID, orderId]
        );

        if (!difference.length) continue;

        const {
          "Initial Quantity": currentStocks,
          "Updated Quantity": updatedStocks,
        } = difference[0];

        if (updatedStocks === currentStocks) {
          isOrderEmpty = await deleteProduct(db, orderId, productID);
        } else {
          await db.query(
            "UPDATE `order_products` SET `Quantity` = ? WHERE `ProductID` = ? AND `OrderID` = ?",
            [quantity, productID, orderId]
          );

          await db.query(
            "UPDATE order_products o SET o.Total = o.Quantity * (SELECT p.Price FROM product p WHERE p.ProductID = o.ProductID) WHERE o.ProductID = ? AND o.OrderID = ?",
            [productID, orderId]
          );
        }
      }

      if (!isOrderEmpty) {
        await updatedPrices(db, orderId);
      }

      await db.commit();

      response.json({
        message: isOrderEmpty ? "Order removed" : "Order updated successfully",
      });
    } catch (error) {
      await db.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error altering product from order", error);
    response.status(500).json({
      error: "Failed to alter product from order",
      details: error.message,
    });
  }
};

/*
helper function to update Grand total in order
*/
async function updatedPrices(db, orderId) {
  try {
    // After updating the order products, update the total price of the order
    const [orderTotal] = await db.query(
      "SELECT SUM(Total) AS `Updated Order Total` FROM order_products WHERE OrderID = ?",
      [orderId]
    );

    const updatedOrderTotal = orderTotal[0]["Updated Order Total"];

    await db.query("UPDATE `order` SET `Price` = ? WHERE `OrderID` = ?", [
      updatedOrderTotal,
      orderId,
    ]);
  } catch (error) {
    console.error("Error altering product from order", error);
    response.status(500).json({
      error: "Failed to alter product from order",
      details: error.message,
    });
  }
}
/*
helper function to delete a product and updating grand total in order
*/
async function deleteProduct(db, orderId, productId) {
  try {
    // Get the product's total price before removing
    const [productInfo] = await db.query(
      "SELECT Total, Quantity FROM order_products WHERE OrderID = ? AND ProductID = ?",
      [orderId, productId]
    );

    if (!productInfo.length) {
      return response.status(404).json({ error: "Product not found in order" });
    }

    const productTotal = productInfo[0].Total;

    // Begin transaction
    await db.beginTransaction();

    try {
      const [removeResult] = await db.query(
        "DELETE FROM order_products WHERE OrderID = ? AND ProductID = ?",
        [orderId, productId]
      );

      if (removeResult.affectedRows === 0) {
        throw new Error("Failed to remove product from order");
      }

      await db.query(
        "UPDATE `order` SET Price = (Price - ?) WHERE OrderID = ?",
        [productTotal, orderId]
      );

      const [remainingItems] = await db.query(
        "SELECT COUNT(*) as count FROM order_products WHERE OrderID = ?",
        [orderId]
      );

      let isEmpty = false;

      if (remainingItems[0].count === 0) {
        // If no items left, delete the order
        const [deleteOrder] = await db.query(
          "DELETE FROM `order` WHERE OrderID = ?",
          [orderId]
        );
        isEmpty = true;
      }

      await db.commit();

      response.json({
        message: "Product removed from order successfully",
        isEmpty: isEmpty,
        removedProduct: {
          productId,
          quantity: productInfo[0].Quantity,
          total: productTotal,
        },
      });
    } catch (error) {
      await db.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error removing product from order:", error);
    response.status(500).json({
      error: "Failed to remove product from order",
      details: error.message,
    });
  }
}

/*
export statement
*/
export {
  getPendingOrders,
  getCompletedOrders,
  createOrder,
  addToOrder,
  cancelOrder,
  completeOrder,
  checkReservedOrder,
  removeItemFromOrder,
  alterOrder,
};
