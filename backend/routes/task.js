import express from 'express'
import * as taskController from '../controllers/task.controller.js';
const router = express.Router();

router.get('/tasks/:id', taskController.getTask);


export default router