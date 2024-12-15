/*
 * Gets the product for a certain boo
- filerts a product i.e active or inactive
- sorts product ASC or DESC

USED BY: vendor & customer
 */

const getProducts = async (request, response) => {
  const db = request.db;
  const { boothId } = request.params;
  const {
    query: { sort},
  } = request;

  try {
    let query =
      'SELECT p.ProductID AS "ProductID", p.name AS "Name", p.StocksRemaining AS "Stocks", p.Price AS "Price", p.status AS "Status", TO_BASE64(p.Image) AS "Image" FROM `product` p WHERE p.BoothID = ?';
    let params = [boothId];

    // Apply sorting logic
    if (sort) {
      const allowedSortFields = ["name", "price"];
      const [field, order] = sort.split(":");

      if (
        allowedSortFields.includes(field) &&
        ["asc", "desc"].includes(order.toLowerCase())
      ) {
        query += ` ORDER BY p.${field} ${order.toUpperCase()}`;
      } else {
        return response.status(400).json({ error: "Invalid sort parameter" });
      }
    }

    const [rows] = await db.query(query, params);

    response.json(rows); // Convert response to JSON

  } catch (error) {
    console.error("Error fetching products:", error);
    response.status(500).send("Failed to fetch products");
  }
};

const getLiveProducts = async (request, response) => {
  const db = request.db;
  const { boothId } = request.params;
  const {
    query: { filter, sort},
  } = request;

  try {
    let query =
      'SELECT p.ProductID AS "ProductID", p.name AS "Name", p.StocksRemaining AS "Stocks", p.Price AS "Price", p.status AS "Status", TO_BASE64(p.Image) AS "Image" FROM `p roduct` p WHERE p.BoothID = ? AND p.status = "Live"';
    let params = [boothId];

    // Apply sorting logic
    if (sort) {
      const allowedSortFields = ["name", "price"];
      const [field, order] = sort.split(":");

      if (
        allowedSortFields.includes(field) &&
        ["asc", "desc"].includes(order.toLowerCase())
      ) {
        query += ` ORDER BY p.${field} ${order.toUpperCase()}`;
      } else {
        return response.status(400).json({ error: "Invalid sort parameter" });
      }
    }

    const [rows] = await db.query(query, params);

    response.json(rows); // Convert response to JSON

  } catch (error) {
    console.error("Error fetching products:", error);
    response.status(500).send("Failed to fetch products");
  }
};




/*
 Gets the detailed version of the product
 
 USED BY: customer
*/
const getProductDetails = async (request, response) => {
  const db = request.db;
  const { productId } = request.params;

  try {
    const [rows] = await db.query(
      "SELECT p.ProductID AS ProductID ,p.name AS Name,p.StocksRemaining AS Stocks , p.Price as Price, p.status AS Status,TO_BASE64(p.Image) as Image FROM `product` p WHERE p.ProductID = ?",
      [productId]
    );
    response.json(rows);
  } catch (error) {
    console.error("Error fetching product details:", error);
    response.status(500).send("Failed to fetch product details");
  }
};

/*
 * Buy product fetch 
- updated order table
- remove stocks  from product table
- insert in inventory table
- returns a breakdown of the order

used in checking out orders

USED BY: customer
 */
const buyProduct = async (request, response) => {
  const db = request.db;
  const { orderId } = request.params;
  const { datePaid } = request.body;

  try {
    const [allPositive] = await db.query(
      `
      SELECT 
        CASE 
          WHEN COUNT(*) = SUM(CASE WHEN (p.StocksRemaining - o.Quantity) > 0 THEN 1 ELSE 0 END) 
          THEN TRUE 
          ELSE FALSE 
        END AS AllPositive
      FROM product p
      JOIN order_products o ON p.ProductID = o.ProductID
      WHERE o.OrderID = ?;
      `,
      [orderId]
    );

    if (allPositive.length && allPositive[0].AllPositive) {

      await db.query(
      "UPDATE `order` SET `Status` = 'Pending', `DatePaid` = ? WHERE `order`.`OrderID` = ?",
      [datePaid,orderId]
    );// updated status and date of order

      await db.query(
      "UPDATE product p SET p.StocksRemaining = p.StocksRemaining - ( SELECT o.Quantity FROM order_products o WHERE o.OrderID = ? AND o.ProductID = p.ProductID ) WHERE p.ProductID IN ( SELECT o.ProductID FROM order_products o WHERE o.OrderID = ? )",
      [orderId, orderId]
    ); // remove stocks in product

    
    await db.query(
      "INSERT INTO inventory (InventoryID, ProductID, Date, Type, Quantity) SELECT NULL, p.ProductID, DATE(o.DatePaid) AS DatePaid, 'out', p.Quantity FROM `order` o JOIN order_products p ON o.OrderID = p.OrderID WHERE o.OrderID = ?",
      [orderId]
    );// insert updated in inventory

    const [breakdown]= await db.query(
      "SELECT o.OrderID AS 'order id', x.name AS 'product name', x.Price AS 'product price', p.Quantity AS 'number of ordered product', p.Total AS 'total price per product', o.Price AS 'overall total' FROM `order` o JOIN `order_products` p ON o.OrderID = p.OrderID JOIN `product` x ON p.ProductID = x.ProductID JOIN `booth` b ON b.BoothID = x.BoothID WHERE o.OrderID = ?",
      [orderId]
    );// return breakdown order
      response.json(breakdown);
    } else {
      response.json({
        message: "Product purchased unsuccessfully",
      });
    }
  } catch (error) {
    console.error("Error buying products:", error);
    response.status(500).send("Failed to buy products");
  }
};


/**
 * Create product
- add new product in product table
- updaet new stock in inventory table


USED BY: vendor
 */
