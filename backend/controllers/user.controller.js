import * as userService from '../services/user.service.js';
import * as taskService from '../services/task.service.js';

export const getUser = async (req, res) => {
	try {
		const response = await userService.getUserById(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ msg: 'Server error while getting user', error });
	}
};

export const getUsers = async (req, res) => {
	try {
		const response = await userService.getAllUsers()
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ msg: 'Server error while getting users', error });
	}
}

export const getTasksByUserId = async (req, res) => {
	try {
		const response = await taskService.getTasksByUserId(req.params.id, req.query.categoryId, req.query.view, req.query.sort, req.query.completed);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ msg: 'Server eror while getting tasks from user', error })
	}
}