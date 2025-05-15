import express from 'express';
import * as userController from '../controllers/user.controller.js';
const router = express.Router();

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUser)
router.get('/users/:id/tasks', userController.getTasksByUserId)

router.put('/users/:id/profile', userController.updateProfile)
router.put('/users/:id/social', userController.updateSocial)
router.put('/users/:id/profileImg', userController.updateProfileImg)
router.delete('/users/:id/profileImg', userController.deleteProfileImg)
router.put('/users/:id/password', userController.updatePassword)
router.delete('/users/:id', userController.deleteAccount)
router.put('/users/:id/view', userController.updateView)

export default router;