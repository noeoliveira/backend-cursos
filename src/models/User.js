const crypto = require('crypto');
/*
		myCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }],
		course: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }]
	}*/
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
		{ sequelize }
	);

	User.associate = models => {
		User.hasOne(models.Curso);
		User.belongsToMany(models.Curso, { through: 'UserCurso' });
	};

	return User;
};
