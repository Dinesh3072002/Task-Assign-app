const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    getEmployees
} = require('../controllers/authController');

// AUTH ROUTES
router.post('/signup', signup);
router.post('/login', login);

// optional
router.get('/employees', getEmployees);

module.exports = router;
