const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

app.use(cors());

mongoose.connect(
	'mongodb+srv://rwfile:rwfile@drivefile-loeda.mongodb.net/Files?retryWrites=true',
	{ useNewUrlParser: true, autoReconnect: true }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes'));
app.use('/files', express.static(path.resolve(__dirname, '../temp')));

app.listen(process.env.PORT || 3333);
