import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';


  
// App Config
const app = express();
const port = process.env.PORT || 4000;  // Fallback to port 4000 if env PORT is undefined
connectDB();
connectCloudinary();  // Invoke the function to connect to Cloudinary

// Middleware
app.use(express.json());
app.use(cors());  // Assuming you want to use CORS







// Add endpoint for user routes
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)


// API entry point
app.get('/', (req, res) => {
  res.send('API Working');
});


app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});












