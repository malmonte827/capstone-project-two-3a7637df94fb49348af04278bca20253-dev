"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { sqlForPartialUpdate } = require("../helpers/sql");

const {
    UnauthorizedError,
    BadRequestError,
    NotFoundError,
} = require("../expressError");

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

    /**Register new user
     *
     * Returns {username, firstName, lastName, email, phoneNumber, isAdmin }
     *
     * Throws BadRequestError if theres a duplicate
     */
    static async register({
        username,
        password,
        firstName,
        lastName,
        email,
        phoneNumber,
        isAdmin,
    }) {
        const checkDuplicate = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username]
        );
        if (checkDuplicate.rows[0]) {
            throw new BadRequestError(`Username taken. Try again`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
        (username,
        password,
        first_name,
        last_name,
        email,
        phone_number,
        is_admin)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING username, first_name AS firstName, last_name AS lastName, email, phone_number AS phoneNumber, is_admin AS isAdmin`,
            [
                username,
                hashedPassword,
                firstName,
                lastName,
                email,
                phoneNumber,
                isAdmin,
            ]
        );

        const user = result.rows[0];

        return user;
    }

    /** Update user data with 'data'
     *
     * Returns {username, firstName, lastName, email, phoneNumber, isAdmin}
     *
     * Throws NotFoundError if user not found
     */
    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(
                data.password,
                BCRYPT_WORK_FACTOR
            );
        }
        const { setCols, values } = sqlForPartialUpdate(data, {
            firstName: "first_name",
            lastName: "last_name",
            phoneNumber: "phone_number",
            isAdmin: "is_admin",
        });
        const usernameIdx = `$${values.length + 1}`;

        const updateQuery = `UPDATE users
                            SET ${setCols}
                            WHERE username = ${usernameIdx}
                            RETURNING username,
                                    first_name AS "firstName",
                                    last_name AS "lastName",
                                    phone_number AS "phoneNumber",
                                    is_admin AS "isAdmin"`;
        const result = await db.query(updateQuery, [...values, username]);
        const user = result.rows[0];

        if (!user) {
            throw new NotFoundError(`No user: ${username}`);
        }

        delete user.password;
        return user;
    }

    /** Removes user from database
     *
     * Returns undefined
     *
     * Throws NotFoundError if user not found
     */
    static async remove(username) {
        const result = await db.query(
            `DELETE
            FROM users
            WHERE username = $1
            RETURNING username`,
            [username]
        );

        const user = result.rows[0];

        if (!user) {
            throw new NotFoundError(`No user: ${username}`);
        }
    }

    /** Gets data about user
     *
     * Returns {username firstNmae, lastName, email, phoneNumber, isAdmin}
     *
     * Throws NotFoundError if not found
     */
    static async get(username) {
        const result = await db.query(
            `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    phone_number AS "phoneNumber",
                    is_admin AS "isAdmin"
             FROM users
             WHERE username = $1`,
            [username]
        );

        const user = result.rows[0];

        if (!user) {
            throw new NotFoundError(`No user: ${username}`);
        }
        return user;
    }

    static async getAll() {}
}
module.exports = User;
