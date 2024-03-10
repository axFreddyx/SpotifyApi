const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'musicadb',
});

module.exports = {
    save(req, res){
        const data = req.body;
        const name = data.name;
        const description = data.description;
        const image = data.image;
        if(
           name && 
           description &&
           image
        ){
            const query = `INSERT INTO artist (name, description, image) VALUES ('${name}','${description}','${image}')`;
            conexion.query(query, (err, results, fields) => {
                if(!err){
                    res.status(200).send({message: "Artista guardado correctamente"});
                }else{
                    console.log(err);
                    res.status(500).send({message: "Ha ocurrido un error"});
                }
            })
        }else{
            res.status(200).send({message: "Datos faltantes"});
        }
    },
    list(req, res){
        const query = "SELECT * FROM artist"
        conexion.query(query, (err, results, fields) => {
            if(results){
                res.status(200).send({data:results})
            }else{
                res.status(500).send({message: "Volver a intentar"});
            }
        });
    },
    update(req,res){
        const data = req.body;
        const id = req.params.id;
        
        const name = data["name"];
        const description = data["description"];
        const image = data["image"];

        let query = "UPDATE artist SET ";

        const update = [];

        if(name){
            update.push(`name = '${name}'`);
        }

        if(description){
            update.push(`description = '${description}'`);
        }

        if(image){
            update.push(`image = '${image}'`);
        }

        if(update.length > 0){
            query += `${update.join(", ")} WHERE id = ${id}`;
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
    },
    delete(req,res){
        const id = req.params.id;
        const query = `DELETE FROM artist WHERE Id = ${id}`;
        conexion.query(query, (err, results, fields) => {
            if(!err){
                res.status(200).send({message: "Artista eliminado correctamente"});
            }else{
                res.status(500).send({message: "Ha ocurrido un error"});
            }
        });
    }
}