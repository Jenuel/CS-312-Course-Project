// Implementation of the logic
/**
 * FRONT END HANDLING FOR IMAGE
 * <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" alt="Product Image">
 */
/*
 * Gets the product for a certain booth

INPUT:
HTTP PUT /<productRoutes>/<boothId>

 */

const getProducts = async (request, response) => {
  const db = request.db;
  const { boothId } = request.params;
  const { 
      query: { filter, sort } 
   } = request;

  try {
      let query = 'SELECT p.name AS "Name", p.status AS "Status", TO_BASE64(p.Image) AS "Image" FROM `product` p ';
      let params = [boothId];
      

      if (filter) {
          query += ' WHERE p.BoothID = ?';  
          params.push(`%${filter}%`);  
      }

      if (sort) {
          const allowedSortFields = ['name', 'price']; 
          const [field, order] = sort.split(':'); 
          
          if (allowedSortFields.includes(field) && ['asc', 'desc'].includes(order.toLowerCase())) {
              query += ` ORDER BY p.${field} ${order.toUpperCase()}`;
          } else {
              throw new Error('Invalid sort parameter'); 
          }
      }

      const [rows] = await db.query(query, params);
      
      response.json(rows);// convert response to json
  } catch (error) {
      console.error('Error fetching products:', error);
      response.status(500).send('Failed to fetch products');
  }
};

/*
 * Gets the detailed version of the product 

INPUT:
HTTP PUT /<productRoutes>/<productId>

 */
// const getProductDetails = async (request, response) => {//GOOD
//     const db = request.db;
//     const { productId } = request.params;

//     try {
//         const [rows] = await db.query('SELECT p.name,p.StocksRemaining AS Stocks , p.Price , p.status , TO_BASE64(p.Image) FROM `product` p WHERE p.ProductID = ?',[productId]);
//         response.json(rows);
//     } catch (error) {
//         console.error('Error fetching product details:', error);
//         response.status(500).send('Failed to fetch product details');
//     }
// };
/*SAMPLE OUTPUT
    
    {
        "name": "Handmade Bracelet",
        "Stocks": 50,
        "Price": 29.99,
        "status": "active",
        "Image": "base64"
    }

    */
const getProductDetails = async (request, response) => {
  //GOOD
  const db = request.db;
  const { productId } = request.params;

  try {
    const [rows] = await db.query(
      "SELECT p.name AS Name,p.StocksRemaining AS Stocks , p.Price as Price, p.status AS Status,TO_BASE64(p.Image) as Image FROM `product` p WHERE p.ProductID = ?",
      [productId]
    );
    response.json(rows);
  } catch (error) {
    console.error("Error fetching product details:", error);
    response.status(500).send("Failed to fetch product details");
  }
};

/*
 * Decrements the stock of the product given.
directlty from the store 
already paid

INPUT:
HTTP PUT /<productRoutes>/<productId>
{
"numberOfProductSold":value
}
 */

const buyProduct = async (request, response) => {
  //PLEASE DOUBLE CHECK LOGIC
  const db = request.db;
  const { productId } = request.params;
  const { numberOfProductsSold } = request.body; // please check if this is right

  try {
    // Fetch the current stock
    const [stocks] = await db.query(
      "SELECT p.StocksRemaining AS Stocks FROM `product` p WHERE p.ProductID = ?",
      [productId]
    );

    if (stocks.length === 0) {
      return response.status(404).send("Product not found");
    }

    const currentStocks = stocks[0].Stocks;

    if (numberOfProductsSold > currentStocks) {
      return response.status(400).send("Insufficient stock to sell");
    }

    // Calculate the remaining stocks
    const remainingStocks = currentStocks - numberOfProductsSold;

    if (remainingStocks <= 5) {
      return response.status(400).send("Insufficient stock remaining");
    }

    // Update the stock in the database
    const [updateResult] = await db.query(
      "UPDATE `product` SET `StocksRemaining` = ? WHERE `ProductID` = ?",
      [remainingStocks, productId]
    );

    response.json({
      message: "Product purchased successfully",
      updatedRows: updateResult.affectedRows,
    });
  } catch (error) {
    console.error("Error buying products:", error);
    response.status(500).send("Failed to buy products");
  }
};

