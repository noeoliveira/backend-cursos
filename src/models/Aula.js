const mongoose = require('mongoose');
const Aula = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		path: {
			type: String,
			required: true
		}
	},
	{ timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

Aula.virtual('url').get(function() {
	const url = process.env.URL || 'http://localhost:3333';
	return `${url}/files/${encodeURIComponent(this.path)}`;
});
module.exports = mongoose.model('Aula', Aula);
