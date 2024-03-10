var express = require("express");
const multipart = require("connect-multiparty");
const api = express.Router();
const userController = require('../controllers/user');

const md_upload = multipart({uploadDir: 'uploads/users'});
const auth = require("../middlewares/authenticated");
const md_auth = auth.Auth;

api.get('/users',[md_auth], userController.list);
api.get('/users/image/:image',  userController.getImage);
api.get('/users/me',[md_auth], userController.listById);

api.post('/users', userController.save);
api.post("/users/image/:id", [md_upload], userController.uploadImage);
api.post('/login', userController.login);

api.put('/users/:id', [md_auth], userController.update);

api.delete('/users/:id', [md_auth],userController.delete);
api.delete('/users/image/:id', [md_auth], userController.delImage);

module.exports = api;