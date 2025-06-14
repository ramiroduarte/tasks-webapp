import express from 'express';
import api from '../helpers/api.js';
import requireAuth from '../helpers/auth.js';
import passport from 'passport';
const router = express.Router();

router.get('/login', async (req, res) => {
	res.render('user/login', { alerts: [], email: '' });
})

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);
		if (!user) {
			return res.render('user/login', {
				alerts: [{ type: 'warning', msg: 'El correo electrónico y/o la contraseña son incorrectos.' }],
				email: req.body.email || ''
			});
		}
		req.logIn(user, (err) => {
			if (err) return next(err);
			return res.redirect('/tasks');
		});
	})(req, res, next);
});


router.get('/signup', async (req, res) => {
	res.render('user/signup', { alerts: [], username: '', email: '' });
})

router.get('/logout', (req, res, next) => {
	req.logout(function (err) {
		if (err) return next(err);
		req.session.destroy(() => {
			res.redirect('/');
		});
	});
});


export default router;