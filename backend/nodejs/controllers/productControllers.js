// Implementation of the logic

/*
 * Gets the product for a certain booth
 */
const getProducts = async (request, response) => {//GOOD
    const db = request.db;
    const { boothId } = request.params;

    try {
        const [rows] = await db.query('SELECT  p.name AS "Name", p.status AS "Status", p.Image AS "Image"  FROM `product` p WHERE p.BoothID = ?', [boothId]);
        response.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).send('Failed to fetch products');
    }
};

/*
 * Gets the detailed version of the product 
 */
const getProductDetails = async (request, response) => {//GOOD
    const db = request.db;
    const { productId } = request.params;
    
    try {
        const [rows] = await db.query('SELECT p.name,p.StocksRemaining AS Stocks , p.Price , p.status ,p.Image FROM `product` p WHERE p.ProductID = ?',[productId]);
        response.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).send('Failed to fetch products');
    }
};

/*
 * Decrements the stock of the product given.
 */
const buyProduct = async (request, response) => {//GOOD KINDA
    const db = request.db;
    const { productId } = request.params;
    const { numberOfProductsSold } = request.body; // please check if this is right

    try {
         // Fetch the current stock
         const [stocks] = await db.query('SELECT p.StocksRemaining AS Stocks FROM `product` p WHERE p.ProductID = ?', [productId]);

         if (stocks.length === 0) {
             return response.status(404).send('Product not found');
         }
 
         const currentStocks = stocks[0].Stocks;

         if (numberOfProductsSold > currentStocks) {
            return response.status(400).send('Insufficient stock to sell');
        }
 
         // Calculate the remaining stocks
         const remainingStocks = currentStocks - numberOfProductsSold;
 
         if (remainingStocks  <= 5) {
             return response.status(400).send('Insufficient stock remaining');
         }
 
         // Update the stock in the database
         const [updateResult] = await db.query('UPDATE `product` SET `StocksRemaining` = ? WHERE `ProductID` = ?', [remainingStocks, productId]);
 
         response.json({ message: 'Product purchased successfully', updatedRows: updateResult.affectedRows });
   
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).send('Failed to fetch products');
    }
};

/**
 * Create product
 */
const createProduct = async (request, response) => {//GOOD KINDA
    const db = request.db;
    const { boothID, stocks, price, name, status, image } = request.body; // please check if this is right

    if (status !== 'active' && status !== 'inactive') {
        return response.status(400).send('Invalid status. It must be either "active" or "inactive".');
    }

    try {
        const [rows] = await db.query('INSERT INTO `product` (`ProductID`, `BoothID`, `StocksRemaining`, `Price`, `name`, `status`, `Image`) VALUES (NULL, ?,?, ?, ?, ?, ?)',[boothID,stocks,price,name,status,image]);
        response.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).send('Failed to fetch products');
    }
};

/**
 * edit a product
 */
const editProduct = async (request, response) => {
    const db = request.db;
    const { status } = request.body; // please check if this is right

    try {
         // Update the stock in the database
         const [updateResult] = await db.query('UPDATE `product` SET `status` = ? WHERE `ProductID` = ?', [status, productId]);
 
         response.json({ message: 'Product purchased successfully', updatedRows: updateResult.affectedRows });
   
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).send('Failed to fetch products');
    } 
};
/**
 * edit a product status
 */
const changeStatusProduct = async (request, response) => {//GOOD KINDA
    const db = request.db;
    const { productId } = request.params;

    try {
        const [rows] = await db.query('SELECT * FROM products');
        response.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).send('Failed to fetch products');
    }
};

export { getProducts, getProductDetails, buyProduct, createProduct, editProduct, changeStatusProduct };