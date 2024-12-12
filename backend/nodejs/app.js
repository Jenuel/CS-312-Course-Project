import express from 'express'
import mysql from 'mysql2/promise';
// import mysql from 'mysql2'
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import analyticRoutes from './routes/analyticRoutes.js'

dotenv.config();

const app = express()
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Add CORS middleware before routes
app.use(cors({
    origin: ['http://localhost', 'http://localhost:80', 'http://127.0.0.1', 'http://127.0.0.1:80', 'http://localhost:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(async (request, response, next) => {
    try {
        const connection = await pool.getConnection();
        request.db = connection;
        response.on('finish', () => {
            if (request.db) request.db.release();
        });
        next();
    } catch (error) {
        console.error('Error getting database connection:', error);
        response.status(500).send('Internal Server Error');
    }
});


// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


//middlewares
app.use(express.json())

//routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/analytics",analyticRoutes)


app.get('/test', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});