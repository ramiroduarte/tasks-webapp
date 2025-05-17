import * as userService from '../services/user.service.js';

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
};

export const updateProfile = async (req, res) => {
	try {
		const response = await userService.updateProfile(req.params.id, req.body);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ msg: 'Server error while updating profile', error });
	}
};

export const updateSocial = async (req, res) => {
	try {
		const response = await userService.updateSocial(req.params.id, req.body);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ msg: 'Server error while updating social', error });
	}
};

//Falta este controller
export const updateProfileImg = async (req, res) => {
	//...
};

export const deleteProfileImg = async (req, res) => {
	try {
		const response = await userService.deleteProfileImg(req.params.id)
	} catch (error) {
		res.status(500).json({ msg: 'Server error while deleting profile img', error });
	}
};

export const updatePassword = async (req, res) => {
	try {
		const response = await userService.updatePassword(req.params.id, req.body);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ msg: 'Server error while updating password', error });
	}
};

export const deleteAccount = async (req, res) => {
	try {
		const response = await userService.deleteAccount(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ msg: 'Server error while deleting account', error });
	}
};

export const updateView = async (req, res) => {
	try {
		const response = await userService.updateView(req.params.id, req.body);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ msg: 'Server error while updating view', error });
	}
};

export const setCategoryActive = async (req, res) => {
	try {
		const { categoryId } = req.body;
		if (!categoryId) {
			return res.status(400).json({ success: false, msg: 'Missing parameters: categoryId' });
		}
		const response = await userService.setCategoryActive(req.params.id, categoryId);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ msg: 'Server error while setting category active', error });
	}
};