import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's full name
  email: { type: String, required: true, unique: true }, // User's email, must be unique
  password: { type: String, required: true }, // User's hashed password
  cartData: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the product
      quantity: { type: Number, required: true, default: 1 }, // Quantity of the product in the cart
    },
  ], // Array to hold cart items
  date: { type: Date, default: Date.now }, // Date when the user was created
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
