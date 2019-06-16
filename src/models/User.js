const crypto = require('crypto');

module.exports = (sequelize, DataType) => {
	const User = sequelize.define(
		'User',
		{
			name: {
				type: DataType.STRING,
				allowNull: false,
				validate: {
					notEmpty: true
				}
			},
			email: {
				type: DataType.STRING,
				allowNull: false,
				unique: true,
				validate: {
					notEmpty: true,
					isEmail: true
				},
				set(email) {
					this.setDataValue('email', email.toString().toLowerCase());
				}
			},
			password: {
				type: DataType.STRING,
				allowNull: false,
				validate: {
					notEmpty: true
				},
				set(password) {
					const salt = crypto.randomBytes(16).toString('base64');
					const hash = crypto
						.pbkdf2Sync(password, salt, 1024, 64, 'sha512')
						.toString('base64');

					this.setDataValue('password', [salt, hash].join('$'));
				}
			},
			teach: {
				type: DataType.BOOLEAN,
				defaultValue: false
			}
		},
		{
			defaultScope: {
				attributes: { exclude: ['password', 'UserCurso'] }
			},
			scopes: {
				password: {
					attributes: {}
				}
			}
		}
	);

	User.associate = models => {
		User.hasMany(models.Curso, { as: 'Curso' });
		User.belongsToMany(models.Curso, {
			as: 'meusCursos',
			through: 'UserCurso'
		});
	};

	return User;
};
