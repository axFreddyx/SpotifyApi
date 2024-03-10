'use-strict';
const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const conexion = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "musicadb",
    port: process.env.DB_PORT || 3306
});

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());

// RUTAS

// Rutas de user
const user_routes = require('./routes/user');
app.use(user_routes);

// Rutas de las canciones

const song_routes = require("./routes/song");
app.use(song_routes);

// Ruta de artistas

const artist_routes = require("./routes/artist");
app.use(artist_routes);

// Ruta de albums

const album_routes = require("./routes/album");
app.use(album_routes);

//FIN RUTAS

app.get('*', (req, res) => {
    res.send({ message: 'Ruta no válida!' });
});

conexion.connect((error) => {
    if (error) {
        console.log('No se puede conectar a la base de datos');
        console.log(error)
    } else {
        console.log('Conectado a la base de datos');

        app.listen(PORT, () => {
            console.log(`Servidor API ejecutando en el puerto ${PORT}`);
        });
    }
});
