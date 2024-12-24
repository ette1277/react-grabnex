import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        // Extract the authorization header
        const authHeader = req.headers.authorization;

        // Check if the header is present and starts with "Bearer"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Please log in again.' });
        }

        // Extract the token after "Bearer"
        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);

        // Attach the user ID to the request object
        req.userId = decoded.id;

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("Auth User Error:", error.message);
        res.status(401).json({ success: false, message: 'Token is invalid or expired. Please log in again.' });
    }
};

export default authUser;
