const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/auth');

class UserController {
	async store(req, res) {
		const { name, email, password } = req.body;
		const user = await User.create({ name, email, password }).catch(
			error => error
		);
		user.password = undefined;

		const token = genereteToken({ id: user.id });

		return res.json({ user, token });
	}

	async show(req, res) {
		const { userId } = req;
		const user = await User.findOne({ userId });
		return res.json(user);
	}

	async auth(req, res) {
		const { email, password } = req.body;

		const user = await User.findOne({ email }).select('+password');

		if (!user || !verifyHash(password, user.password))
			return res.json({ error: 'Email and Password do not match' });

		user.password = undefined;

		const token = genereteToken({ id: user.id });

		return res.json({ user, token });
	}
}

function verifyHash(password, passwordEncrypted) {
	const originalHash = passwordEncrypted.split('$')[1];
	const salt = passwordEncrypted.split('$')[0];
	const hash = crypto
		.pbkdf2Sync(password, salt, 1024, 64, 'sha512')
		.toString('base64');

	return hash === originalHash;
}

function genereteToken(params = {}) {
	return jwt.sign(params, jwtConfig.secret, {
		expiresIn: '1w'
	});
}

module.exports = new UserController();