/**
 * Create product

INPUT:
{
    "boothID": 123,
    "stocks": 50,
    "price": 29.99,
    "name": "Handmade Bracelet",
    "status": "active",
    "image": "0x89504E470D0A1A0A0000000D49484452" // Hexadecimal image data
} 

 */
const createProduct = async (request, response) => {
  //GOOD KINDA
  const db = request.db;
  const { boothID, stocks, price, name, status, image } = request.body; // please check if this is right

  if (status !== "active" && status !== "inactive") {
    return response
      .status(400)
      .send('Invalid status. It must be either "active" or "inactive".');
  }
  try {
    const [rows] = await db.query(
      "INSERT INTO `product` (`ProductID`, `BoothID`, `StocksRemaining`, `Price`, `name`, `status`, `Image`) VALUES (NULL, ?,?, ?, ?, ?, ?)",
      [boothID, stocks, price, name, status, image]
    );
    response.json(rows);
  } catch (error) {
    console.error("Error creating products:", error);
    response.status(500).send("Failed to create products");
  }
  if (status !== "active" && status !== "inactive") {
    return response
      .status(400)
      .send('Invalid status. It must be either "active" or "inactive".');
  }

  try {
    const [rows] = await db.query(
      "INSERT INTO `product` (`ProductID`, `BoothID`, `StocksRemaining`, `Price`, `name`, `status`, `Image`) VALUES (NULL, ?,?, ?, ?, ?, ?)",
      [boothID, stocks, price, name, status, image]
    );
    response.json(rows);
  } catch (error) {
    console.error("Error creating products:", error);
    response.status(500).send("Failed to create products");
  }
};

/**
 * edit a product
 * for product details
 
INPUT:
 HTTP PUT /<productRoutes>/<productId>
 { // body
  "product": ["name": "myName","price": 150]
 } 
*/

const editProduct = async (request, response) => {
  //GOOD

  const db = request.db;
  const { productId } = request.params; // productId is now from request.params
  const { product } = request.body; // fields to be updated are in request.body

  try {
    /*
        if (!fields || typeof fields !== 'object') {
            return response.status(400).send('Invalid request body format');
        }
        */

    for (const [fields] in product) {
      const keys = Object.keys(fields); // arraylist for keys from body, [name, price]
      const values = Object.values(fields); // arraylist for values from body, [myName,150]

      const setClause = keys.map((key) => `\`${key}\` = ?`).join(", "); // setting clause for query
      // EX: `name` = ?, `price` = ?

      values.push(productId); //add id to the values

      const query = `UPDATE \`product\` SET ${setClause} WHERE \`ProductID\` = ?`;

      // Execute the query to update the product
      const [updateResult] = await db.query(query, values);

      if (updateResult.affectedRows === 0) {
        return response
          .status(404)
          .send(`Product with ID ${productId} not found or not updated`);
      }

      response.json({
        message: "Product updated successfully",
        updatedRows: updateResult.affectedRows,
      });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    response.status(500).send("Failed to update product");
  }
};

/**
 * edit a product status
 * for market publish

INPUT:
HTTP PUT /<productRoutes>/<productId>
{
"status": value
}
 */
const changeStatusProduct = async (request, response) => {
  //GOOD
  const db = request.db;
  const { productId } = request.params;
  const { status } = request.body; // please check if this is right

  try {
    // Update the stock in the database
    const [updateResult] = await db.query(
      "UPDATE `product` SET `status` = ? WHERE `ProductID` = ?",
      [status, productId]
    );

    response.json({
      message: "Product purchased successfully",
      updatedRows: updateResult.affectedRows,
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    response.status(500).send("Failed to update product status");
  }
};

export {
  getProducts,
  getProductDetails,
  buyProduct,
  createProduct,
  editProduct,
  changeStatusProduct,
};
