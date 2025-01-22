"use strict";

const User = require("../models/user");
const express = require("express");
const router = express.Router();
const jsonschema = require("jsonschema");
const userRegisterSchema = require("../schemas/userRegister.json");
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
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const newUser = await User.register({ ...req.body, isAdmin: false });
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});

module.exports = router