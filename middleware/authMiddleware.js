const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Check both uppercase and lowercase header names
    const authHeader = req.header('Authorization') || req.headers['authorization'];
    
    if (!authHeader) return res.status(401).json({ message: "Access Denied" });

    // Handle both "Bearer <token>" and just "<token>"
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : authHeader;

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // This should contain the _id from your token payload
        next();
    } catch (err) {
        console.log("JWT Verify Error:", err.message);
        res.status(400).json({ message: "Invalid Token" });
    }
};