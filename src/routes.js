const express = require('express');
const routes = express.Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const BoxController = require('./controllers/BoxController');
const FileController = require('./controllers/FileController');
const UserController = require('./controllers/UserController');

//Routes Box
routes.post('/boxes', BoxController.store);
routes.get('/boxes/:id?', BoxController.show);

//Routes File
routes.post(
	'/boxes/:id/files',
	multer(multerConfig).single('file'),
	FileController.store
);
routes.get('/boxes/:id/files/:idFile?', FileController.show);

//Routes User
routes.post('/user', UserController.store);
routes.get('/user', UserController.show);

//Ruotes Auth
routes.post('/auth', UserController.auth);

module.exports = routes;
