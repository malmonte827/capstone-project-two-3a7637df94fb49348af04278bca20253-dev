"use strict";

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jsonschema = require("jsonschema");
const { ensureAdmin } = require("../middleware/auth");
const userNewSchema = require("../schemas/userNew.json");
const { BadRequestError } = require("../expressError");

/********* Routes for users ******/

/** POST / {user} => {user, token}
 *
 * Adds a new user.
 * Used only by admins to create new users.
 * !Not registration endpoint!
 * User being added can be admin
 *
 * Returns {user: {username, firstName, lastName, email, phoneNumber, isAdmin}, token}
 *
 * Authorization level : admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }
        const user = await User.register(req.body);
        const token = createToken(user);

        return res.status(201).json({ user, token });
    } catch (err) {
        return next(err);
    }
});
