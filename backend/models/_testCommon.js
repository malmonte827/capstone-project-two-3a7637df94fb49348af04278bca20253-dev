const db = require("../db");
const bcrypt = require("bcrypt")
const { BCRYPT_WORK_FACTOR } = require("../config");
const testUserIds = [];
const testPetIds = []

async function commonBeforeAll() {
    await db.query(`DELETE FROM pets`);
    
    await db.query(`DELETE FROM users`);

    const userResults = await db.query(
        `
        INSERT INTO users (username,
                           password,
                           first_name,
                           last_name,
                           email,
                           phone_number)
        VALUES ('u1', $1, 'u1fn', 'u1ln', 'u1@email.com', 1234567890),
               ('u2', $2, 'u2fn', 'u2ln', 'u2@email.com', 0987654321),
               ('u3', $3, 'u3fn', 'u3ln', 'u3@email.com', 1029384756)
        RETURNING id`,
        [
            await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
        ]
    );

    testUserIds.splice(0, 0, ...userResults.rows.map((r) => r.id));

   const petResults = await db.query(
        `
        INSERT INTO pets (name, age, species, hunger, user_id, description)
        VALUES ('p1', 1, 'cat', 1, $1, 'its a cat'),
               ('p2', 2, 'dog', 2, $2, 'its a dog'),
               ('p3', 3, 'bird', 3, $3, 'its a bird')
        RETURNING id`,
        [testUserIds[0], testUserIds[1], testUserIds[2]]
    );
    testPetIds.splice(0, 0, ...petResults.rows.map((r) => r.id));

}

async function commonBeforeEach(){
    await db.query("BEGIN")
}
async function commonAfterEach(){
    await db.query("ROLLBACK")
}
async function commonAfterAll(){
    await db.end()
}

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testUserIds,
    testPetIds
}