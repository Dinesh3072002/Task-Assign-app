const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTasks, createTask, updateStatus, deleteTask } = require('../controllers/taskController');

router.use(auth);

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteTask);

module.exports = router;
