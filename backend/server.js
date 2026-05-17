const express = require('express');
const cors = require('cors');
require('dotenv').config();
const initDb = require('./config/initDb');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start Server (IMPORTANT FIX)
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Wait for DB connection
        await initDb();

        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1); // stop app if DB fails
    }
};

startServer();