import * as authService from '../services/auth.service.js';

export const login = (req, res, next) => {																//I didn't get it so much :)
	passport.authenticate('local', (error, user, info) => {
		if (error) return res.status(500).json({ success: false, msg: 'Server error while logging.', error });					//If occur a internal error like db error
		if (!user) return resolve({ success: false, msg: info.message });				//If dont find a valid user

		req.login(user, (error) => {																							//Log the user
			if (error) return res.status(500).json({ success: false, msg: 'Server error while saving session' });

			res.statusCode(200).json({ success: true, data: user });
		});
	})(req, res, next);
};

export const logout = (req, res) => {
	req.logout((error) => {
		if (error) return res.status(500).json({ success: false, msg: 'Server error while logging out', error });
		res.status(200).json({ success: true });
	});
};

export const signup = async (req, res) => {
	try {
		const result = await authService.signup(req.body);
		res.status(result.statusCode).json(result);
	} catch (error) {
		res.status(500).json({ success: false, msg: 'Server error while signing up', error });
	}
};