import express from 'express';
import api from '../helpers/api.js';
import requireAuth from '../helpers/auth.js';
const router = express.Router();

router.get('/tasks', requireAuth, async (req, res) => {
	const userId = req.user._id;

	try {
		if (req.query.category) {
			const { data: categoryActive } = await api.patch(`/api/users/${userId}/categoryActive`, { categoryId: req.query.category })
			if (!categoryActive.success) throw new Error(categoryActive);
		}
		if (req.query.view && req.query.sort) {
			const { data: newView } = await api.put(`/api/users/${userId}/view`, { name: req.query.view, sort: req.query.sort })
			if (!newView.success) throw new Error(newView);
		}
		const { data: user } = await api.get(`/api/users/${userId}`);
		const { data: tasks } = await api.get(`/api/users/${userId}/tasks?categoryId=${user.data.categoryActive}&view=${user.data.view.name}&sort=${user.data.view.sort}&completed=true`);
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
			title: req.body.taskTitle,
			description: req.body.taskDescription,
			categoryId: req.body.taskCategory,
			dueDate: req.body.taskDueDate,
			priority: req.body.taskPriority,
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


router.patch('/tasks/:taskId', requireAuth, async (req, res) => {
	try {
		const { data } = await api.patch(`/api/tasks/${req.params.taskId}/completed`);
		if (!data.success) throw new Error(data);
		res.redirect('/');
	} catch (err) {
		req.flash('danger_msg', 'Ha ocurrido un error al momento de completar la tarea.');
		res.redirect('/tasks')
	}
})

router.put('/tasks/:taskId', requireAuth, async (req, res) => {
	try {
		const { data } = await api.put(`/api/tasks/${req.params.taskId}`, {
			title: req.body.taskTitle,
			description: req.body.taskDescription,
			category: req.body.taskCategory,
			dueDate: req.body.taskDueDate,
			priority: req.body.taskPriority
		});
		if (!data.success) throw new Error(data);
		res.redirect('/');
	} catch (err) {
		req.flash('danger_msg', 'Ha ocurrido un error al momento de editar la tarea.');
		res.redirect('/tasks')
	}
})


router.delete('/tasks/:taskId', requireAuth, async (req, res) => {
	try {
		const { data } = await api.delete(`/api/tasks/${req.params.taskId}`)
		if (!data.success) throw new Error(data);
		res.redirect('/')
	} catch (err) {
		req.flash('danger_msg', 'Ha ocurrido un error al momento de eliminar la tarea.');
		res.redirect('/tasks')
	}
})




export default router;