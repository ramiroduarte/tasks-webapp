import Category from '../models/Category'
import { createRes } from "../helpers/responseHelper";

export const getCategory = async (categoryId) => {
	if (!categoryId) {
		return createRes(400, { msg: 'Missing parameters' })
	};
	try {
		const category = await Category.findById(categoryId);
		return createRes(200, { data: category });
	} catch (error) {
		return createRes(500, { msg: 'Server error while getting category', error })
	}
}

export const createCategory = async (userId, title) => {
	if (!title) {
		return createRes(400, { msg: 'Missing parameters' })
	}

	try {
		const newCategory = new Category({
			title,
			user: userId
		});
		await newCategory.save();

		return createRes(200, { data: newCategory });
	} catch (error) {
		return createRes(500, { msg: 'Server error while creating category', error })
	}
}

export const editCategory = async (categoryId, title) => {
	if (!categoryId || !title) {
		return createRes(400, { msg: 'Missing parameters' })
	}

	try {
		let category = await Category.findByIdAndUpdate(categoryId,
			{ $set: { title } },
			{ new: true }
		);
		if (!category) {
			return createRes(404, { msg: 'Category not found' })
		}

		return createRes(200, { data: category })
	} catch (error) {
		return createRes(500, { msg: 'Server error while editing category', error })
	}
}

export const deleteCategory = async (categoryId) => {
	if (!categoryId) {
		return createRes(400, { msg: 'Missing parameters' })
	}

	try {
		const category = await Category.findByIdAndDelete(categoryId);
		if (!category) {
			return createRes(404, { msg: 'Category not found' })
		}

		return createRes(200, { data: category })
	} catch (error) {
		return createRes(500, { msg: 'Server error while deleting category', error })
	}
}