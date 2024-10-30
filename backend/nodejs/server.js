import express from 'express'
import productRoutes from 'routes/productRoutes'

const app = express()

app.use(express.json())

app.use("/products", productRoutes)

app.listen(3000, () => {
    console.log("Listening to port 3000")
})