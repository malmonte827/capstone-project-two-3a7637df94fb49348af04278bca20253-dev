"use strict"

const db = require("../db")
const {NotFoundError} = require("../expressError")
const {sqlForPartialUpdate} = require("../helpers/sql")


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


    /** Update pet data with 'data'
     * 
     * Returns {name, age, species, hunger}
     * 
     * Throws NotFoundError if not found
     */
    static async update(id, data){
        const {setCols, values} = sqlForPartialUpdate(data, {})

        const idIdx = `$${values.length + 1}`

        const updateQuery = `UPDATE pets
                            SET ${setCols}
                            WHERE id = ${idIdx}
                            RETURNING id, name, age, species, hunger, user_id AS userId`
        
        const result = await db.query(updateQuery, [...values, id])

        const pet = result.rows[0]

        if (!pet){
            throw new NotFoundError(`No pet: ${id}`)
        }

        return pet
    }


    /** Get pet data
     * 
     * Returns {id, name, age, species, hunger, user_id}
     * 
     * Throws NotFoundError if not found
     */
    static async get(id){
        const result = await db.query(
            `SELECT id, name, age, species, hunger, user_id AS userId
            FROM pets
            WHERE id = $1`,
            [id]
        )

        const pet = result.rows[0]

        if(!pet){
            throw new NotFoundError(`No pet: ${id}`)
        }

        return pet

    }
}