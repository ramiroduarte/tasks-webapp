import express from 'express';
import api from '../helpers/api.js';
import requireAuth from '../helpers/auth.js';
const router = express.Router();

router.get('/categories/edit', requireAuth, async (req, res) => {
	try {
		const { data } = await api.get(`/api/users/${req.user._id}/categories`);
		if (!data.success) throw new Error(categories);
		res.render('tasks/editCategories', { alerts: [], categories: data.data.categories });
	} catch (error) {
		res.render('error', {
			msg: 'No se pudo editar las categorias.',
			error: error.response?.data || error.message
		});
	}
})

router.post('/categories', requireAuth, async (req, res) => {
	try {
		const { data } = await api.post('/api/categories', {
			title: req.body.categoryName,
			userId: req.user._id
		})
		if (!data.success) throw new Error(data);
		res.redirect('/categories/edit')
	} catch (error) {
		req.flash('danger_msg', 'Ha ocurrido un error al momento de editar la categoria.');
		res.redirect('/tasks')
	}
})

export default router;