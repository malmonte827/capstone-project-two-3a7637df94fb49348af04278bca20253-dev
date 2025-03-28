const jwt = require("jsonwebtoken")
const {SECRET_KEY} = require("../config")

/** Returns signed JWT from user data */

function createToken(user){
    let payload = {
        username: user.username,
        isAdmin: user.isAdmin || false,
    }

    return jwt.sign(payload, SECRET_KEY)
}

module.exports = {createToken}