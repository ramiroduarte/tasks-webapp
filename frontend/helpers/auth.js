export default function requireAuth(req, res, next) {
	if (req.isAuthenticated && req.isAuthenticated()) {
		return next();
	}
	if (req.user) {
		return next();
	}
	return res.redirect('/login');
}