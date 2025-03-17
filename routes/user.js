import express from 'express';
import fileUpload from 'express-fileupload';
import passport from 'passport';
import fs from 'fs-extra';
import { isAuthenticated } from '../helpers/auth.js';
import { uploadImage, deleteImage } from '../helpers/cloudinary.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
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
    const categories = await Category.find({ user: req.user.id })
    let TotalTasksCount = 0, TotalTasksCompletedCount = 0;
    categories.forEach((elem) => {
        TotalTasksCount += elem.tasksCount;
        TotalTasksCompletedCount += elem.tasksCompletedCount
    })
    res.render('user/profile', { alerts: [], user, TotalTasksCount, TotalTasksCompletedCount });
})

router.get('/settings', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.render('user/settings', { alerts: [], user })
})

//------------------------------------------
//------------------ API -------------------
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body
    const emailUser = await User.findOne({ email: email});
    if(emailUser){
        const alerts = [];
        alerts.push({ type: 'warning', msg: 'El correo electrónico ya se encuentra en uso.'})
        res.render('user/signup', { alerts, username, email });
    }else{
        const newUser = new User({ username, email, password });
        await newUser.encryptPassword(password)
        await newUser.save();
        const mainCategory = new Category({ title: 'Principal', user: newUser._id });
        await mainCategory.save();
        await User.findByIdAndUpdate(newUser._id, {
            $set: { "categoryActive": mainCategory._id }
        })
        req.flash('success_msg', '¡Fuite registrado correctamente!')
        res.redirect('/login');
    }
})


router.post('/login', passport.authenticate('local', {                  //Passport config is in 'config/passport.js'
    successRedirect: '/tasks',                                          //If all goes well, I redirect here
    failureRedirect: '/login',                                          //If occur some error, I redirect here
    failureFlash: true                                                  //To send flash alerts
}))


router.post('/imgProfile', isAuthenticated, fileUpload({
    useTempFiles: true,
    tempFileDir: './tempUploads'
}), async (req, res) => {
    if (req.files?.image) {
        const result = await uploadImage('profileImg', req.files.image.tempFilePath)
        await User.findByIdAndUpdate(req.user.id, {
            $set: { 
                'profileImg.public_id': result.public_id,
                'profileImg.imgURL': result.secure_url
            }
        })
        await fs.unlink(req.files.image.tempFilePath)
    }
    res.redirect('/settings');
})


router.delete('/imgProfile/:id', isAuthenticated, async (req, res) => {
    const result = await deleteImage(req.params.id)
    console.log(result)
    await User.findByIdAndUpdate(req.user.id, {
        $set: {
            'profileImg.public_id': '',
            'profileImg.imgURL': ''
        }
    })
    res.redirect('/settings');
})

export default router