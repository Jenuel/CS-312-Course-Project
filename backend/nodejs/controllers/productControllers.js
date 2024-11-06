// Implementation of the logic

/*
 * Gets the product for a certain booth
 */
const getProducts = async (request, response) => {
    const db = request.db;
    const { boothId } = request.params;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM product WHERE boothId = ?', [boothId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results); 
                }
            });
        });

        response.json(results);
    } catch (error) {
        response.status(500).send(error);
    }
};

/*
 * Gets the detailed version of the product 
 */
const getProductDetails = async (request, response) => {
    const db = request.db;
    const { productId } = request.params;
    
    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT ProductID, CategoryID, Name, Price FROM `product` WHERE BoothID = ?', [productId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results); 
                }
            });
        });

        response.status(200).json(results);
    } catch (error) {
        response.status(500).send(error);
    }
};

/*
 * Decrements the stock of the product given.
 */
const buyProduct = async (request, response) => {
    const db = request.db;
    const { productId } = request.params;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM products WHERE boothId = ?', [productId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results); 
                }
            });
        });

        response.json(results);
    } catch (error) {
        response.status(500).send(error);
    }
};

/**
 * Create product
 */
const createProduct = async (request, response) => {
    const db = request.db;
    const { productId } = request.params;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM products WHERE boothId = ?', [productId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results); 
                }
            });
        });

        response.json(results);
    } catch (error) {
        response.status(500).send(error);
    }
};

const editProduct = async (request, response) => {
    const db = request.db;
    const { productId } = request.params;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM products WHERE boothId = ?', [productId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results); 
                }
            });
        });

        response.json(results);
    } catch (error) {
        response.status(500).send(error);
    }
};

const changeStatusProduct = async (request, response) => {
    const db = request.db;
    const { productId } = request.params;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM products WHERE boothId = ?', [productId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results); 
                }
            });
        });

        response.json(results);
    } catch (error) {
        response.status(500).send(error);
    }
};

export { getProducts, getProductDetails, buyProduct, createProduct, editProduct, changeStatusProduct };