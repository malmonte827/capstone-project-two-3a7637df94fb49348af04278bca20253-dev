"use strict";

const app = require("../app");
const User = require("../models/user");
const db = require("../db");

const request = require("supertest");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    u3Token,
    adminToken,
    testPetIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/****************************************************** POST /users */

describe("POST /users", function () {
    test("works: admin - creates non admin", async function () {
        const res = await request(app)
            .post("/users")
            .send({
                username: "newUser",
                password: "newPassword",
                firstName: "new",
                lastName: "User",
                email: "newUser@email.com",
                phoneNumber: "1111111111",
                isAdmin: false,
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            user: {
                username: "newUser",
                firstName: "new",
                lastName: "User",
                email: "newUser@email.com",
                phoneNumber: "1111111111",
                isAdmin: false,
            },
            token: expect.any(String),
        });
    });

    test("works: admin - create admin", async function () {
        const res = await request(app)
            .post("/users")
            .send({
                username: "newUser",
                password: "newPassword",
                firstName: "new",
                lastName: "User",
                email: "newUser@email.com",
                phoneNumber: "1111111111",
                isAdmin: true,
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            user: {
                username: "newUser",
                firstName: "new",
                lastName: "User",
                email: "newUser@email.com",
                phoneNumber: "1111111111",
                isAdmin: true,
            },
            token: expect.any(String),
        });
    });

    test("unauth for users", async function () {
        const res = await request(app)
            .post("/users")
            .send({
                username: "newUser",
                password: "newPassword",
                firstName: "new",
                lastName: "User",
                email: "newUser@email.com",
                phoneNumber: "1111111111",
                isAdmin: true,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({
            error: { message: "Unauthorized", status: 401 },
        });
    });

    test("unauth for nonUser", async function () {
        const res = await request(app).post("/users").send({
            username: "newUser",
            password: "newPassword",
            firstName: "new",
            lastName: "User",
            email: "newUser@email.com",
            phoneNumber: "1111111111",
            isAdmin: true,
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({
            error: { message: "Unauthorized", status: 401 },
        });
    });

    test("bad request: missing data", async function () {
        const res = await request(app)
            .post("/users")
            .send({
                username: "newUser",
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(400);
    });

    test("bad request: invalid data", async function () {
        const res = await request(app)
            .post("/users")
            .send({
                username: "newUser",
                password: "newPassword",
                firstName: "new",
                lastName: "User",
                email: "not an email",
                phoneNumber: "1111111111",
                isAdmin: true,
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(400);
    });
});

/****************************************************** GET /users */

describe("GET /users", function () {
    test("works for admins", async function () {
        const res = await request(app)
            .get("/users")
            .set("authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            users: [
                {
                    username: "u1",
                    firstName: "u1fn",
                    lastName: "u1ln",
                    email: "u1@email.com",
                    phoneNumber: '1111111111',
                    isAdmin: false,
                },
                {
                    username: "u2",
                    firstName: "u2fn",
                    lastName: "u2ln",
                    email: "u2@email.com",
                    phoneNumber: '2222222222',
                    isAdmin: false,
                },
                {
                    username: "u3",
                    firstName: "u3fn",
                    lastName: "u3ln",
                    email: "u3@email.com",
                    phoneNumber: '333333333',
                    isAdmin: false,
                },
            ],
        });
    });

    test("unauth for non admin user", async function () {
        const res = await request(app)
            .get("/users")
            .set("authorization", `Bearer ${u1Token}`)
            expect(res.statusCode).toEqual(401)
    })

    test("unauth for non user", async function () {
        const res = await request(app)
        .get("/users")
        expect(res.statusCode).toEqual(401)
    })
});

/****************************************************** GET /users/:username */

describe("GET /users/:username", function () {
    test("works for admin", async function () {
        const res = await request(app)
            .get("/users/u1")
            .set("authorization", `Bearer ${adminToken}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            user : {
                username: "u1",
                id: expect.any(Number),
                firstName: "u1fn",
                lastName: "u1ln",
                email: "u1@email.com",
                phoneNumber: '1111111111',
                isAdmin: false,
                pets: [testPetIds[0]]
            }
        })
    })

    test("works for same user", async function () {
        const res = await request(app)
            .get("/users/u1")
            .set("authorization", `Bearer ${u1Token}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            user : {
                username: "u1",
                id: expect.any(Number),
                firstName: "u1fn",
                lastName: "u1ln",
                email: "u1@email.com",
                phoneNumber: '1111111111',
                isAdmin: false,
                pets: [testPetIds[0]]
            }
        })
    })

    test("unauth for other user", async function () {
        const res = await request(app)
            .get("/users/u1")
            .set("authorization", `Bearer ${u2Token}`)
        expect(res.statusCode).toEqual(401)
    })

    test("unauth for nonUser", async function () {
        const res = await request(app)
            .get("/users/u1")
            expect(res.statusCode).toEqual(401)
    })

    test("not found if user not found", async function () {
        const res = await request(app)
            .get("/users/notUser")
            .set("authorization", `Bearer ${adminToken}`)
            expect(res.statusCode).toEqual(404)
    })
})


