const pool = require('../db/index');
const dayjs = require('dayjs');

const getTasks = async (req, res) => {
    try {
        const result = await pool.query(`SELECT 
            id,
            task,
            description,
            priority,
            completed,
            TO_CHAR(created_at, 'Mon DD, YYYY HH12:MI AM') AS created_at,
            TO_CHAR(due_date, 'Mon DD, YYYY HH12:MI AM') AS due_date,
            user_id
            FROM tasks WHERE user_id = $1 ORDER BY id DESC`, [req.user.id]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    const { task, description, priority, completed, due_date } = req.body;

    const isoDate = new Date(due_date).toISOString();

    try {
        if (!task) {
            return res.status(400).json({ message: 'Task is required' });
        } else if (!priority) {
            return res.status(400).json({ message: 'Priority is required' });
        } else if (!due_date) {
            return res.status(400).json({ message: 'Due date is required' });
        }

        const result = await pool.query(
            'INSERT INTO tasks (task, description, priority, completed, due_date, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [task, description, priority, completed || false, isoDate, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { task, description, priority, completed, due_date } = req.body;

    try {
        const result = await pool.query(
            'UPDATE tasks SET task = $1, description = $2, priority = $3, completed = $4, due_date = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
            [task, description, priority, completed, due_date, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const orderByPriority = async (req, res) => {
    try {
        const result = await pool.query(`SELECT 
            id,
            task,
            description,
            priority,
            completed,
            TO_CHAR(created_at, 'Mon DD, YYYY HH12:MI AM') AS created_at,
            TO_CHAR(due_date, 'Mon DD, YYYY HH12:MI AM') AS due_date,
            user_id
            FROM tasks WHERE user_id = $1 ORDER by priority DESC `, [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No record found matching the filter parameter' });
        }
        res.status(200).json(result.rows);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const orderByDate = async (req, res) => {
    try {
        const result = await pool.query(`SELECT 
            id,
            task,
            description,
            priority,
            completed,
            TO_CHAR(created_at, 'Mon DD, YYYY HH12:MI AM') AS created_at,
            TO_CHAR(due_date, 'Mon DD, YYYY HH12:MI AM') AS due_date,
            user_id
            FROM tasks WHERE user_id = $1 ORDER by due_date DESC `, [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No record found matching the filter parameter' });
        }
        res.status(200).json(result.rows);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const filterByDate = async (req, res) => {
    const { due_date } = req.body;
    const due_date_key = [`%${due_date}%`];
    try {
        const result = await pool.query(`SELECT 
            id,
            task,
            description,
            priority,
            completed,
            TO_CHAR(created_at, 'Mon DD, YYYY HH12:MI AM') AS created_at,
            TO_CHAR(due_date, 'Mon DD, YYYY HH12:MI AM') AS due_date,
            user_id
            FROM tasks WHERE user_id = $1 AND (due_date::text ILIKE $2) ORDER by id DESC `, [req.user.id, due_date_key[0]]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No correlation' });
        }
        res.status(200).json(result.rows);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const filterByPriority = async (req, res) => {
    const { priority} = req.body;
    const priority_key = `%${priority}%`;
    try {
        const result = await pool.query(`SELECT 
            id,
            task,
            description,
            priority,
            completed,
            TO_CHAR(created_at, 'Mon DD, YYYY HH12:MI AM') AS created_at,
            TO_CHAR(due_date, 'Mon DD, YYYY HH12:MI AM') AS due_date,
            user_id
            FROM tasks WHERE user_id = $1 AND (priority::text ILIKE $2) ORDER by id DESC `, [req.user.id, priority_key]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No correlation' });
        }
        res.status(200).json(result.rows);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const search = async (req, res) => {
    const { keyword } = req.body;
    const key = [`%${keyword}%`];

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        const result = await pool.query(`SELECT 
            id,
            task,
            description,
            priority,
            completed,
            TO_CHAR(created_at, 'Mon DD, YYYY HH12:MI AM') AS created_at,
            TO_CHAR(due_date, 'Mon DD, YYYY HH12:MI AM') AS due_date,
            user_id
            FROM tasks WHERE user_id = $1 AND (task ILIKE $2 OR description ILIKE $2) ORDER by id DESC `, [req.user.id, key[0]]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No results founds' });
        }
        res.status(200).json(result.rows);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { getTasks, createTask, updateTask, deleteTask, orderByPriority, orderByDate, filterByPriority, filterByDate, search }