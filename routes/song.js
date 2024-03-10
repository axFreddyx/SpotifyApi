var express = require("express");
const api = express.Router();
const multipart = require("connect-multiparty");
const songController = require('../controllers/song');
const md_upload = multipart({uploadDir: 'uploads/songs'});
const auth = require('../middlewares/authenticated');
const md_auth = auth.Auth;

api.get('/songs', songController.list);
api.get('/songs/:id', songController.listById);
api.get('/songs/song/:song', songController.getSong);
api.get('/songs/album/:id', songController.listByAlbum);
api.post('/songs', songController.save);
api.post('/songs/song/:id', [md_upload], songController.uploadSong);
api.put('/songs/:id', songController.update);
api.delete('/songs/:id', [md_auth], songController.delete);

module.exports = api;