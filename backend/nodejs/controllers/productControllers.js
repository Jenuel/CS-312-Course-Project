// Implementation of the logic

/*
 * Gets the product for a certain booth
 */
const getProducts = async (request, response) => {
    const db = request.db;
    const { boothId } = request.params;

    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Failed to fetch products');
    }
};

/*
 * Gets the detailed version of the product 
 */
const getProductDetails = async (request, response) => {
    const db = request.db;
    const { productId } = request.params;
    
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Failed to fetch products');
    }
};

/*
 * Decrements the stock of the product given.
 */
const buyProduct = async (request, response) => {
    const db = request.db;
    const { productId } = request.params;

    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Failed to fetch products');
    }
};

/**
 * Create product
 */
const createProduct = async (request, response) => {
    const db = request.db;
    const { productId } = request.params;

    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Failed to fetch products');
    }
};

const editProduct = async (request, response) => {
    const db = request.db;
    const { productId } = request.params;

    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Failed to fetch products');
    }
};

const changeStatusProduct = async (request, response) => {
    const db = request.db;
    const { productId } = request.params;

    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Failed to fetch products');
    }
};

export { getProducts, getProductDetails, buyProduct, createProduct, editProduct, changeStatusProduct };