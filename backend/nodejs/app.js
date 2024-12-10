import express from 'express'
import mysql from 'mysql2'
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

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
        const connection = await pool.promise().getConnection(); 
        
        request.db = connection; 
        console.log("success database connection")
        response.on('finish', () => {
            if (request.db) request.db.release(); 
        });
        next();
    } catch (error) {
        console.error('Error getting database connection:', error);
        response.status(500).send('Internal Server Error');
    }
});

//middlewares
app.use(express.json())

//routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// app.listen(process.env.PORT, () => {
//     console.log("Listening on port", process.env.PORT || 3000)
// })
app.listen(3000, '127.0.0.1', () => {
    console.log("Server listening on port 3000");
});