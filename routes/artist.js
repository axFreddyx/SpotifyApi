var express = require("express");
const auth = require("../middlewares/authenticated");
const md_auth = auth.Auth;

const api = express.Router();

const artistController = require('../controllers/artist');

api.get('/artists',[md_auth], artistController.list);
api.post('/artists',[md_auth], artistController.save);
api.put('/artists/:id',[md_auth], artistController.update);
api.delete('/artists/:id',[md_auth], artistController.delete);

module.exports = api;