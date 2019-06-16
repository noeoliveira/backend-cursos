const { Aula, Curso } = require('../services/database').models;

class AulaController {
	async store(req, res) {
		const aula = await Aula.create({
			title: req.file.originalname,
			path: req.file.key,
			CursoId: req.params.id
		});

		const curso = await Curso.findOne({
			where: { id: req.params.id },
			include: [{ model: Aula, as: 'Aulas' }]
		});

		return res.json(curso);
	}

	async show(req, res) {
		const curso = await Curso.findOne({
			where: { id: req.params.id },
			include: [{ model: Aula, as: 'Aulas' }]
		});

		req.params.idFile = parseInt(req.params.idFile);
		if (req.params.idFile) {
			curso.Aulas.find(aula => {
				if (req.params.idFile === aula.id) {
					return res.json(aula);
				}
			});
		} else {
			return res.json(curso.Aulas);
		}
	}
}

module.exports = new AulaController();
