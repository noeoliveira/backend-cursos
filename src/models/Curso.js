module.exports = (sequelize, DataType) => {
	const Curso = sequelize.define('Curso', {
		title: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	});

	Curso.associate = models => {
		Curso.hasMany(models.Aula, { as: 'Aulas' });
	};

	return Curso;
};
