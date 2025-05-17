import Category from '../models/Category'
import { createResponse } from "../helpers/responseHelper";

export const getCategoriesByUserId = async (userId) => {
	if (!userId) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	};

	try {
		const categories = await Category.find({ user: userId });
		if (!categories) {
			return createResponse({
				success: false,
				msg: 'Categories not found',
				statusCode: 404
			})
		}
		return createResponse({
			data: categories
		});
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while getting categories from user',
			error: err.message.message,
			statusCode: 500
		})
	}
}

export const getCategory = async (categoryId) => {
	if (!categoryId) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	};
	try {
		const category = await Category.findById(categoryId);
		return createResponse({
			data: category
		});
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while getting category',
			error: err.message.message,
			statusCode: 500
		})
	}
}

export const createCategory = async (userId, title) => {
	if (!title) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}

	try {
		const newCategory = new Category({
			title,
			user: userId
		});
		await newCategory.save();

		return createResponse({
			data: newCategory
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while creating category',
			error: err.message,
			statusCode: 500
		})
	}
}

export const editCategory = async (categoryId, title) => {
	if (!categoryId || !title) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}

	try {
		let category = await Category.findByIdAndUpdate(categoryId,
			{ $set: { title } },
			{ new: true }
		);
		if (!category) {
			return createResponse({
				success: false,
				msg: 'Category not found',
				statusCode: 404
			})
		}

		return createResponse({
			data: category
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while editing category',
			error: err.message,
			statusCode: 500
		})
	}
}

export const deleteCategory = async (categoryId) => {
	if (!categoryId) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}

	try {
		const category = await Category.findByIdAndDelete(categoryId);
		if (!category) {
			return createResponse({
				success: false,
				msg: 'Category not found',
				statusCode: 404
			})
		}

		return createResponse({
			data: category
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while deleting category',
			error: err.message,
			statusCode: 500
		})
	}
}