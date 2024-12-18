import validator from 'validator';  // Correct import syntax for validator
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

// Token creation function
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Add token expiry for better security
};
es.cookie('access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
.status(200)
.json({ success: true, token, message: "User logged in successfully" });

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User doesn't exist" }); // Use 404 for "not found"
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      return res.status(200).json({ success: true, token, message: "User logged in successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Route for user registration
const registerUser = async (req, res) => {

  const { name, email, password } = req.body;
  try {
   

    // Check if all required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate email
    if (!validator.isEmail(email)) {

      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password length (at least 8 characters)
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" }); // Use 409 for "conflict"
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });


    // Save user to the database
    const user = await newUser.save();
    
    const token = createToken(user._id); // Generate token after registration

    return res.status(201).json({ success: true, token, message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
       success: false, message: "Server error", error: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};





export { loginUser, registerUser, adminLogin };
