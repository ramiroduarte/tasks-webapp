import categoryService from '../services/category.service.js'

export const getCategory = async (req, res) => {
	try {
		const response = await categoryService.getCategory(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error while getting category' });
	}
};

export const createCategory = async (req, res) => {
	try {
		const { userId, title } = req.body;
		const response = await categoryService.createCategory(userId, title);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error while creating category' });
	}
};

export const getCategoriesByUserId = async (req, res) => {
	try {
		if (!req.query.userId) {
			return res.status(400).json({ success: false, msg: 'Missing query: userId' });
		}
		const response = await categoryService.getCategory(req.query.userId);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error while getting category' });
	}
};

export const editCategory = async (req, res) => {
	try {
		const { title } = req.query;
		if (!title) {
			return res.status(400).json({ success: false, msg: 'Missing queries: title' })
		}
		const response = await categoryService.editCategory(req.params.id, title);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error while editing category' });
	}
};

export const deleteCategory = async (req, res) => {
	try {
		const response = await categoryService.deleteCategory(req.params.id);
		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error while deleting category' });
	}
};