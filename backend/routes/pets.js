"use strict"

const express = require("express")
const router = express.Router()
const Pet = require("../models/pet")
const {ensureCorrectUserOrAdmin} = require("../middleware/auth")
const jsonschema = require("jsonschema")
const petNewSchema = require("../schemas/petNew.json")
const {BadRequestError} = require("../expressError")
/** Routes for pets */

/** POST / {pet} => {pet}
 * 
 * Returns {pet: [{id, name, age, species, hunger, user_id}, ...]
 * 
 * Authorization level: Admin or same as user_id
 */

router.post("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, petNewSchema)
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }

        const pet = await Pet.create(req.body)
        return res.status(201).json({pet})
    }catch(err){
        return next(err)
    }
})

module.exports = router