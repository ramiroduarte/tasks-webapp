import express from 'express';
import axios from 'axios';
import { isAuthenticated } from '../helpers/auth.js';
const router = express.Router();

router.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/tasks');
	} else {
		res.render('main/index', { alerts: [] })
	}
});

router.get('/tasks', isAuthenticated, async (req, res) => {
	const response = await axios.get('/api/tasks');
	const { tasks, user, categories } = response.data;

	// Aquí podrías renderizar la página o trabajar con los datos obtenidos
	res.render('tasks/index', { alerts: [], tasks, user, categories });
});

router.get('/login', async (req, res) => {
	const errorMessage = req.flash('error');                                    //Error when the user login (ex: the user doesn't exist or the passwords don't match)
    const alerts = [];
    if(errorMessage.length > 0){
        alerts.push({ type: 'warning', msg: errorMessage[0]});
    }
    res.render('user/login', { alerts })
})

router.get('/signup', (req, res) => {
    const alerts = req.session.alert ? [req.session.alert] : [];
	req.session.alert = null;
	if (alerts && alerts[0]?.flash) {
		console.log('TEST');
		req.flash(alerts[0].type, alerts[0].msg)
		res.render('user/signup', { alerts: [], username: '', email: '' })
	} else {
		res.render('user/signup', { alerts, username: '', email: '' });
	}
})

export default router;