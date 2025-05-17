import fs from 'fs-extra';
import { uploadImage, deleteImage } from '../helpers/cloudinary.js';
import { createResponse } from '../helpers/responseHelper.js';
import User from '../models/User.js'
import Category from '../models/Category.js';

export const getUserById = async (userId) => {
	if (!userId) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}

	try {
		const user = await User.findById(userId, '-password');
		if (!user) {
			return createResponse({
				success: false,
				msg: 'User not found',
				statusCode: 404
			})
		}

		return createResponse({
			data: user
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while getting user',
			error: err.message,
			statusCode: 500
		})
	}
};

export const getUserByEmail = async (email) => {
	if (!email) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}

	try {
		const user = await User.findOne({ email }, '-password');
		if (!user) {
			return createResponse({
				success: false,
				msg: 'User not found',
				statusCode: 404
			})
		}

		return createResponse({
			data: user
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while getting user',
			error: err.message,
			statusCode: 500
		})
	}
};

export const getAllUsers = async () => {
	try {
		const users = await User.find({}, '-password');
		return createResponse({
			data: users
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while getting all users',
			error: err.message,
			statusCode: 500
		})
	}
};

export const signup = async (username, { email, password, location, state, profileImg, social, view }) => {
	if (!username || !email || !password) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}
	try {
		const emailUser = await User.findOne({ email });
		if (emailUser) {
			return createResponse({
				success: false,
				msg: 'User is already signup',
				statusCode: 400
			})
		} else {
			const newUser = new User({ username, email, password, location, state, profileImg, social, view });
			await newUser.encryptPassword(password);
			await newUser.save();
			const mainCategory = new Category({ title: 'Principal', user: newUser._id });
			await mainCategory.save();
			await User.findByIdAndUpdate(newUser._id, {
				$set: { categoryActive: mainCategory._id }
			})
			return createResponse({
				data: newUser
			})
		}
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while signing up',
			error: err.message,
			statusCode: 500
		})
	}
};

export const updateProfile = async (userId, { username, email, state, location }) => {
	if (!userId || !username || !email || !state || !location) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}
	try {
		const user = await User.findByIdAndUpdate(userId,
			{ $set: { username, email, state, location } },
			{ new: true }
		);
		if (!user) {
			return createResponse({
				success: false,
				msg: 'User not found',
				statusCode: 404
			})
		} else {
			return createResponse({
				data: user
			})
		}
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while updating user',
			error: err.message,
			statusCode: 500
		})
	}
};

export const updateSocial = async (userId, { instagram, facebook, twitter, linkedin, github, website }) => {
	if (!userId || !instagram || !facebook || !twitter || !linkedin || !github || !website) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}
	try {
		const user = await User.findByIdAndUpdate(userId,
			{ $set: { 'social.instagram': instagram, 'social.facebook': facebook, 'social.twitter': twitter, 'social.linkedin': linkedin, 'social.github': github, 'social.website': website } },
			{ new: true }
		);
		if (!user) {
			return createResponse({
				success: false,
				msg: 'User not found',
				statusCode: 404
			})
		}

		return createResponse({
			data: user
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while updating social',
			error: err.message,
			statusCode: 500
		})
	}
};

export const updateProfileImg = async (userId, url) => {
	if (!userId || !url) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}
	try {
		let user = await User.findById(userId);
		if (!user) {
			return createResponse({
				success: false,
				msg: 'User not found',
				statusCode: 404
			})
		}
		if (user.profileImg.imgURL) {
			await deleteImage(user.profileImg.public_id);
		}
		const result = await uploadImage(file.tempFilePath, 'profile');
		await fs.unlink(file.tempFilePath);
		user = await User.findByIdAndUpdate(userId,
			{ $set: { profileImg: { public_id: result.public_id, url: result.secure_url } } },
			{ new: true }
		);

		return createResponse({
			data: user
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while updating profile image',
			error: err.message,
			statusCode: 500
		})
	}
};

export const deleteProfileImg = async (userId) => {
	if (!userId) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}
	try {
		let user = await User.findById(userId);
		if (!user) {
			return createResponse({
				success: false,
				msg: 'User not found',
				statusCode: 404
			})
		}
		if (user.profileImg.imgURL) {
			await deleteImage(user.profileImg.public_id);
		}
		user = await User.findByIdAndUpdate(userId,
			{ $set: { profileImg: { public_id: '', imgURL: '' } } },
			{ new: true }
		);
		return createResponse({
			data: user
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while deleting profile image',
			error: err.message,
			statusCode: 500
		})
	}
};

export const updatePassword = async (userId, { oldPassword, newPassword }) => {
	if (!userId || !oldPassword || !newPassword) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}
	try {
		let user = await User.findById(userId);
		if (!user) {
			return createResponse({
				success: false,
				msg: 'User not found',
				statusCode: 404
			})
		}
		const isMatch = await user.matchPassword(oldPassword);
		if (!isMatch) {
			return createResponse({
				success: false,
				msg: 'Old password is incorrect',
				statusCode: 400
			})
		} else {
			user = await User.findByIdAndUpdate(userId,
				{ $set: { password: newPassword } },
				{ new: true }
			);
			await user.encryptPassword(newPassword);

			return createResponse({
				data: user
			})
		}
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while setting password',
			error: err.message,
			statusCode: 500
		})
	}
};

export const deleteAccount = async (userId) => {
	if (!userId) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}
	try {
		const user = await User.findByIdAndDelete(userId);
		if (!user) {
			return createResponse({
				success: false,
				msg: 'User not found',
				statusCode: 404
			})
		}
		if (user.profileImg.imgURL) {
			await deleteImage(user.profileImg.public_id);
		}
		return createResponse({
			data: user
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while deleting account',
			error: err.message,
			statusCode: 500
		})
	}
};

export const updateView = async (userId, { name, sort }) => {
	if (!userId || !name || !sort) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}
	try {
		const user = await User.findByIdAndUpdate(userId,
			{ $set: { 'view.name': name, 'view.sort': sort } },
			{ new: true }
		);
		if (!user) {
			return createResponse({
				success: false,
				msg: 'User not found',
				statusCode: 404
			})
		}

		return createResponse({
			data: user
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while updating user',
			error: err.message,
			statusCode: 500
		})
	}
};

export const setCategoryActive = async (userId, categoryId) => {
	if (!userId || !categoryId) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}
	try {
		const user = await User.findById(userId);
		if (!user) {
			return createResponse({
				success: false,
				msg: 'User not found',
				statusCode: 404
			})
		}
		const category = await Category.findById(categoryId);
		if (!category) {
			return createResponse({
				success: false,
				msg: 'Category not found',
				statusCode: 404
			})
		}
		const updatedUser = await User.findByIdAndUpdate(userId,
			{ $set: { categoryActive: categoryId } },
			{ new: true }
		);

		return createResponse({
			data: updatedUser
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while updating user',
			error: err.message,
			statusCode: 500
		})
	}
};