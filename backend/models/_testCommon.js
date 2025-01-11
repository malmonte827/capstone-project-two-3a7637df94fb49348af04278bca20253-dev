const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");
const testUserIds = [];

async function commonBeforeAll() {
    await db.query(`DELETE FROM users`);

    await db.query(`DELETE FROM pets`);

    const userResults = await db.query(
        `
        INSERT INTO users (username,
                           password,
                           first_name
                           last_name
                           email,
                           phone_number)
        VALUES (u1, $1, u1fn, u1ln, u1@email.com, 1234567890),
        VALUES (u2, $2, u2fn, u2ln, u2@email.com, 0987654321),
        VALUES (u3, $3, u3fn, u3ln, u3@email.com, 1029384756)
        RETURNING id`,
        [
            await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
        ]
    );

    testUserIds.splice(0, 0, ...userResults.rows.map((r) => r.id));

    await db.query(
        `
        INSERT INTO pets (name, age, species, hunger, user_id
        VALUES (p1, 1, cat, 1, $1)
        VALUES (p2, 2, dog, 2, $2)
        VALUES (p3, 3, bird, 3, $3)`,
        [testUserIds[0], testUserIds[3], testUserIds[2]]
    );
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
    testUserIds
}