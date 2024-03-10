const fs = require('fs');
const mysql = require('mysql2');
const path = require("path");
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'musicadb',
});

module.exports = {
    save(req, res){
        const data = req.body;
        const title = data["title"];
        const description = data["description"];
        const year = data["year"];
        const artist_id = data["artist_id"];

        if(title && description && year && artist_id){
            const query = `INSERT INTO albums (title, description, year, artist_id) VALUES 
            ("${title}",'${description}', '${year}', '${artist_id}')`;
            conexion.query(query, (err, results, fields) =>{
                if(!err){
                    res.status(200).send({message: "Album creado correctamente"});
                }else{
                    res.status(500).send({message: "Ha ocurrido un error, intentelo mas tarde"});
                }
            });
        }else{
            res.status(200).send({message: "Campos faltantes"});
        }
       
    },
    list(req, res){
        const query = "SELECT * FROM albums"
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
        const query = `SELECT artist.name AS nameArtist,
        albums.id, albums.title, albums.description, albums.year, albums.image, albums.artist_id
        FROM albums INNER JOIN artist ON albums.artist_id = artist.id WHERE albums.id = ${id}`;
        conexion.query(query, (err, results, fields) => {
            if(results){
                res.status(200).send({data:results})
            }else{
                res.status(500).send({message: "Volver a intentar"});
            }
        });
    },
    uploadImage(req, res){
        const id = req.params.id;
        const data = req.files;
        const file = data.file;
        if(data){
            const file_path = file.path;
            const file_split = file_path.split('\\');
            const file_name = file_split[2];
            const ext_split = file_name.split('.');
            const extension = ext_split[1];
            if(
                extension === "jpg" ||
                extension === "png" ||
                extension === "jpeg" ||
                extension === "gif" ||
                extension === "webp"
            ){
                const query = `UPDATE albums SET image = '${file_name}' WHERE id = ${id}`;
                console.log(query);
                
                conexion.query(query, (err, results, fields) => {
                    if(!err){
                        res.status(200).send({message: "Imagen subida correctamente"});
                    }else{
                        res.status(500).send({message: "Ha ocurrido un error"});
                    }
                });
            }
        }
    },
    getImage(req, res){
        const params = req.params;
        const imagen = params.image;
        const path_file = `uploads/albums/${imagen}`;
    
        if(fs.existsSync(path_file)){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message: "No existe el archivo"});
        }
    },
    update(req, res){
        const id = req.params.id;
        const data = req.body;

        const title = data["title"];
        const description = data["description"];
        const image = data["image"];
        const year = data["year"];
        const artist_id = data["artist_id"];

        const partQuery = [];
        let query = "UPDATE albums SET ";

        if(title){
            partQuery.push(`title = "${title}"`);
        }
        if(description){
            partQuery.push(`description = '${description}'`);
        }
        if(image){
            partQuery.push(`image = "${image}"`);
        }
        if(year){
            partQuery.push(`year = "${year}"`);
        }
        if(artist_id){
            partQuery.push(`artist_id = "${artist_id}"`);
        }
        
        if(partQuery.length > 0){
            query += `${partQuery.join(', ')} WHERE id = ${id}`;
            conexion.query(query, (err, results, fields) => {
                if(err){
                    res.status(500).send({messasge: `Error: ${err}`});
                }else{
                    res.status(200).send({message: "Artista acutalizado"})
                }
            })
        }else{
            res.status(200).send({message: "Ha ocurrido un error"});
        }
    }
}