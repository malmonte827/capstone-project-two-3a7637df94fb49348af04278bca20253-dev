"use strict";

const db = require("../db");
const User = require("../models/user");
const Pet = require("../models/pet")
const { createToken } = require("../helpers/token");

async function commonBeforeAll() {
    await db.query("DELETE FROM users");

    await db.query("DELETE FROM pets");

   const u1 = await User.register({
        username: "u1",
        password: "password1",
        firstName: "u1fn",
        lastName: "u1ln",
        email: "u1@email.com",
        phoneNumber: 1111111111,
        isAdmin: false,
    });
   const u2 = await User.register({
        username: "u2",
        password: "password2",
        firstName: "u2fn",
        lastName: "u2ln",
        email: "u2@email.com",
        phoneNumber: 2222222222,
        isAdmin: false,
    });
   const u3 = await User.register({
        username: "u3",
        password: "password3",
        firstName: "u3fn",
        lastName: "u3ln",
        email: "u3@email.com",
        phoneNumber: 333333333,
        isAdmin: false,
    });

    await Pet.create({
        name: "p1",
        age: 1,
        species: "cat",
        hunger: 1,
        userId: u1.id
    })

    await Pet.create({        
        name: "p2",
        age: 2,
        species: "dog",
        hunger: 2,
        userId: u2.id
    })
    await Pet.create({        
        name: "p3",
        age: 3,
        species: "bird",
        hunger: 3,
        userId: u3.id
    })
}

const u1Token = createToken({username: "u1", isAdmin: false})
const u2Token = createToken({username: "u2", isAdmin: false})
const u3Token = createToken({username: "u3", isAdmin: false})
const adminToken = createToken({username: "admin", isAdmin: true})

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    await db.end();
}

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    u3Token,
    adminToken
}