const Curso = require('../models/Curso');
const Aula = require('../models/Aula');

class AulaController {
	async store(req, res) {
		const curso = await Curso.findById(req.params.id);
		console.log(req);

		const aula = await Aula.create({
			title: req.file.originalname,
			path: req.file.key
		});

		curso.files.push(aula);

		await curso.save();

		return res.json(aula);
	}

	async show(req, res) {
		const curso = await Curso.findById(req.params.id).populate({
			path: 'files',
			options: { sort: { createdAt: -1 } }
		});
		if (req.params.idFile) {
			curso.files.map(aula => {
				if (req.params.idFile === aula.id) return res.json(aula);
			});
		} else {
			return res.json(curso.files);
		}
	}
}

module.exports = new AulaController();
