import fs from 'fs-extra';
import { uploadImage, deleteImage } from '../helpers/cloudinary.js';
import { createRes } from '../helpers/responseHelper.js';
import User from '../models/User.js'
import Task from '../models/Task.js'
import Category from '../models/Category.js';

export const getUserById = async (userId) => {
	if (!userId) return createRes(400, { msg: 'Missing parameters' })

	try {
		const user = await User.findById(userId, '-password');
		if (!user) return createRes(404, { msg: 'User not found' })

		return createRes(200, { data: user })
	} catch (error) {
		return createRes(500, { msg: 'Server error while getting user', error });
	}
};

export const getTasksByUserId = async ({ userId, categoryId, view, sort, completed }) => {
	if (!userId) return createRes(400, { msg: 'Missing parameters' })

	const query = { user: userId };
	if (categoryId) query.category = categoryId;
	if (completed) query.completed = completed === 'true';

	const allowedViews = ['creationDate', 'dueDate', 'priority'];
	const sortField = allowedViews.includes(view) ? view : 'creationDate';
	const sortOrder = sort === 'asc' ? 1 : -1;

	try {
		let tasks = await Task.find({ ...query, completed: false }).sort({ [sortField]: sortOrder });
		const completedTasks = await Task.find({ ...query, completed: true }).sort({ [sortField]: sortOrder });
		return createRes(200, { data: tasks.concat(completedTasks) });
	} catch (error) {
		return createRes(500, { msg: 'Server error while getting task from user', error });
	}
};

export const getCategoriesByUserId = async (userId) => {
	if (!userId) return createRes(400, { msg: 'Missing parameters: userId' })

	try {
		const categories = await Category.find({ user: userId });
		if (!categories) {
			return createRes(404, { msg: 'Categories not found' })
		}
		let TotalTasksCompletedCount = 0;
		let TotalTasksCount = 0;
		categories.forEach(elem => {
			TotalTasksCompletedCount += elem.tasksCompletedCount;
			TotalTasksCount += elem.tasksCount;
		});

		return createRes(200, { data: { categories, TotalTasksCount, TotalTasksCompletedCount } });
	} catch (error) {
		return createRes(500, { msg: 'Server error while getting categories from user', error: error.message })
	}
};

export const getUserByEmail = async (email) => {
	if (!email) return createRes(400, { msg: 'Missing parameters' })

	try {
		const user = await User.findOne({ email }, '-password');
		if (!user) return createRes(404, { msg: 'User not found' })

		return createRes(200, { data: user })
	} catch (error) {
		return createRes(500, { msg: 'Server error while getting user', error })
	}
};

export const getAllUsers = async () => {
	try {
		const users = await User.find({}, '-password');
		return createRes(200, { data: users })
	} catch (error) {
		return createRes(500, { msg: 'Server error while getting all users', error })
	}
};

export const signup = async (username, { email, password, location, state, profileImg, social, view }) => {
	if (!username || !email || !password) return createRes(400, { msg: 'Missing parameters' })

	try {
		const emailUser = await User.findOne({ email });
		if (emailUser) {
			return createRes(400, { msg: 'User is already signup' })
		} else {
			const newUser = new User({ username, email, password, location, state, profileImg, social, view });
			await newUser.encryptPassword(password);
			await newUser.save();
			const mainCategory = new Category({ title: 'Principal', user: newUser._id });
			await mainCategory.save();
			await User.findByIdAndUpdate(newUser._id, {
				$set: { categoryActive: mainCategory._id }
			})
			return createRes(200, { data: newUser })
		}
	} catch (error) {
		return createRes(500, { msg: 'Server error while signing up', error })
	}
};

export const updateProfile = async (userId, { username, email, state, location }) => {
	console.log('test', userId, username, email)
	if (!userId || !username || !email) return createRes(400, { msg: 'Missing parameterssss' })

	try {
		const user = await User.findByIdAndUpdate(userId,
			{ $set: { username, email, state, location } },
			{ new: true }
		);
		if (!user) return createRes(404, { msg: 'User not found' })
		else return createRes(200, { data: user })
	} catch (error) {
		return createRes(500, { msg: 'Server error while updating user', error })
	}
};

