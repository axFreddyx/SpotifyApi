const mysql = require('mysql2');
const path = require("path");
const fs = require('fs');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'musicadb',
});

module.exports = {
    save(req, res){
        const song = req.body;
        const name = song.name;
        const number = song.number;
        const duration = song.duration;
        const album_id = song.album_id;

        if (name && number && duration && album_id) {
            const query = `INSERT INTO songs (name, number, duration, albums_id) VALUES 
            ('${name}','${number}','${duration}','${album_id}')`;
            conexion.query(query, (err, results, fields) => {
                if(!err){
                    res.status(200).send({message: "Canción Guardada"});
                }else{
                    res.status(500).send({message: "Ha ocurrido un error, intentalo mas tarde"});
                }
            });
        } else {
            res.status(400).send({ message: "Faltan datos obligatorios para guardar la canción" });
        }        
    },
    list(req, res){
        const query = "SELECT albums.image, songs.id, songs.name, songs.duration, songs.file FROM songs INNER JOIN albums ON songs.albums_id = albums.id"
        conexion.query(query, (err, results, fields) => {
            if(results){
                res.status(200).send({data:results})
            }else{
                res.status(500).send({message: "Volver a intentar"});
            }
        });
    },
    listById(req, res){
        const id = req.params.id;
        const query = `SELECT albums.image AS imagenALbum, songs.id, songs.name, songs.duration, songs.albums_id, songs.file 
        FROM songs 
        INNER JOIN albums ON songs.albums_id = albums.id 
        WHERE songs.id = ${id}`;

        conexion.query(query, (err, results, fields) => {
            if(results){
                res.status(200).send({data:results})
            }else{
                res.status(500).send({message: "Volver a intentar"});
            }
        });
    },
    uploadSong(req, res){
        const id = req.params.id;
        const data = req.files;
        const file = data.file;

        if(file){
            const file_path = file.path;
            const file_split = file_path.split('\\');
            const file_name = file_split[2];
            const ext = file_name.split('.');
            const file_ext = ext[1];

            if (file_ext === "mp3"){
                const query = `UPDATE songs SET file = '${file_name}' WHERE id = ${id}`;
                conexion.query(query, (err, results, fields)=>{
                    if(!err){
                        res.status(200).send({message:"Archivo subido."});
                    }else{
                        res.status(500).send({message: "Ha ocurrido un error, intentelo mas tarde."});
                    }
                });
            }else{
                res.status(200).send({message: "El archivo debe ser tipo MP3"});
            }
        }
    },
    update(req, res){
        const id = req.params.id;
    
        const data = req.body;
        const name = data.name;
        const number = data.number;
        const duration = data.duration;
        const albums_id = data.albums_id;

        const array = [];
        let query = "UPDATE songs SET ";

        if(name) array.push(`name = '${name}'`);
        if(number) array.push(`number = ${number}`);
        if(duration) array.push(`duration = ${duration}`);
        if(albums_id) array.push(`albums_id = ${albums_id}`);

        if(array.length > 0){
            query += `${array.join(', ')} WHERE id = ${id}`
            conexion.query(query, (err, results, fields) => {
                if(results.affectedRows !== 0){
                    if(!err) res.status(200).send({message: "Canción actualizada correctamente"});
                    res.status(500).send({message: "Ha ocurrido un error"});
                }else{
                    res.status(500).send({message: "Album existente"});
                }
            });
        }
    },
    delete(req, res) {
        const id = req.params.id;
        console.log(id);
        const query = `DELETE FROM songs WHERE id = ${id}`;
        conexion.query(query, (err, results, fields)=>{
            if(!err){
                if(results.affectedRows !== 0){
                    res.status(200).send({message:"Registro eliminado"});
                }else{
                    res.status(200).send({message:"Ha ocurrido un error"});
                }
            }else{
                res.status(500).send({message:"Intentalo mas tarde"});
            }
        });
    },
    getSong(req, res){
        const params = req.params;
        const song = params.song;
        const path_song = `uploads/songs/${song}`;

        if(fs.existsSync(path_song)){
            res.sendFile(path.resolve(path_song));
        }else{
            res.status(404).send({message: "No existe el archivo"});
        }
    },
    listByAlbum(req, res){
        const idAlbum = req.params.id;
        const query = `SELECT * FROM songs WHERE albums_id = ${idAlbum}`;
        conexion.query(query, (err, results, fields) => {
            if(!err){
                res.status(200).send({data: results});
            }else{
                res.status(500).send({message:"Ha ocurrido un error"});
            }
        });
    }
}