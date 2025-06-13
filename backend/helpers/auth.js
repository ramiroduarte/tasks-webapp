import User from '../models/User.js';

export const isAuthenticated = async (req, res, next) => {                  //Create a middleware to verify if the user is authenticated, this is used to determine if they can access different routes
    if (process.env.TEST_USER) {                                            //If there is a testing user
        req.user = await User.findById(process.env.TEST_USER);
        return next();
    }
    if (req.isAuthenticated()) {                                          //Use the passport method to know if the user is authenticated
        return next();                                                  //If it's authenticated, the middleware allows passing to the next middleware (if there is) or the next route
    }
    return res.status(401).json({ authenticated: false, msg: 'No authenticated' });
};