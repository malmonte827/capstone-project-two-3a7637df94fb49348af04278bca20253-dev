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
        const result = await db.query(
            `INSERT INTO pets (name, age, species, hunger, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, age, species, hunger, user_id AS "userId"`,
            [data.name, data.age, data.species, data.hunger, data.user_id]
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
                            RETURNING id, name, age, species, hunger, user_id AS "userId"`
        
        const result = await db.query(updateQuery, [...values, id])

        const pet = result.rows[0]

        if (!pet){
            throw new NotFoundError(`No pet: ${id}`)
        }

        return pet
    }

    /** Get all pets of user
     * 
     * Returns [{name, age, species, hunger}, ...]
     * 
     */
    static async getAll(username){
        const result = await db.query(
            `SELECT  pets.id AS pet_id, name, age, species, hunger, user_id
            FROM pets 
            JOIN users ON pets.user_id = users.id 
            WHERE users.username = $1`,
            [username]
        )
        return result.rows


    }

    /** Get pet data
     * 
     * Returns {id, name, age, species, hunger, user_id}
     * 
     * Throws NotFoundError if not found
     */
    static async get(id){
        const result = await db.query(
            `SELECT id, name, age, species, hunger, user_id AS "userId"
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


    /** Removes pet from database
     * 
     * Returns undefined
     * 
     * Throws NotFoundError if not found
     */
    static async remove(id){
        const result = await db.query(
            `DELETE
            FROM pets
            WHERE id = $1
            RETURNING name`,
            [id]
        )

        const pet = result.rows[0]

        if(!pet){
            throw new NotFoundError(`No pet: ${id}`)
        }

        return pet
    }
}

module.exports = Pet