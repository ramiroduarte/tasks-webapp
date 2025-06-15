import express from 'express'
import * as taskController from '../controllers/task.controller.js';
const router = express.Router();

router.get('/tasks/:id', taskController.getTask);

router.post('/tasks', taskController.setTask);
router.put('/tasks/:id', taskController.editTask);
router.patch('/tasks/:id/completed', taskController.setTaskAsCompleted);
router.delete('/tasks/:id', taskController.deleteTask);

export default router