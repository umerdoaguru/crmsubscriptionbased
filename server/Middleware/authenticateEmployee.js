const verifyEmployeeToken = require("./verifyEmployeeToken");


// Middleware to check authentication
const authenticateEmployee = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ success:false,message: 'Unauthorized - Missing token' });
    }

    const token = authorizationHeader.slice(7);

    // Verify and decode the token (you need to implement this function)
    console.log(token);
    
    const user = await verifyEmployeeToken(token);
    console.log(user);
    

    if (!user) {
        return res.status(401).json({ success:false,message: 'Unauthorized - Invalid token' });
    }

    // Attach the user to the request for later use
    req.user = user;
    console.log(user)
    next();
};

module.exports = authenticateEmployee;