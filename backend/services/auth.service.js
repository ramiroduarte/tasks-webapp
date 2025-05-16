import passport from 'passport'
import { createResponse } from '../helpers/responseHelper.js';
import User from '../models/User.js'
import Category from '../models/Category.js';

export const signup = async ({ username, email, password, location, state, profileImg, social, view }) => {
	if (!username || !email || !password) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}
	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
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