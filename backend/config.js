"use strict"

/** Shared config for application */

require("dotenv").config()
require("colors");

const SECRET_KEY = process.env.SECRET_KEY

const PORT = +process.env.PORT || 3001

/** Use dev, testing, or production database */
function getDatabaseUri(){
    return(
        process.env.NODE_ENV === "test"
        ? "capstone_test"
        : process.env.DATABASE_URL || "capstone"
    )
}

/** Speeds up bcrypt during testing */
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;

console.log("Capstone Config:".green)
console.log("PORT:".yellow, PORT.toString())
console.log("BCRYPT_WORK_FACTOR:".yellow, BCRYPT_WORK_FACTOR)
console.log("-----------")

module.exports = {
    SECRET_KEY,
    PORT,
    getDatabaseUri,
    BCRYPT_WORK_FACTOR
}