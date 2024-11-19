// Implementation of the logic

/*
VENDOR CONTROLLER

This function is for getting the advanced/pending orders of a certain booth 
*/
const getPendingOrders = async (request, response) => {
    const db = request.db;
    const { boothId } = request.params;

    try {
        const [rows] = await db.query('SELECT * FROM `order`');
        response.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).send('Failed to fetch products');
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
        const [rows] = await db.query('SELECT * FROM products');
        response.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).send('Failed to fetch products');
    }
};

/*
CLIENT CONTROLLER

This function is for finalizing an order and sends it to the specific booth
*/ 
const createOrder = async (request, response) => {
    const db = request.db;
    const { boothId } = request.params;

    try {
        const [rows] = await db.query('SELECT * FROM products');
        response.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).send('Failed to fetch products');
    }
};

/*
CLIENT CONTROLLER

This function is for cancelling the order and returning the stocks
*/ 
const cancelOrder = async (request, response) => {
    const db = request.db;
    const { boothId } = request.params;

    try {
        const [rows] = await db.query('SELECT * FROM products');
        response.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).send('Failed to fetch products');
    }
};

/*
VENDOR CONTROLLER

This function is used to approve pending orders of the booth. It is used by the regulators of the booth
*/
const approveOrder = async (request, response) => {
    const db = request.db;
    const { boothId } = request.params;

    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).send('Failed to fetch products');
    }
};

const approveCancellation = async (request, response) => {
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

export { getPendingOrders, getCompletedOrders, createOrder, cancelOrder, approveOrder, approveCancellation };