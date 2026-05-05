const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Grab the header
    const authHeader = req.header('Authorization');
    
    // 2. Check if header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    // 3. Extract only the token part (the string after the space)
    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // This attaches {_id: "..."} to the request
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};