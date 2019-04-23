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
		list: {
			myCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Box' }],
			course: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Box' }]
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', User);