export const updateSocial = async (userId, { instagram, facebook, twitter, linkedin, github, website }) => {
	if (!userId || (!instagram && !facebook && !twitter && !linkedin && !github && !website)) {
		return createRes(400, { msg: 'Missing parameters' })
	}
	try {
		const user = await User.findByIdAndUpdate(userId,
			{ $set: { 'social.instagram': instagram, 'social.facebook': facebook, 'social.twitter': twitter, 'social.linkedin': linkedin, 'social.github': github, 'social.website': website } },
			{ new: true }
		);
		if (!user) {
			return createRes(404, { msg: 'User not found' })
		}

		return createRes(200, { data: user })
	} catch (error) {
		return createRes(500, { msg: 'Server error while updating social', error })
	}
};

export const updateProfileImg = async (userId, imgURL) => {
	if (!userId || !imgURL) {
		return createRes(400, { msg: 'Missing parameters' })
	}
	try {
		let user = await User.findById(userId);
		if (!user) {
			return createRes(404, { msg: 'User not found' })
		}
		if (user.profileImg.imgURL) {
			await deleteImage(user.profileImg.public_id);
		}
		const result = await uploadImage(file.tempFilePath, 'profile');
		await fs.unlink(file.tempFilePath);
		user = await User.findByIdAndUpdate(userId,
			{ $set: { profileImg: { public_id: result.public_id, imgURL: result.secure_url } } },
			{ new: true }
		);

		return createRes(200, { data: user })
	} catch (error) {
		return createRes(500, { msg: 'Server error while updating profile image', error })
	}
};

export const deleteProfileImg = async (userId) => {
	if (!userId) {
		return createRes(400, { msg: 'Missing parameters' })
	}
	try {
		let user = await User.findById(userId);
		if (!user) {
			return createRes(404, { msg: 'User not found' })
		}
		if (user.profileImg.imgURL) {
			await deleteImage(user.profileImg.public_id);
		}
		user = await User.findByIdAndUpdate(userId,
			{ $set: { profileImg: { public_id: '', imgURL: '' } } },
			{ new: true }
		);
		return createRes(200, { data: user })
	} catch (error) {
		return createRes(500, { msg: 'Server error while deleting profile image', error })
	}
};

export const updatePassword = async (userId, { oldPassword, newPassword }) => {
	if (!userId || !oldPassword || !newPassword) {
		return createRes(400, { msg: 'Missing parameters' })
	}
	try {
		let user = await User.findById(userId);
		if (!user) {
			return createRes(404, { msg: 'User not found' })
		}
		const isMatch = await user.matchPassword(oldPassword);
		if (!isMatch) {
			return createRes(400, { msg: 'Old password is incorrect' })
		} else {
			user = await User.findByIdAndUpdate(userId,
				{ $set: { password: newPassword } },
				{ new: true }
			);
			await user.encryptPassword(newPassword);

			return createRes(200, { data: user })
		}
	} catch (error) {
		return createRes(500, { msg: 'Server error while setting password', error })
	}
};

export const deleteAccount = async (userId) => {
	if (!userId) {
		return createRes(400, { msg: 'Missing parameters' })
	}
	try {
		const user = await User.findByIdAndDelete(userId);
		if (!user) {
			return createRes(404, { msg: 'User not found' })
		}
		if (user.profileImg.imgURL) {
			await deleteImage(user.profileImg.public_id);
		}
		return createRes(200, { data: user })
	} catch (error) {
		return createRes(500, { msg: 'Server error while deleting account', error })
	}
};

export const updateView = async (userId, { name, sort }) => {
	if (!userId || !name || !sort) {
		return createRes(400, { msg: 'Missing parameters' })
	}
	try {
		const user = await User.findByIdAndUpdate(userId,
			{ $set: { 'view.name': name, 'view.sort': sort } },
			{ new: true }
		);
		if (!user) {
			return createRes(404, { msg: 'User not found' });
		}

		return createRes(200, { data: user })
	} catch (error) {
		return createRes(500, { msg: 'Server error while updating user', error })
	}
};

export const setCategoryActive = async (userId, categoryId) => {
	if (!userId || !categoryId) {
		return createRes(400, { msg: 'Missing parameters' })
	}
	try {
		const user = await User.findById(userId);
		if (!user) {
			return createRes(404, { msg: 'User not found' });
		}
		const category = await Category.findById(categoryId);
		if (!category) {
			return createRes(404, { msg: 'Category not found' })
		}
		const updatedUser = await User.findByIdAndUpdate(userId,
			{ $set: { categoryActive: categoryId } },
			{ new: true }
		);

		return createRes(200, { data: updatedUser })
	} catch (error) {
		return createRes(500, { msg: 'Server error while updating user', error })
	}
};