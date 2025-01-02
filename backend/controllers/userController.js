import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (id, expiresIn = "1h") => {
    return jwt.sign({ id }, process.env.ACCESS_JWT_SECRET, { expiresIn });
};

// User login
const loginUser = async (req, res) => {
    try {
        const {  email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email, username and password are required" });
        }

        const user = await userModel.findOne({ email });;
        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// Register User Function
const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Name, email, and password are required" });
      }
  
      if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
      }
  
      if (!validator.isStrongPassword(password)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Weak password. Use at least 8 characters, including uppercase, lowercase, numbers, and symbols",
          });
      }
  
      const exists = await userModel.findOne({ email });
      if (exists) {
        return res.status(409).json({ success: false, message: "User already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new userModel({ name, email, password: hashedPassword });
      const user = await newUser.save();
  
      const token = createToken(user._id); // Ensure createToken is defined
      res.status(201).json({ success: true, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };



// Admin login

const adminLogin = async (req, res) => {
    try {
        // Extract username and password from the request body
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }

        // Validate admin credentials
        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            // Generate a token for the admin user
            const token = jwt.sign(
                { role: 'admin' }, // Include role in the payload
                process.env.ACCESS_JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({ success: true, token });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
    } catch (error) {
        console.error('Admin Login Error:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export { loginUser, registerUser, adminLogin };
