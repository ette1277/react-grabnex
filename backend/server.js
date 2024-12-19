import express from 'express';
import cors from 'cors';
import  dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

dotenv.config();
  
// App Config
const app = express();
const port = process.env.PORT || 4000;  // Fallback to port 4000 if env PORT is undefined
connectDB();
connectCloudinary();  // Invoke the function to connect to Cloudinary

// Middleware
app.use(express.json());
app.use(cors());  // Assuming you want to use CORS



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// API entry point
app.get('/', (req, res) => {
  res.send('API Working');
});

// Add endpoint for user routes
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)







