import express from 'express';
import api from '../helpers/api.js';
import requireAuth from '../helpers/auth.js';
const router = express.Router();

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

router.put('/settings/profile', requireAuth, async (req, res) => {
	const userId = req.user._id;

	try {
		const { data: user } = await api.get(`/api/users/${userId}`);
		const { data } = await api.put(`/api/users/${userId}/profile`, {
			username: req.body.username,
			email: user.data.email,
			state: req.body.state,
			location: req.body.location
		});
		if (!data.success) throw new Error(data);

		req.flash('success_msg', '¡Se han guardado los cambios correctamente');
		res.redirect('/settings');
	} catch (error) {
		res.render('error', {
			msg: 'No se pudo editar el apartado perfil de la configuración del usuario',
			error: error.response?.data || error.message
		})
	}
})

router.put('/settings/account', requireAuth, async (req, res) => {
	const userId = req.user._id;

	try {
		const { data: user } = await api.get(`/api/users/${userId}`);

		//Edit only email
		const { data: email } = await api.put(`/api/users/${userId}/profile`, {
			username: user.data.username,
			email: req.body.email,
			state: user.state,
			location: user.location
		});
		if (!email.success) throw new Error(email);

		//Edit only password
		const { data: password } = await api.put(`/api/users/${userId}/password`, {
			oldPassword: req.body.passwordOld,
			newPassword: req.body.passwordNew
		});
		if (!password.success) throw new Error(password);

		req.flash('success_msg', '¡Se han guardado los cambios correctamente');
		res.redirect('/settings');
	} catch (error) {
		res.render('error', {
			msg: 'No se pudo editar el apartado cuenta de la configuración del usuario',
			error: error.response?.data || error.message
		})
	}
})


router.put('/settings/social', requireAuth, async (req, res) => {
	const userId = req.user._id;

	try {
		const { data } = await api.put(`/api/users/${userId}/social`, {
			instagram: req.body.instagram,
			facebook: req.body.facebook,
			twitter: req.body.twitter,
			linkedin: req.body.linkedin,
			github: req.body.github,
			website: req.body.website
		});
		if (!data.success) throw new Error(data);

		req.flash('success_msg', '¡Se han guardado los cambios correctamente');
		res.redirect('/settings');
	} catch (error) {
		res.render('error', {
			msg: 'No se pudo editar el apartado redes sociales de la configuración del usuario',
			error: error.response?.data || error.message
		})
	}
})

export default router;
