import * as userService from '../services/user.service.js';
import { sendRes } from '../helpers/responseHelper.js';

export const getUser = async (req, res) => {
	try {
		const response = await userService.getUserById(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while getting user', error });
	}
};

export const getUsers = async (req, res) => {
	try {
		const response = await userService.getAllUsers()
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while getting users', error });
	}
};

export const getTasksByUserId = async (req, res) => {
	try {
		const userId = req.params.id;
		const { categoryId, view, sort, completed } = req.query;
		const response = await userService.getTasksByUserId({ userId, categoryId, view, sort, completed });
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while getting tasks from user', error });
	}
};

export const getCategoriesByUserId = async (req, res) => {
	try {
		const response = await userService.getCategoriesByUserId(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while getting category', error });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const response = await userService.updateProfile(req.params.id, req.body);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while updating profile', error });
	}
};

export const updateSocial = async (req, res) => {
	try {
		const response = await userService.updateSocial(req.params.id, req.body);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while updating social', error });
	}
};

export const updateProfileImg = async (req, res) => {
	try {
		const userId = req.params.id;
		const file = req.files?.file;

		if (!file) {
			return sendRes(res, 400, { msg: 'No image file uploaded' });
		}
		const response = await userService.updateProfileImg(userId, file);
		return res.status(response.statusCode).json(response);
	} catch (err) {
		sendRes(res, 500, { msg: 'Server error while updating profile img', error });
	}
};

export const deleteProfileImg = async (req, res) => {
	try {
		const response = await userService.deleteProfileImg(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while deleting profile img', error });
	}
};

export const updatePassword = async (req, res) => {
	try {
		const response = await userService.updatePassword(req.params.id, req.body);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while updating password', error });
	}
};

export const deleteAccount = async (req, res) => {
	try {
		const response = await userService.deleteAccount(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while deleting account', error });
	}
};

export const updateView = async (req, res) => {
	try {
		const response = await userService.updateView(req.params.id, req.body);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while updating view', error });
	}
};

export const setCategoryActive = async (req, res) => {
	try {
		const response = await userService.setCategoryActive(req.params.id, req.body.categoryId);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while setting category active', error });
	}
};