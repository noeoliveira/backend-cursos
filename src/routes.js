const express = require('express');
const routes = express.Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const CursoController = require('./controllers/CursoController');
const AulaController = require('./controllers/AulaController');
const UserController = require('./controllers/UserController');

//Routes Curso
routes.post('/cursos', CursoController.store);
routes.get('/cursos/:id?', CursoController.show);

//Routes Aula
routes.post(
	'/cursos/:id/aulas',
	multer(multerConfig).single('file'),
	AulaController.store
);
routes.get('/cursos/:id/aulas/:idFile?', AulaController.show);

//Routes User
routes.post('/user', UserController.store);
routes.get('/user', UserController.show);
routes.put('/user', UserController.update);
routes.post('/save', UserController.save);

//Ruotes Auth
routes.post('/auth', UserController.auth);

module.exports = routes;
