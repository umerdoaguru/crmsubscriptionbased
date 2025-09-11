const JWT = require("jsonwebtoken");
const { db } = require("../db");
const dotenv = require("dotenv");
dotenv.config();

const verifyAdminToken = async (token) => {
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        
        
        // Check if the user exists in the database
        const query = 'SELECT * FROM admins  WHERE  admin_id = ?';
        const params = [decoded.id];
        console.log(params);
        

        return new Promise((resolve, reject) => {
            db.query(query, params, (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                    return;
                }

                if (!results || results.length === 0) {
                    console.error('Admin not found in the database');
                    resolve(null);
                    return;
                }

                const admin = results[0]; // Assuming admin data is in the first row
                // The admin object contains the admin information
                resolve(admin);
            });
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }

   
};

module.exports = verifyAdminToken;