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

        console.log("✅ MySQL Connected");

        // Create tables if not exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255),
                completed BOOLEAN DEFAULT false,
                user_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        connection.release();

    } catch (err) {
        console.error("❌ DB Error:", err.message);
        throw err;
    }
};

// export pool for usage
const getPool = () => {
    if (!pool) {
        throw new Error("Database not initialized");
    }
    return pool;
};

module.exports = initDb;
module.exports.getPool = getPool;