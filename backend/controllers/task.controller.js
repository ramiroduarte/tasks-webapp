import * as taskService from '../services/task.service.js';
import { sendRes } from '../helpers/responseHelper.js';

export const getTask = async (req, res) => {
	try {
		const response = await taskService.getTask(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while getting a task', error });
	}
};

export const setTask = async (req, res) => {
	try {
		const { userId, title, description, categoryId, dueDate, priority } = req.body;
		const response = await taskService.setTask(userId, { title, description, categoryId, dueDate, priority });
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while setting a task', error });
	}
};

export const setTaskAsCompleted = async (req, res) => {
	try {
		const response = await taskService.setTaskAsCompleted(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while setting a task as completed', error });
	}
};

export const editTask = async (req, res) => {
	try {
		const { title, description, category, dueDate, priority } = req.body;
		const response = await taskService.editTask(req.params.id, { title, description, category, dueDate, priority });
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while editing a task', error });
	}
};

export const deleteTask = async (req, res) => {
	try {
		const response = await taskService.deleteTask(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while deleting a task', error });
	}
};