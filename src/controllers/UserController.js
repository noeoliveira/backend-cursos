const { User, Curso } = require('../services/database').models;

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/auth');

class UserController {
	async store(req, res) {
		const { name, email, password } = req.body;
		const user = await User.create({
			name,
			email,
			password
		}).catch(error => error);

		if (user.errors) return res.json({ message: user.errors[0].message });
		user.dataValues.password = undefined;

		const token = genereteToken({ id: user.id });

		return res.json({ user, token });
	}

	async show(req, res) {
		const { userId, token } = req;
		const user = await User.findOne({
			where: { id: userId },
			include: [{ all: true }]
		});

		if (user.errors) return res.json({ message: user.errors[0].message });

		if (!user.dataValues.teach || !user.dataValues.Curso)
			user.dataValues.Curso = undefined;

		return res.json({ user, token });
	}

	async update(req, res) {
		const user = await User.findOne({ where: { id: req.userId } });

		await user.update(req.body);

		user.dataValues.password = undefined;
		return res.json(user);
	}

	async auth(req, res) {
		const { email, password } = req.body;

		const user = await User.scope('password').findOne({ where: { email } });

		if (!user || !verifyHash(password, user.dataValues.password))
			return res.json({ error: 'Email and Password do not match' });

		user.dataValues.password = undefined;
		//if (!user.teach) user.myCourse = undefined;

		const token = genereteToken({ id: user.id });

		return res.json({ user, token });
	}

	async save(req, res) {
		const { cursoId: CursoId } = req.body;
		let user = await User.findOne({
			where: { id: req.userId },
			include: [
				{ model: Curso, as: 'Curso' },
				{ model: Curso, as: 'meusCursos', through: { attributes: [] } }
			]
		});

		if (await user.hasMeusCursos(parseInt(CursoId))) {
			return res.json({ message: 'Já possui esse curso' });
		}

		const novo = await user.addMeusCursos(CursoId);
		user.meusCursos.push(novo[0]);

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
