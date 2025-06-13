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

router.get('/profile', requireAuth, async (req, res) => {
	const userId = req.user._id;
	try {
		const { data: user } = await api.get(`/api/users/${userId}`);
		const { data: categories } = await api.get(`/api/users/${userId}/categories`);

		if (!user.success) throw new Error(user);
		if (!categories.success) throw new Error(categories);
		res.render('user/profile', { alerts: [], user: user.data, TotalTasksCount: categories.data.TotalTasksCount, TotalTasksCompletedCount: categories.data.TotalTasksCompletedCount });
	} catch (error) {
		res.render('error', {
			msg: 'No se pudo mostrar el perfil',
			error: error.response?.data || error.message
		});
	}
})

router.get('/settings', requireAuth, async (req, res) => {
	const userId = req.user._id;

	try {
		const { data: user } = await api.get(`/api/users/${userId}`);
		if (!user.success) throw new Error(user);

		res.render('user/settings', { alerts: [], user: user.data });
	} catch (error) {
		res.render('error', {
			msg: 'No se pudo mostrar la configuración del usuario',
			error: error.response?.data || error.message
		})
	}
})

export default router;
