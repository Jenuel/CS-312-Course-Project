import express from 'express'
import mysql from 'mysql2'
import productRoutes from 'routes/productRoutes'
import orderRoutes from 'routes/orderRoutes'

const app = express()
const pool = mysql.createPool({
    host: "localhost",
    user: "root", 
    password: "passsword",
    database: "nameofDatabase"
});

app.use(async (request, response, next) => {
    try {
        request.db = await pool.getConnection();
        next();
        response.on('finish', () => request.db.release());
    } catch (error) {
        console.error('Error getting database connection:', error);
        response.status(500).send('Internal Server Error');
    }
});

//middlewares
app.use((request, response, next) => {
    request.db = db;
    next();
})
app.use(express.json())

//routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);