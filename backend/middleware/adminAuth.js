import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        // Extract the authorization header
        const authHeader = req.headers.authorization;

        // Check if the header is present and starts with "Bearer"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
        }

        // Extract the token after "Bearer"
        const token = authHeader.split(' ')[1];

        // Verify the token
        const tokenDecode = jwt.verify(token, process.env.ACCESS_JWT_SECRET);

        // Check if the decoded token includes the correct admin credentials
        if (tokenDecode.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not Authorized. Access denied." });
        }
         console.log(tokenDecode)
         console.log(tokenDecode.role)
         console.log(tokenDecode.role === 'admin')
        // Proceed to the next middleware if validation passes
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export default adminAuth;
