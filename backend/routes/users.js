"use strict";

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jsonschema = require("jsonschema");
const { ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json")
const { BadRequestError } = require("../expressError");
const {createToken} = require("../helpers/token")

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

/** GET / => {users: [ {username, fistName, lastName, email, phoneNumber}, ... ] } 
 * 
 * Returns list of users
 * 
 * Authorization level: admin
*/

router.get("/", ensureAdmin, async function (req, res, next){
    try{
        const users = await User.getAll()
        return res.json({users})
    }catch(err){
        return next(err)
    }
} )

/** GET /[username] => {user} 
 * 
 * Returns {username, firstName, lastName, email, isAdmin, pets}
 *      where pets is {id, name, age, species, hunger}
 * 
 * Authorization level: admin or same user as username
*/

router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try{
        const user = await User.get(req.params.username)
        return res.json({ user })
    }catch(err){
        return next(err)
    }
  })

  /** PATCH /[username] {user} => {user}
   * 
   * Returns {username, firstName, lastName, email, phoneNumber, isAdmin }
   * 
   * Authorization level: admin or same user as username
   */

  router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, userUpdateSchema )
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }

        const user = await User.update(req.params.username, req.body)
        return res.json({user})
    }catch(err){
        return next(err)
    }
  })

module.exports = router
