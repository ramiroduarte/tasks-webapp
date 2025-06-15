import { createRes } from '../helpers/responseHelper.js';
import User from '../models/User.js'
import Category from '../models/Category.js';

export const signup = async ({ username, email, password, location, state, profileImg, social, view }) => {
	if (!username || !email || !password) {
		return createRes(400, { msg: 'Missing parameters' })
	}
	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return createRes(400, { msg: 'User is already signup' })
		} else {
			const newUser = new User({ username, email, password, location, state, profileImg, social, view });
			await newUser.encryptPassword(password);
			await newUser.save();
			const mainCategory = new Category({ user: newUser._id });
			await mainCategory.save();
			await User.findByIdAndUpdate(newUser._id, {
				$set: { categoryActive: mainCategory._id }
			})
			return createRes(201, { msg: 'User was sign up successfully', data: newUser })
		}
	} catch (error) {
		return createRes(500, { msg: 'Server error while signing up', error })
	}
};