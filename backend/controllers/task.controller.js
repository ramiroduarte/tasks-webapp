import * as taskService from '../services/task.service.js';

export const getTasksByUserId = async (req, res) => {
	try {
		const { userId, categoryId, view, sort, completed } = req.query;
		const response = await taskService.getTasksByUserId({ userId, categoryId, view, sort, completed });
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ msg: 'Server eror while getting tasks from user', error })
	}
};

export const getTask = async (req, res) => {
	try {
		const response = await taskService.getTask(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error', error });
	}
};

export const setTask = async (req, res) => {
	try {
		const { title, description, categoryId, dueDate, priority } = req.body;
		const response = await taskService.getTask(req.params.id, { title, description, categoryId, dueDate, priority });
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error', error });
	}
};

export const setTaskAsCompleted = async (req, res) => {
	try {
		const response = await taskService.getTask(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error', error });
	}
};

export const editTask = async (req, res) => {
	try {
		const { title, description, category, dueDate, priority } = req.body;
		const response = await taskService.editTask(req.params.id, { title, description, category, dueDate, priority });
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error', error });
	}
};

export const deleteTask = async (req, res) => {
	try {
		const response = await taskService.deleteTask(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error', error });
	}
};