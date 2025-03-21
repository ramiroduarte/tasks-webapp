import express from 'express';
import fileUpload from 'express-fileupload';
import passport from 'passport';
import fs from 'fs-extra';
import { isAuthenticated } from '../helpers/auth.js';
import { uploadImage, deleteImage } from '../helpers/cloudinary.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
const router = express.Router();




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
router.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body
    const emailUser = await User.findOne({ email: email});
    if(emailUser){
        req.session.alert = {
            flash: false,
            type: 'warning',
            msg: 'El correo electrónico ya se encuentra en uso.'
        };
        return res.status(400).json(req.session.alert);
    }else{
        const newUser = new User({ username, email, password });
        await newUser.encryptPassword(password)
        await newUser.save();
        const mainCategory = new Category({ title: 'Principal', user: newUser._id });
        await mainCategory.save();
        await User.findByIdAndUpdate(newUser._id, {
            $set: { "categoryActive": mainCategory._id }
        })
        req.session.alert = {
            flash: true,
            type: 'success',
            msg: '¡Fuiste registrado correctamente!'
        };
        return res.status(200).json(req.session.alert);
    }
})


router.post('/login', passport.authenticate('local', {                  //Passport config is in 'config/passport.js'
    successRedirect: '/tasks',                                          //If all goes well, I redirect here
    failureRedirect: '/login',                                          //If occur some error, I redirect here
    failureFlash: true                                                  //To send flash alerts
}))


router.post('/profileImg', isAuthenticated, fileUpload({
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


router.delete('/profileImg', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id)
    await deleteImage(user.profileImg.public_id);
    await User.findByIdAndUpdate(req.user.id, {
        $set: {
            'profileImg.public_id': '',
            'profileImg.imgURL': ''
        }
    })
    res.redirect('/settings');
})

router.put('/settings/profile', isAuthenticated, async (req, res) => {
    const { username, location, state } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
        $set: {
            username,
            location,
            state
        }
    })
    req.flash('success_msg', '¡Se han guardado los cambios correctamente!')
    res.redirect('/settings');
})

router.put('/settings/account', isAuthenticated, async (req, res) => {
    const { email, passwordOld, passwordNew, passwordNewRepeated } = req.body;
    const isPasswordCompleted = passwordOld || passwordNew || passwordNewRepeated;
    const user = await User.findById(req.user.id)
    const emailUser = await User.findOne({ email });
    if (emailUser && emailUser.id !== user.id) {
        req.flash('danger_msg', '¡El correo ya se encuentra en uso!');
        res.redirect('/settings');
    } else {
        if (isPasswordCompleted) {
            const isMatch = await user.matchPassword(passwordOld);
            if (!isMatch) {
                req.flash('danger_msg', '¡La contraseña actual es incorrecta!');
                res.redirect('/settings');
            } else {
                const userUpdated = await User.findByIdAndUpdate(req.user.id, {
                    $set: {
                        'email': email,
                        'password': passwordNew
                    }
                })
                await userUpdated.encryptPassword(passwordNew);
                req.flash('success_msg', '¡Se han guardado los cambios correctamente!');
                res.redirect('/settings');
            }
        } else {
            await User.findByIdAndUpdate(req.user.id, {
                $set: {
                    'email': email
                }
            });
            req.flash('success_msg', '¡Se han guardado los cambios correctamente!');
            res.redirect('/settings');
        }

    }
})

router.put('/settings/social', isAuthenticated, async (req, res) => {
    const { facebook, instagram, twitter, linkedin, github, website } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
        $set: {
            'social.facebook': facebook,
            'social.instagram': instagram,
            'social.twitter': twitter,
            'social.linkedin': linkedin,
            'social.github': github,
            'social.website': website
        }
    })
    req.flash('success_msg', '¡Se han guardado los cambios correctamente!');
    res.redirect('/settings');
})
export default router