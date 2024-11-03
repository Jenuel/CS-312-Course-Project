// Implementation of the logic

/*
VENDOR CONTROLLER

This function is for getting the advanced/pending orders of a certain booth 
*/
const getPendingOrders = async (request, response) => {
    const db = request.db;
    const { boothId } = request.params;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM products WHERE boothId = ?', [boothId], (error, results) => {
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
VENDOR CONTROLLER

This function is for getting the completed orders of a certain booth 
*/
const getCompletedOrders = async (request, response) => {
    const db = request.db;
    const { boothId } = request.params;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM products WHERE boothId = ?', [boothId], (error, results) => {
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
CLIENT CONTROLLER

This function is for finalizing an order and sends it to the specific booth
*/ 
const createOrder = async (request, response) => {
    const db = request.db;
    const { boothId } = request.params;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM products WHERE boothId = ?', [boothId], (error, results) => {
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
CLIENT CONTROLLER

This function is for cancelling the order and returning the stocks
*/ 
const cancelOrder = async (request, response) => {
    const db = request.db;
    const { boothId } = request.params;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM products WHERE boothId = ?', [boothId], (error, results) => {
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
VENDOR CONTROLLER

This function is used to approve pending orders of the booth. It is used by the regulators of the booth
*/
const approveOrder = async (request, response) => {
    const db = request.db;
    const { boothId } = request.params;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM products WHERE boothId = ?', [boothId], (error, results) => {
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


export { getPendingOrders, getCompletedOrders, createOrder, cancelOrder, approveOrder };