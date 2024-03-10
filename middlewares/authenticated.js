const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "secret_key";

exports.Auth = (req, res, next) => {
    const authorization = req.headers.authorization; 
    console.log(authorization);
    if (!authorization) {
        return res.status(403).send({ message: "Llave de autorización faltante" });
    }
    const token = authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: "La sesión ha expirado" });
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({ message: "Llave no válida" });
    }
    req.user = payload;
    next();
};
