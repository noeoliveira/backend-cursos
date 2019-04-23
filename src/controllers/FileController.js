const Box = require('../models/Box');
const File = require('../models/File');

class FileController {
	async store(req, res) {
		const box = await Box.findById(req.params.id);

		const file = await File.create({
			title: req.file.originalname,
			path: req.file.key
		});

		box.files.push(file);

		await box.save();

		return res.json(file);
	}

	async show(req, res) {
		const box = await Box.findById(req.params.id).populate({
			path: 'files',
			options: { sort: { createdAt: -1 } }
		});
		if (req.params.idFile) {
			box.files.map(file => {
				if (req.params.idFile === file.id) return res.json(file);
			});
		} else {
			return res.json(box.files);
		}
	}
}

module.exports = new FileController();
