import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50, // Length constraints for name
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), // Regex for email validation
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Minimum password length for security
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Restrict to either "user" or "admin"
      default: "user", // Default role is "user"
    },
    cartData: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1, // Default quantity is 1
          min: 1, // Ensure positive quantity
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    minimize: false, // Retain empty objects in the database
  }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
