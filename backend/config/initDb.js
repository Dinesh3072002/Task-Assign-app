const mysql = require('mysql2/promise');

let pool;

const initDb = async () => {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
        });

        const connection = await pool.getConnection();

        console.log("✅ MySQL Connected via initDb");

        // Create Users Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('Manager', 'Employee') DEFAULT 'Employee',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);

        // Create Tasks Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                assigned_by INT,
                title VARCHAR(255) NOT NULL,
                status ENUM('Pending', 'Completed') DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
            ) ENGINE=InnoDB
        `);

        connection.release();
        return pool;

    } catch (err) {
        console.error("❌ DB Initialization Error:", err.message);
        throw err;
    }
};

const getPool = () => {
    if (!pool) {
        throw new Error("Database not initialized");
    }
    return pool;
};

module.exports = initDb;
module.exports.getPool = getPool;