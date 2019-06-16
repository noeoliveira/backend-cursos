const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const configDB = require('../config/db.json');

const loadModels = sequelize => {
	const dir = path.join(__dirname, '../models');
	const models = {};
	fs.readdirSync(dir).forEach(file => {
		const model = sequelize.import(path.join(dir, file));
		models[model.name] = model;
	});
	Object.keys(models).forEach(model => {
		if (models[model].associate) {
			models[model].associate(models);
		}
		if (models[model].get) {
			models[model].get();
		}
	});
	return sequelize.models;
};

let database = null;

if (!database) {
	const sequelize = new Sequelize(
		configDB.database,
		configDB.user,
		configDB.password,
		{
			host: configDB.server,
			dialect: configDB.dialect
		}
	);

	database = { sequelize, Sequelize, models: {} };
	database.models = loadModels(sequelize);

	sequelize.sync().then(() => console.log('\nConected database'));
}

module.exports = database;
