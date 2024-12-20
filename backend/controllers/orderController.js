import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';


dotenv.config();

// global variables
const  currency = 'gbp'; // Define your currency explicitly


if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY,
    {
        apiVersion: '2020-08-27',
    });





export const createOrder = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
};


const deliveryCharge = 40;


// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Placing orders using Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers || {};

        if (!userId || !items || items.length === 0 || !amount || !address) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (!origin) {
            return res.status(400).json({ success: false, message: 'Invalid request origin' });
        }

        const currency = 'usd'; // Define your currency explicitly

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: new Date()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency,
                product_data: { name: item.name },
                unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency,
                product_data: { name: 'Delivery Charges' },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.status(201).json({ success: true, session_url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify Stripe payment
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (!orderId || !success || !userId) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (String(success) === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.status(200).json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.status(200).json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// User Order Data for Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const orders = await orderModel.find({ userId });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Order ID and status are required" });
        }

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.status(200).json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { placeOrderStripe, placeOrder, userOrders, updateStatus, verifyStripe, allOrders };
