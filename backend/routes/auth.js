"use strict";

const User = require("../models/user");
const express = require("express");
const router = express.Router();
const jsonschema = require("jsonschema");
const userRegisterSchema = require("../schemas/userRegister.json");
const userAuthSchema = require("../schemas/userAuth.json");
const { BadRequestError } = require("../expressError");
const { createToken } = require("../helpers/token");

/**POST /auth/register {user} => {token}
 *
 * user must include {username, password, firstName, lastName, phoneNumber, email}
 *
 * Returns JWT token
 *
 * Authorization level: none
 */

router.post("/register", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if (!validator.valid) {
            console.log(validator.errors);
            const errs = validator.errors.map((e) => {
                // Format Error Message
                let errMsg = e.stack.replace("instance.", "");
                errMsg = errMsg.replace(/([a-z])([A-Z])/g, "$1 $2");
                errMsg = `${errMsg.charAt(0).toUpperCase()}${errMsg.slice(1)}`;
                return `${errMsg}`;
            });

            throw new BadRequestError(errs);
        }

        const newUser = await User.register({ ...req.body, isAdmin: false });
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});

/** POST /auth/token {username, password} => {token}
 *
 *  Returns JWT
 *
 * Authorization level: none
 */

router.post("/token", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        return res.status(200).json({ token });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
