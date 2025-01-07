"use strict";

/** middleware to handle common authentication in routes */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate User
 *
 * If token was given, verify token
 * If token valid, store payload in res.locals
 *
 *
 */

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch (err) {
        return next();
    }
}

/** Middleware to use when must be logged in
 *
 * if not raises Unauthorized Error
 */

function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
}

/** Middleware to use when they must be logged in as admin
 *
 * if not raises Unauthorized Error
 */

function ensureAdmin(req, res, next) {
    try {
        if (!res.locals.user || !res.locals.user.isAdmin) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

/** Middleware to use when they must provide correct token and
 *  be user matching username in route params
 *
 * if not raises Unauthorized Error*/

function ensureCorrectUserOrAdmin(req, res, next) {
    try {
        const user = res.locals.user;
        if (
            !(user && (user.isAdmin || user.username === req.params.username))
        ) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports ={
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureCorrectUserOrAdmin
}