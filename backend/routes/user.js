import express from 'express';
import * as userController from '../controllers/user.controller.js';
const router = express.Router();

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUser);
router.get('/users/:id/tasks', userController.getTasksByUserId);
router.get('/users/:id/categories', userController.getCategoriesByUserId);


router.put('/users/:id/profile', userController.updateProfile);
router.put('/users/:id/social', userController.updateSocial);
router.put('/users/:id/password', userController.updatePassword);
router.delete('/users/:id', userController.deleteAccount);
router.put('/users/:id/view', userController.updateView);
router.patch('/users/:id/categoryActive', userController.setCategoryActive);

export default router;