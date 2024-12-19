import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], default: [] }, // Array of image URLs
  category: { type: String, required: true }, // e.g., 'Clothing'
  subCategory: { type: String, required: true }, // e.g., 'Shirts'
  size: { 
    type: String, 
    default: undefined, // Optional, not required
  }, // Single size for the T-shirt
  bestsellers: { type: Boolean, default: true }, // Bestseller flag
  color: { 
    type: String, 
    default: undefined, // Optional, not required
  }, // Single color for the T-shirt
  stock: { 
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'], 
  },
  date: { type: Date, default: Date.now }, // Product creation date
});

// Create the model
const productModel = mongoose.models.Product || mongoose.model("product", productSchema);

export default productModel;