const createProduct = async (request, response) => {
  console.log("Create Product I");
  const db = request.db;
  const { boothID, stocks, price, name, status, image } = request.body;

  if (status !== "active" && status !== "inactive") {
    return response
      .status(400)
      .send('Invalid status. It must be either "active" or "inactive".');
  }
  try {

    console.log("Received image data length:", image ? image.length : 0);

    await db.beginTransaction();

    let imageBuffer = null;
    if (image && typeof image === 'string') {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
    }

    const [rows] = await db.query(
      'INSERT INTO `product` (`ProductID`, `BoothID`, `StocksRemaining`, `Price`, `name`, `status`, `Image`) VALUES (NULL, ?,?, ?, ?, ?, ?)',
      [boothID, stocks, price, name, status, imageBuffer]
    );// query for creating new product

    await db.query(
      'INSERT INTO `inventory` (`InventoryID`, `ProductID`, `Date`, `Type`, `Quantity`) VALUES (NULL, ?, ?, "in", ?)',
      [rows.insertId, getCurrentDate(), stocks]
    );// query to add stocks to inventory

    response.json(rows);
  } catch (error) {
    console.error("Error creating products:", error);
    response.status(500).send("Failed to create products");
  }

};

/**
 * edit a product
- edit column/s in product table

USED BY: vendor 
*/
const editProduct = async (request, response) => {

  const db = request.db;
  const { productId } = request.params; 
  const { product } = request.body; // product is an array of "key:value"

  try {

    for (const field of product) {
      const key = Object.keys(field)[0];  // arraylist for keys from body, [name, price] 
      let value = Object.values(field)[0]; // arraylist for values from body, [myName,150]

      if (key === "Image" && value) {
        value = value.replace(/^data:image\/\w+;base64,/, '');
        value = Buffer.from(value, 'base64');
      }



      if (key === "StocksRemaining") {
        await updateStockInInventory(value, productId , db);
      }

       // Prepare the query
      const query = `UPDATE \`product\` SET \`${key}\` = ? WHERE \`ProductID\` = ?`;

      // Execute the query
      const [updateResult] = await db.query(query, [value, productId]);

      if (updateResult.affectedRows === 0) {
        return response
          .status(404)
          .send(`Product with ID ${productId} not found or not updated`);
      }
    }// end of loop

    response.json({
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:",  error.message, error.stack);
    response.status(500).json({ error: error.message });
  }
};
/*
fetch for deleting a product
- deletes a product in porduct table
- check if there are pending order 

USED BY: vendor
*/
const deleteProduct = async (request, response) => {
  const db = request.db;
  const { productId } = request.params;

  try {
    // First check if the product exists
    const [product] = await db.query(
      "SELECT ProductID FROM product WHERE ProductID = ?",
      [productId]
    );

    if (product.length === 0) {
      return response.status(404).json({
        message: "Product not found"
      });
    }

    // Check if product has any orders
    const [orders] = await db.query(
      "SELECT o.Status FROM order_products p JOIN `order` o ON p.OrderID = o.OrderID WHERE p.ProductID = ? AND o.Status = 'Pending'",
      [productId]
    );

    if (orders[0].orderCount > 0) {
      return response.status(400).json({
        message: "Cannot delete product that has associated orders. Consider deactivating it instead."
      });
    }

    // Start a transaction
    await db.beginTransaction();

    try {
      // Delete inventory records first
      await db.query(
        "DELETE FROM inventory WHERE ProductID = ?",
        [productId]
      );

      // Delete the product
      const [deleteResult] = await db.query(
        "DELETE FROM product WHERE ProductID = ?",
        [productId]
      );

      // Commit the transaction
      await db.commit();

      response.json({
        message: "Product deleted successfully",
        deletedProductId: productId
      });

    } catch (error) {
      await db.rollback();
      throw error;
    }

  } catch (error) {
    console.error("Error deleting product:", error);
    response.status(500).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
};

/*
helper function to updateStocks

USED BY: customer
*/

const updateStockInInventory = async (value, productId, db) => {
  try {
    // Query to get the current and updated stock values
    const [difference] = await db.query(
      'SELECT p.StocksRemaining as "current stocks", ' +
      '(p.StocksRemaining - ? ) as "updated stocks" ' +
      'FROM product p WHERE p.ProductID = ?',
      [value, productId]
    );

    const { 'current stocks': currentStocks, 'updated stocks': updatedStocks } = difference[0];

    if (updatedStocks > 0) { // stocks decreased
      await db.query(
        'INSERT INTO `inventory` (`InventoryID`, `ProductID`, `Date`, `Type`, `Quantity`) ' + 
        'VALUES (NULL, ?, ?, "out", ?)',
        [productId, getCurrentDate(), updatedStocks]
      ); // query to add stocks to inventory when stocks decrease

    } else { // stocks increased
      const stocks = (updatedStocks * -1);
      await db.query(
        'INSERT INTO `inventory` (`InventoryID`, `ProductID`, `Date`, `Type`, `Quantity`) ' + 
        'VALUES (NULL, ?, ?, "in", ?)',
        [productId, getCurrentDate(), stocks]
      ); // query to add stocks to inventory when stocks increase

    }

  } catch (error) {
    console.error("Error updating stock information:", error);
    throw new Error("Error updating stock information.");
  }
};

/*
helper function to retrive current

USED BY: customer
*/
const getCurrentDate = () => {
  const date = new Date();

  // Get the date in the format 'YYYY-MM-DD'
  const formattedDate = date.toISOString().slice(0, 10); // Extract the 'YYYY-MM-DD' part

  return formattedDate;
};

/*
export statement
*/
export {
      getProducts,
      getLiveProducts,
      getProductDetails,
      buyProduct,
      createProduct,
      editProduct,
      deleteProduct
    };