import jwt from 'jsonwebtoken';

// Verify admin token middleware
const authAdmin = (req, res, next) => {
    // Extract token from cookies or Authorization header
    const token = req.cookies.Admintoken || req.headers['authorization']?.replace(/^Bearer\s/, '');

    if (!token) {
        return res.status(403).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if the decoded token is for an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Not an admin.' });
        }

        // Attach the admin details to the request object
        req.admin = decoded;

        // Proceed to the next middleware or controller
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};














export default authAdmin;