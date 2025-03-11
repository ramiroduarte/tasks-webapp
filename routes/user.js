import express from 'express';
import User from '../models/User.js';
import passport from 'passport';
import { isAuthenticated } from '../helpers/auth.js';
const router = express.Router();


router.get('/login', (req, res) => {
const errorMessage = req.flash('error');                                    //Error when the user login (ex: the user doesn't exist or the passwords don't match)
    const alerts = [];
    if(errorMessage.length > 0){
        alerts.push({ type: 'warning', msg: errorMessage[0]});
    }
    res.render('user/login', { alerts })
})

router.get('/signup', (req, res) => {
    res.render('user/signup', { alerts: [], username: '', email: '' });
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err) return next();
        res.redirect('/')
    });
})

router.get('/profile', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.render('user/profile', { alerts: [], user });
})

//------------------------------------------
//------------------ API -------------------
router.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body
    const emailUser = await User.findOne({ email: email});
    if(emailUser){
        const alerts = [];
        alerts.push({ type: 'warning', msg: 'El correo electrónico ya se encuentra en uso.'})
        res.render('user/signup', { alerts, username, email });
    }else{
        const newUser = new User({ username, email, password });
        await newUser.encryptPassword(password)
        await newUser.save();
        req.flash('success_msg', '¡Fuite registrado correctamente!')
        res.redirect('/login');
    }
})


router.post('/login', passport.authenticate('local', {                  //Passport config is in 'config/passport.js'
    successRedirect: '/tasks',                                          //If all goes well, I redirect here
    failureRedirect: '/login',                                          //If occur some error, I redirect here
    failureFlash: true                                                  //To send flash alerts
}))

export default router