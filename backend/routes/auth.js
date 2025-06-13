import express from 'express'
import * as authController from '../controllers/auth.controller.js'
import { isAuthenticated } from '../helpers/auth.js';
const router = express.Router();

router.get('/auth/verify', isAuthenticated, (req, res) => {
	res.json({ authenticated: true, user: req.user });
});
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

export default router