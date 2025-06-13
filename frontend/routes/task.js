import express from 'express';
import api from '../helpers/api.js';
import requireAuth from '../helpers/auth.js';
const router = express.Router();

router.get('/tasks', requireAuth, async (req, res) => {
	const userId = req.user._id;

	try {
		const { data: user } = await api.get(`/api/users/${userId}`);
		const { data: tasks } = await api.get(`/api/users/${userId}/tasks`);
		const { data: categories } = await api.get(`/api/users/${userId}/categories`);
		if (!user.success) throw new Error(user);
		if (!tasks.success) throw new Error(tasks);
		if (!categories.success) throw new Error(categories);

		res.render('tasks/index', { alerts: [], tasks: tasks.data, user: user.data, categories: categories.data.categories });
	} catch (error) {
		res.render('error', {
			msg: 'No se pudieron cargar las tareas del usuario',
			error: error.response?.data || error.message
		});
	}
});

router.post('/tasks', requireAuth, async (req, res) => {
	try {
		const { data } = await api.post('/api/tasks', {
			...req.body,
			userId: req.user._id
		});
		if (!data.success) throw new Error(data);
		res.redirect('/tasks');
	} catch (error) {
		req.flash('danger_msg', 'Ha ocurrido un error al momento de crear la tarea.');
		res.redirect('/tasks')
	}
})



router.get('/tasks/edit/:id', requireAuth, async (req, res) => {
	try {
		const { data: task } = await api.get(`/api/tasks/${req.params.id}`);
		if (!task.success) throw new Error(task);

		res.render('tasks/edit', { alerts: [], task: task.data });
	} catch (error) {
		res.render('error', {
			msg: 'No se pudo editar la tarea.',
			error: error.response?.data || error.message
		});
	}
})


router.get('/categories/edit', requireAuth, async (req, res) => {
	try {
		const { data: categories } = await api.get(`/api/users/${req.params.id}/categories`);
		if (!categories.success) throw new Error(categories);

		res.render('tasks/editCategories', { alerts: [], categories: categories.data });
	} catch (error) {
		res.render('error', {
			msg: 'No se pudo editar las categorias.',
			error: error.response?.data || error.message
		});
	}
})

export default router;