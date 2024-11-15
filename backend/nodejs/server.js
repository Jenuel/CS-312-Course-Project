import express from 'express'
import mysql from 'mysql2'
import dotenv from 'dotenv';
import productRoutes from 'routes/productRoutes'
import orderRoutes from 'routes/orderRoutes'

dotenv.config();
const app = express()
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
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