import express from 'express'
import * as authController from '../controllers/auth.controller'
const router = express.Router();

router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

export default router