var express = require("express");
const multipart = require("connect-multiparty");
const api = express.Router();
const md_auth = require('../middlewares/authenticated');
const auth = md_auth.Auth;

const md_upload = multipart({uploadDir: 'uploads/albums'});
const albumController = require('../controllers/album');

api.get('/albums', [auth], albumController.list);
api.get('/albums/:id', [auth], albumController.listById);
api.get('/albums/image/:image', albumController.getImage);
api.post('/albums', [auth], albumController.save);
api.post('/albums/image/:id', [md_upload], albumController.uploadImage);
api.put('/albums/:id', [auth], albumController.update);

module.exports = api;