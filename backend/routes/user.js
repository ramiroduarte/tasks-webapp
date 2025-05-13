import express from 'express';
import * as userController from '../controllers/user.controller.js';
const router = express.Router();

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUser)
router.get('/users/:id/tasks', userController.getTasksByUserId)

export default router;