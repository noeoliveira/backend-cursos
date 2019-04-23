const User = require('../models/User');

class UserController {
	async store(req, res) {
		const { name, email, password } = req.body;
		const user = await User.create({ name, email, password }).catch(err =>
			res.json(err)
		);

		res.json(user);
	}
}

module.exports = new UserController();
