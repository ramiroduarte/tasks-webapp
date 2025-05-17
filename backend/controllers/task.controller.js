import * as taskService from '../services/task.service.js';

export const getTasksByUserId = async (req, res) => {
	try {
		const { userId, categoryId, view, sort, completed } = req.query;
		if (!userId) {
			return res.status(400).json({ success: false, msg: 'Missing parameters: userId' });
		}
		const response = await taskService.getTasksByUserId({ userId, categoryId, view, sort, completed });
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ msg: 'Server eror while getting tasks from user', error })
	}
}

export const getTask = async (req, res) => {
	try {
		const response = await taskService.getTask(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error', error });
	}
}

