"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {UnauthorizedError} = require("../expressError");


class User {
    /** Authenticate user using username and password
     *
     * Return {username, first_name, last_name, email, is_admin}
     *
     * If user not found or passoword is wrong throws UnauthorizedError
     */

    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT username,
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
            [username]
        );

        const user = result.rows[0];

        if (user) {
            // compare hashed password to user password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        } else {
            throw new UnauthorizedError("Invalid username/password");
        }
    }

}
 module.exports = User