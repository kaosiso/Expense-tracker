const jwt = require('jsonwebtoken');
const User = require('../models/User')

exports.protect = async (req,res, next) => {
    console.log("Authorization Header:", req.headers.authorization);

    let token = req.headers.authorization?.split(" ")[1];
    if (!token) 
        return res.status(401).json({ message: "Not authorized, no token, first error" });
    
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);  // This will show the payload of the token

        req.user = await User.findById(decoded.id).select('-password');
        console.log(req.user)
        next();
       
        
    } catch (err) {
        console.error("JWT verification error:", err);  
        res.status(401).json({message: "Not Authorized, token failed"})
    }
}