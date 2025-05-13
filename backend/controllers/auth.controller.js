import * as userService from '../services/user.service.js';

export const login = async (req, res) => {
	try {
		const result = await userService.loginUser(req, res);
		if (!result.success) {
			return res.status(401).json(result);
		}
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({ success: false, msg: 'Server error while logging in', error: err.message });
	}
};

export const logout = async (req, res) => {
	try {
		const result = await userService.logoutUser(req);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({ success: false, msg: 'Server error while logging out', error: err.message });
	}
};