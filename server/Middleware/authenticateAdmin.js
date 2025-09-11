const verifyAdminToken = require('./verifyAdminToken');

// Middleware to check authentication
const authenticateAdmin = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ success:false,message: 'Unauthorized - Missing token' });
    }

    const token = authorizationHeader.slice(7);

    // Verify and decode the token (you need to implement this function)
    console.log(token);
    
    const admin = await verifyAdminToken(token);
    console.log(admin);
    

    if (!admin) {
        return res.status(401).json({ success:false,message: 'Unauthorized - Invalid token' });
    }

    // Attach the admin to the request for later use
    req.admin = admin;
    console.log(admin)
    next();
};

module.exports = authenticateAdmin;