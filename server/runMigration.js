const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        process.exit(1);
    } else {
        console.log("Connected to database!");
        runMigration();
    }
});

function runMigration() {
    const migrationPath = path.join(__dirname, 'migrations', 'add_registered_data_table.sql');
    
    fs.readFile(migrationPath, 'utf8', (err, sql) => {
        if (err) {
            console.error("Error reading migration file:", err);
            db.end();
            process.exit(1);
        }

        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error running migration:", err);
            } else {
                console.log("Migration completed successfully!");
                console.log("registered_data table is now ready for OAuth integration.");
            }
            
            db.end();
            process.exit(0);
        });
    });
}
