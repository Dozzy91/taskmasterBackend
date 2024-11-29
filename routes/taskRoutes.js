const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const { getTasks, createTask, updateTask, deleteTask, orderByPriority, orderByDate, filterByPriority, filterByDate, search } = require('../controllers/taskController');

const router = express.Router();


router.get('/', authMiddleware, getTasks);
router.get('/priority', authMiddleware, orderByPriority);
router.get('/date', authMiddleware, orderByDate);
router.post('/search', authMiddleware, search);
router.post('/filter-by-priority', authMiddleware, filterByPriority);
router.post('/filter-by-date', authMiddleware, filterByDate);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;
