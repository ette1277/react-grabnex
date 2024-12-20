import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Wrong credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate request body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Match admin credentials
        const isEmailMatch = email === process.env.ADMIN_EMAIL;
        const isPasswordMatch = password === process.env.ADMIN_PASSWORD;

        if (isEmailMatch && isPasswordMatch) {
            try {
                const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log('Generated Token:', token);
                return res.status(200).json({ success: true, token });
            } catch (err) {
                console.error('JWT Error:', err.message);
                return res.status(500).json({ success: false, message: 'Token generation failed' });
            }
        } else {
            return res.status(401).json({ success: false, message: "Wrong credentials" });
        }
    } catch (error) {
        console.error('Admin login error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



export { loginUser, registerUser, adminLogin }