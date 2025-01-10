"use strict"

const db = require("../db")
const {NotFoundError} = require("../expressError")


class Pet {
    /** Create a new pet from data 
     * 
     * Data {name, age, species, user,_id}
     * 
     * Returns {id, name, age, species, hunger, userId}
    */

    static async create(data){
        const result = db.query(
            `INSERT INTO pets (name, age, species, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, age, species, hunger, user_id AS userId`,
            [data.name, data.age, data.species, data.user_id]
        )
        const pet = result.rows[0]

        return pet
    }
}