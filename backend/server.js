const express = require('express');
const cors = require('cors');
require('dotenv').config();
const initDb = require('./config/initDb');

const app = express();

app.use(cors());
app.use(express.json());

initDb();

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
