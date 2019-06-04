const User = require('../models/User');
const Box = require('../models/Curso');
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
		if (!user.teach) user.myCourse = undefined;

		const token = genereteToken({ id: user.id });

		return res.json({ user, token });
	}

	async show(req, res) {
		const { userId, token } = req;
		const user = await User.findOne({ _id: userId })
			.populate({
				path: 'myCourse',
				options: { sort: { createdAt: -1 } }
			})
			.populate({
				path: 'course',
				options: { sort: { createdAt: -1 } }
			});

		if (!user.teach) user.myCourse = undefined;

		return res.json({ user, token });
	}

	async update(req, res) {
		const { name, email, password, teach } = req.body;
		const user = await User.findOne({ _id: req.userId }).select('+password');

		if (name) user.name = name;
		if (email) user.email = email;
		if (password) user.password = password;
		if (teach) user.teach = teach;

		await user.save();

		user.password = undefined;
		return res.json(user);
	}

	async auth(req, res) {
		const { email, password } = req.body;

		const user = await User.findOne({ email }).select('+password');

		if (!user || !verifyHash(password, user.password))
			return res.json({ error: 'Email and Password do not match' });

		user.password = undefined;
		if (!user.teach) user.myCourse = undefined;

		const token = genereteToken({ id: user.id });

		return res.json({ user, token });
	}

	async save(req, res) {
		const { teach, boxId } = req.body;
		const user = await User.findOne({ _id: req.userId });
		//const box = await Box.findOne({ _id: boxId });

		if (teach && user.teach) {
			user.myCourse.push(boxId);
		} else if (teach && !user.teach) {
			return res.json({ error: 'User not teach' });
		} else {
			user.course.push(boxId);
		}
		console.log(user);

		await user.save();
		return res.json(user);
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
