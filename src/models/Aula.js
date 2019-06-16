module.exports = (sequelize, DataType) => {
	const Aula = sequelize.define(
		'Aula',
		{
			title: {
				type: DataType.STRING,
				allowNull: false,
				validate: {
					notEmpty: true
				}
			},
			path: {
				type: DataType.TEXT,
				allowNull: false,
				validate: {
					notEmpty: true
				}
			}
		},
		{
			getterMethods: {
				url: function() {
					const url = process.env.URL || 'http://localhost:3333';
					return `${url}/files/${encodeURIComponent(this.path)}`;
				}
			}
		}
	);
	return Aula;
};
