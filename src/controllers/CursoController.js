const Curso = require('../models/Curso');

class CursoController {
	async store(req, res) {
		const curso = await Curso.create({ title: req.body.title });
		return res.json(curso);
	}

	async show(req, res) {
		let curso;

		if (req.params.id) {
			curso = await Curso.findById(req.params.id).populate({
				path: 'files',
				options: { sort: { createdAt: -1 } }
			});
		} else {
			curso = await Curso.find({}).populate({
				path: 'files',
				options: { sort: { createdAt: -1 } }
			});
		}

		return res.json(curso);
	}
}

module.exports = new CursoController();
