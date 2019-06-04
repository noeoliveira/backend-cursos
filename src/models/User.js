const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const crypto = require('crypto');

const User = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true
		},
		password: {
			type: String,
			required: true,
			select: false
		},
		teach: {
			type: Boolean,
			default: false
		},

		myCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }],
		course: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }]
	},
	{ timestamps: true }
);

User.pre('save', function(next) {
	if (this.password) {
		const salt = crypto.randomBytes(16).toString('base64');
		const hash = crypto
			.pbkdf2Sync(this.password, salt, 1024, 64, 'sha512')
			.toString('base64');

		this.password = [salt, hash].join('$');
	}
	next();
});

module.exports = mongoose.model('User', User);
