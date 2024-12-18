import mongoose, { Mongoose } from "mongoose";




const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], default : [] }, // URL to the product image
  category: { type: String, required: true }, // e.g., 'Clothing'
  subCategory: { type: String, required: true }, // e.g., 'Shirts'
  sizes: { type: [String], default: []}, // e.g., ['S', 'M', 'L']
  bestsellers: { type: Boolean, default: true }, // to mark if it's a bestseller
  colors: { type: [String], default: [] }, // e.g., ['Red', 'Blue', 'Green']
  stock: {   type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'], },
  date: { type: Date, default: Date.now }, // date of product creation
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
