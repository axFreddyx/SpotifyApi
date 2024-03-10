const bcrypt = require("bcrypt-nodejs");
const mysql = require('mysql2');
const jwt = require("../services/jwt");
const fs = require("fs");
const path = require("path");

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'musicadb'
});

module.exports = {
    save(req, res) {
        const user = req.body;
        const username = user.username;
        const email = user.email;
        const name = user.name;
        const image = "imgDef.png";

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                res.status(500).send({ message: "Error al generar el salt" });
            } else {
                bcrypt.hash(user.password, salt, null, (err, hash) => {
                    if (err) {
                        res.status(500).send({ message: "Volver a intentar" });
                    } else {
                        if (
                            username !== "" || username !== null,
                            hash !== "" || hash !== null,
                            email !== "" || email !== null,
                            name !== "" || name !== null,
                            image !== "" || image !== null
                        ) {
                            const query = `INSERT INTO user (username, password, email, name, image) 
                            VALUES ('${username}', '${hash}', '${email}', '${name}', '${image}');`;
                            conexion.query(query, (err, results, fields) => {
                                if (err) {
                                    res.status(500).send({ message: "Error, vuelve a intentarlo mas tarde" });
                                } else {
                                    res.status(200).send({ message: "Usuario guardado" });
                                }
                            });
                        }else{
                            res.status(500).send({message: "Datos faltantes, Volver a intentar"});
                        }
                    }
                });
            }
        });
    },
    list(req, res){
        const user = req.user;
        const id = user.sub;
        const role = user.role;
        let query = "";

        if(role === 'admin'){
            query = "SELECT * FROM user";
        }else{
            query = `SELECT * FROM user WHERE id = ${id}`;
        }

        conexion.query(query, (err, results, fields) => {
            if(results){
                res.status(200).send({data:results})
            }else{
                res.status(500).send({message: "Volver a intentar"});
            }
        });
    },
    listById(req, res){
        const user = req.user;
        const id = user.sub;
        let query = `SELECT * FROM user WHERE id = ${id}`;
        conexion.query(query, (err, results, fields) => {
            if(results){
                res.status(200).send({data:results})
            }else{
                res.status(500).send({message: "Volver a intentar"});
            }
        });
    },
    login(req, res){
        const data = req.body;
        const user = data.username;
        const password = data.password;
        const token = data.token;

        const query = `SELECT * FROM user WHERE username = '${user}' LIMIT 1`;

        conexion.query(query,(err, results,fields) => {
            if(!err){
                if(results.length !== 0){
                    bcrypt.compare(password,results[0].password,(error, check) =>{
                        if(check){
                            if(token){
                                res.status(200).send({token:jwt.createToken(results[0]), message: "Datos correctos", id: results[0].id});
                                // console.log({token:jwt.createToken(results[0])})
                            }else{
                                res.status(200).send({message:"Datos correctos"});
                                console.log({message:"Datos Correctos"})
                            }
                        }else{
                            res.status(200).send({message: "Datos incorrectos"});
                        }
                    });
                }else{
                    res.status(200).send({message:"Datos no encontrados"});
                }
            }
            // console.log(results[0].password);
        });
    },
    delete(req,res){
        const id = req.params.id;
        console.log(id);
        const query = `DELETE FROM user WHERE id = ${id}` 
        conexion.query(query,(err, results, fields) => {
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
    update(req, res){
        params = req.params;
        data = req.body;
        console.log(data);
        id = params.id;

        let query = "UPDATE user SET ? WHERE id = ?";

        if(data.password){
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    res.status(500).send({ message: "Error al generar el salt" });
                } else {
                    bcrypt.hash(data.password, salt, null, (err, hash) => {
                        if (!err) {
                            data.password = hash;
                        } else {
                            res.status(500).send({ message: "Volver a intentar" });
                        }
                    });
                }
            });
        }
        conexion.query(query,[data,id], (err, results, fields)=>{
            if(!err){
                console.log(results);
            }else{
                console.log(err);
            }
        })
    },
    uploadImage(req, res){
        const id = req.params.id;
        const file = "Sin imagen...";
        const files = req.files;

        if(files){
            const file_path = files.image.path;
            const file_split = file_path.split('\\');
            const file_name = file_split[2];
            const ext = file_name.split('.');
            const file_ext = ext[1];

            if(file_ext === 'jpg' || file_ext ==="gif" || file_ext === "png" || file_ext === "jpeg"){
                const query = `UPDATE user SET image = '${file_name}' WHERE id = ${id}`;
                conexion.query(query, (err, results, fields) => {
                    if(!err){
                        if(results.affectedRows !== 0){
                            res.status(200).send({message:"Imagen actualizada"});
                        }else{
                            res.status(200).send({message:"Error al actualizar"});
                        }
                    }else{
                        res.status(200).send({message: "Intentalo mas tarde"});
                    }
                });
            }else{
                res.status(200).send({message: "Imagen no valida"});
            }
        }
    },
    getImage(req, res){
        const params = req.params;
        const imagen = params.image;
        const path_file = `uploads/users/${imagen}`;
    
        if(fs.existsSync(path_file)){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message: "No existe el archivo"});
        }
    },
    delImage(req, res){
        const id = req.params.id;
        const query =  `SELECT image FROM user WHERE id = ${id}`;

        conexion.query(query, (err, result, fields) => {
            if(!err){
                if(result.affectedRows !== 0){
                    console.log(result);
                    const image = result[0].image;
                    if(image !== null){
                        const path_file = `./uploads/users/${image}`;
                        try {
                            fs.unlinkSync(path_file);
                            res.status(200).send({message: "Imagen eliminada"});
                        } catch (error) {
                            console.log(error);
                            res.status(200).send({message: "No se pudo eliminar, intentalo mas tarde"});
                        }
                    }
                }
            }else{
                console.log(err);
                res.status(500).send({message: "Intentalo mas tarde"});
            }
        });
    },
    getUserById(req, res){
        const params = req.params;
        const id = params.id;

        const sql = `SELECT * FROM user`;
    }
}