import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/tasks');
  } else {
    res.render('main/index', { alerts: [] });
  }
});

export default router;
