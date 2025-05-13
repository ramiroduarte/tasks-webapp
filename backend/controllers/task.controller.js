import * as userService from '../services/user.service.js';

export const getTask = async (req, res) => {
	try {
		const response = await userService.getTask(req.params);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error', error });
	}
}