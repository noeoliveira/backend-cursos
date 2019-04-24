const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/auth');

module.exports = (req, res, next) => {
	const { authorization } = req.headers;
	console.log(req);

	if ('/user' === req.originalUrl || '/auth' === req.originalUrl) return next();

	if (!authorization)
		return res.status(401).json({ error: 'No token provided' });

	const parts = authorization.split(' ');

	if (parts.length !== 2)
		return res.status(401).json({ error: 'Parameters token invalid' });

	const [scheme, token] = parts;
	if (!/^Bearer$/i.test(scheme))
		return res.status(401).json({ error: 'Mal formatado' });
	jwt.verify(token, jwtConfig.secret, (error, decoded) => {
		if (error) return res.status(401).json(error);

		req.userId = decoded.id;
	});
	return next();
};
