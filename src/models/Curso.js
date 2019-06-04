const mongoose = require('mongoose');
const Curso = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Aula' }]
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Curso', Curso);
