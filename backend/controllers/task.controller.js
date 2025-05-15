import * as taskService from '../services/task.service.js';

export const getTask = async (req, res) => {
	try {
		const response = await taskService.getTask(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error', error });
	}
}