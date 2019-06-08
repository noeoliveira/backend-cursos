const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const db = require('./services/database');

app.use(cors());

app.use(require('./Middlewares/Auth'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes'));
app.use('/files', express.static(path.resolve(__dirname, '../temp')));

app.listen(process.env.PORT || 3333);
