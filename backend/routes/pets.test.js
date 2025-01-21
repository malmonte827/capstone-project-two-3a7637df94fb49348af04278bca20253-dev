"use strict";

const app = require("../app");

const request = require("supertest");
const r = `/users/:user_id`

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testUserIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/****************************************************** POST /pets */

describe("POST /pets", function () {
    test("works", async function () {
        const res = await request(app).post(`/users/u1/pets`).send({
            name: "newPet",
            age: 2,
            species: "pet",
            user_id: testUserIds[0],
        });
        expect(res.body).toEqual({
            pet: {
                id: expect.any(Number),
                name: "newPet",
                age: 2,
                species: "pet",
                hunger: 100,
                userId: testUserIds[0],
            },
        })
        expect(res.statusCode).toEqual(201)
    });

    // test("bad request: missing data", async function () {
    //     const res = await request(app)
    //     .post("/pets")
    //     .send({
    //         name: "newPet"
    //     });
    //     expect(res.statusCode).toEqual(400)
    // })

    // test("bad request: invalid data", async function () {
    //     const res = await request(app).post("/pets").send({
    //         name: "newPet",
    //         species: "pet",
    //         age:"not a number",
    //         user_id: testUserIds[0],
    //     });
    //     expect(res.statusCode).toEqual(400)
    // })
});
