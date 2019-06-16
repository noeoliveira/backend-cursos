const { Curso, Aula } = require('../services/database').models;

class CursoController {
	async store(req, res) {
		const { userId: UserId } = req;
		const curso = await Curso.create({ title: req.body.title, UserId });

		return res.json(curso);
	}

	async show(req, res) {
		let curso;
		const { id } = req.params;

		if (req.params.id) {
			curso = await Curso.findOne({
				where: { id },
				include: [
					{
						model: Aula,
						as: 'Aulas',
						attributes: {
							exclude: ['url', 'path', 'createdAt', 'updatedAt', 'CursoId']
						}
					}
				]
			});
		} else {
			curso = await Curso.findAll({
				include: [
					{
						model: Aula,
						as: 'Aulas',
						attributes: {
							exclude: ['url', 'path', 'createdAt', 'updatedAt', 'CursoId']
						}
					}
				]
			});
		}

		return res.json(curso);
	}
}

module.exports = new CursoController();
