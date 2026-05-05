module.exports = (req, res, next) => {
    // 1. Get the header (use lowercase 'authorization' to be safe with Axios)
    const authHeader = req.headers['authorization'] || req.header('Authorization');
    
    // 2. Check if it exists
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    // 3. Logic to handle both "Bearer <token>" AND just "<token>"
    let token;
    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        token = authHeader;
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        console.log("JWT Verify Error:", err.message);
        res.status(400).json({ message: "Invalid Token" });
    }
};