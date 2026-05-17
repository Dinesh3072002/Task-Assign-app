const express = require('express');
const cors = require('cors');
require('dotenv').config();
const initDb = require('./config/initDb');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start server safely
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        console.log("DB_HOST:", process.env.DB_HOST);

        // Try DB connection (but don't crash app)
        await initDb().catch(err => {
            console.error("❌ DB Connection Failed:", err.message);
        });

        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Server Error:", error.message);
    }
};

startServer();

// Global error handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);

    res.status(500).json({
        message: 'Internal Server Error'
    });
});
