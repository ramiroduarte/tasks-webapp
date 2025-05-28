import * as authService from '../services/auth.service.js';
import { createRes, sendRes } from '../helpers/responseHelper.js';

export const login = (req, res, next) => {																//I didn't get it so much :)
	passport.authenticate('local', (error, user, info) => {
		if (error) return sendRes(res, 500, { msg: 'Server error while logging.', error });						//If occur a internal error like db error
		if (!user) return resolve(createRes(500, { msg: info.message }));				//If dont find a valid user

		req.login(user, (error) => {																							//Log the user
			if (error) return sendRes(res, 500, { msg: 'Server error while saving session' })

			sendRes(res, 200, { data: user });
		});
	})(req, res, next);
};

export const logout = (req, res) => {
	req.logout((error) => {
		if (error) return sendRes(res, 500, { msg: 'Server error while logging out', error });
		sendRes(res, 200, { msg: 'Logging out was successful' });
	});
};

export const signup = async (req, res) => {
	try {
		const response = await authService.signup(req.body);
		res.status(response.statusCode).json(response);
	} catch (error) {
		sendRes(res, 500, { msg: 'Server error while signing up', error });
	}
};