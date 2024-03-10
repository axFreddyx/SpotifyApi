const jwt = require("jwt-simple");
const moment = require("moment");
const secret = 'secret_key';

exports.createToken = (user) => {
    let payload = {
        sub:user.id,
        name:user.name,
        role:user.role,
        status:user.status,
        image:user.image,
        iat: moment.unix(),
        exp:moment().add(1,"month").unix()
    }
    return jwt.encode(payload, secret);
}