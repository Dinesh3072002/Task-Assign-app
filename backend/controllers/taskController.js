const pool = require('../config/db');

exports.getTasks = async (req, res) => {
    try {
        let query = '';
        let params = [];

        if (req.user.role === 'Manager') {

            query = `
                SELECT t.*, u.name as employee_name, u.email as employee_email
                FROM tasks t
                LEFT JOIN users u ON t.user_id = u.id
                WHERE t.assigned_by = ?
                ORDER BY t.created_at DESC
            `;
            params = [req.user.id];
        } else {

            query = `
                SELECT t.*, u.name as manager_name, u.email as manager_email
                FROM tasks t
                LEFT JOIN users u ON t.assigned_by = u.id
                WHERE t.user_id = ?
                ORDER BY t.created_at DESC
            `;
            params = [req.user.id];
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('GET_TASKS ERROR:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

exports.createTask = async (req, res) => {
    const { title, employeeId } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Task title cannot be empty' });
    }

    try {
        let targetUserId = req.user.id;
        let assignedBy = null;

        if (req.user.role !== 'Manager') {
            return res.status(403).json({ message: 'Only managers can create tasks' });
        }

        assignedBy = req.user.id;

        if (employeeId) {
            targetUserId = employeeId;
        }

        const [result] = await pool.query(
            'INSERT INTO tasks (user_id, assigned_by, title, status) VALUES (?, ?, ?, ?)',
            [targetUserId, assignedBy, title.trim(), 'Pending']
        );

        const [newTask] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
        res.status(201).json(newTask[0]);
    } catch (error) {
        console.error('CREATE_TASK ERROR:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {

        const [rows] = await pool.query(
            'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (req.user.role !== 'Employee') {
            return res.status(403).json({ message: 'Only employees can complete tasks' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Task not found or not assigned to you' });
        }

        await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
        res.json({ id, status, message: 'Status updated' });
    } catch (error) {
        console.error('UPDATE_STATUS ERROR:', error);
        res.status(500).json({ message: 'Error updating task status' });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'Manager') {
        return res.status(403).json({ message: 'Only managers can delete tasks' });
    }

    try {
        const [result] = await pool.query('DELETE FROM tasks WHERE id = ? AND assigned_by = ?', [id, req.user.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('DELETE_TASK ERROR:', error);
        res.status(500).json({ message: 'Error deleting task' });
    }
};
