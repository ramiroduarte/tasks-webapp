export const isAuthenticated = (req, res, next) => {                    //Create a middleware to verify if the user is authenticated, this is used to determine if they can access different routes
    if(req.isAuthenticated()){                                          //Use the passport method to know if the user is authenticated
        return next();                                                  //If it's authenticated, the middleware allows passing to the next middleware (if there is) or the next route
    } else {
        req.flash('danger_msg', 'No has iniciado sesión.');
        res.redirect('/login');
    }
};

// This is for testing, it helps me avoid logging in every time
// import User from '../models/User.js';

// export const isAuthenticated = async (req, res, next) => {
//     const testUserId = '67b7d985a9101d351acea9dc';
//     req.user = await User.findById(testUserId);
//     return next();
// };