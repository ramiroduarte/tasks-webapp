import passport from 'passport';                                                //Module for saving  the user's session, allowing them to navigate through different routes
import { Strategy as LocalStrategy } from 'passport-local';                     //passport-local is used to create a local session, A non-local session would be logging in with Google, Facebook, etc. In CommonJs, it is: 'const LocalStrategy = require('passport-local').Strategy;'
import User from '../models/User.js';

passport.use(new LocalStrategy({                                                //passport.use() is used to register a built-in strategy. In this case, it is LocalStrategy, which handles authentication with email and password. There are others for authentication with Google, Facebook, etc.
    usernameField: 'email'                                                      //'email' specifies that the username for authentication will be the email input instead of the default username input
}, async (email, password, done) => {                                           //done() is a callback
    const user = await User.findOne({ email: email });
    if (!user) {
        return done(null, false, { message: 'El correo electrónico no se encuentra registrado.' })    //Syntax: done(error, user, info) (the error is a local error) | if there isn't error=>null - user is the user object in the DB, it can be false if the authentication fails.
    } else {
        const match = await user.matchPassword(password);                       //Use the method declared in 'models/User.js' to check if two hashed passwords match
        if (match) {
            return done(null, user)
        } else {
            return done(null, false, { message: 'La contraseña es incorrecta.' })
        }
    }
}))


passport.serializeUser((user, done) => {                                        //Serialization is when passport keeps only the user's identifier, not the entire user object
    done(null, user.id)                                                         //It tells passport which data (unique identifier) to store from the user for the session. Instead of storing the entire user object, which could be very large, passport keeps only the user's identifier
})


passport.deserializeUser(async (id, done) => {                                  //Deserialization is when passport (the reverse of serialization) retrieves the entire user object from the user's identifier
    try {
        const user = await User.findById(id);
        done(null, user);                                                       //If a user is found, the error parameter will be null, and the user parameter will contain the user object retrieved from the DB
    } catch (err) {
        done(err);                                                        //If an error occurred (ex: user not found), it returns the error in the first parameter (err) and null in the second because the user was not retrieved
    }
})