"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const Pet = require("../models/pet");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const jsonschema = require("jsonschema");
const petNewSchema = require("../schemas/petNew.json");
const petUpdateSchema = require("../schemas/petUpdate.json");
const { BadRequestError } = require("../expressError");
/** Routes for pets */

/** POST / {pet} => {pet}
 *
 * Returns {pet: [{id, name, age, species, hunger, user_id}, ...]
 *
 * Authorization level: Admin or same as user_id
 */

router.post("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, petNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const pet = await Pet.create(req.body);
        return res.status(201).json({ pet });
    } catch (err) {
        return next(err);
    }
});

router.get("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const pets = await Pet.getAll(req.params.username);
        return res.status(200).json({ pets });
    } catch (err) {
        return next(err);
    }
});

router.get("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const pet = await Pet.get(req.params.id);
        return res.status(200).json({ pet });
    } catch (err) {
        return next(err);
    }
});

router.patch("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, petUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }
        const pet = await Pet.update(req.params.id, req.body);
        return res.status(200).json({ pet });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
