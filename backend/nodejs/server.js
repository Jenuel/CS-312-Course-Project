import express from 'express'
import mysql from 'mysql2'
import productRoutes from 'routes/productRoutes'
import orderRoutes from 'routes/orderRoutes'

const app = express()
const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "passsword",
    database: "nameofDatabase"
});

db.connect((error) => {
    if (error) {
        console.error('Database connection failed:', error)
    } else {
        app.listen(3000, () => {
            console.log("Listening to port 3000")
        });
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