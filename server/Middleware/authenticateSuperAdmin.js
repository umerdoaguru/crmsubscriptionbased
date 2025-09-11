
const verifySuperAdminToken = require('./verifySuperAdminToken');

// Middleware to check authentication
const authenticateSuperAdmin = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ success:false,message: 'Unauthorized - Missing token' });
    }

    const token = authorizationHeader.slice(7);

    // Verify and decode the token (you need to implement this function)
    console.log(token);
    
    const Superadmin = await verifySuperAdminToken(token);
    console.log(Superadmin);
    

    if (!Superadmin) {
        return res.status(401).json({ success:false,message: 'Unauthorized - Invalid token' });
    }

    // Attach the Superadmin to the request for later use
    req.Superadmin = Superadmin;
    console.log(Superadmin)
    next();
};

module.exports = authenticateSuperAdmin;