import categoryService from '../services/category.service.js'
import { sendRes } from '../helpers/responseHelper.js';

export const getCategory = async (req, res) => {
	try {
		const response = await categoryService.getCategory(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while getting category', error });
	}
};

export const createCategory = async (req, res) => {
	try {
		const { userId, title } = req.body;
		const response = await categoryService.createCategory(userId, title);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while creating category', error });
	}
};

export const editCategory = async (req, res) => {
	try {
		const { title } = req.query;
		if (!title) {
			return sendRes(res, 400, { msg: 'Missing queries: title' });
		}
		const response = await categoryService.editCategory(req.params.id, title);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while editing category', error })
	}
};

export const deleteCategory = async (req, res) => {
	try {
		const response = await categoryService.deleteCategory(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while deleting category', error });
	}
};