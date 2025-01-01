import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'Red', 'Blue'
  hex: { type: String, required: false } // Optional, e.g., '#FF0000'
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], default: [] }, // Array of image URLs
  category: { type: String, required: true }, // e.g., 'Clothing'
  subCategory: { type: String, required: true }, // e.g., 'Shirts'
  sizes: { type: [String], default: [] }, // Array of available sizes, e.g., ['S', 'M', 'L', 'XL']
  colors: { type: [colorSchema], default: [] }, // Array of available colors
  bestsellers: { type: Boolean, default: false }, // Bestseller flag
  stock: { 
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'], 
  },
  date: { type: Date, default: Date.now }, // Product creation date
});

// Create the model
const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;
// Compare this snippet from backend/models/userModel.js:
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
//