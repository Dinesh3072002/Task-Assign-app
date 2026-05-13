const pool = require('./db');

const initDb = async () => {
    try {
        const connection = await pool.getConnection();

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('Manager', 'Employee') DEFAULT 'Employee',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        try {
            await connection.query("ALTER TABLE users ADD COLUMN name VARCHAR(255) NOT NULL AFTER id");
        } catch (e) { }

        try {
            await connection.query("ALTER TABLE users ADD COLUMN role ENUM('Manager', 'Employee') DEFAULT 'Employee'");
        } catch (e) { }

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
            )
        `);

        try {
            await connection.query("ALTER TABLE tasks ADD COLUMN assigned_by INT AFTER user_id");
            await connection.query("ALTER TABLE tasks ADD CONSTRAINT fk_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL");
        } catch (e) {  }

        console.log('Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('Error initializing database:', error.message);
        process.exit(1);
    }
};

module.exports = initDb;
