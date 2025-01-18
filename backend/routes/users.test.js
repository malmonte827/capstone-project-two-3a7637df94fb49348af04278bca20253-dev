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

    test("works: admin - create admin", async  function () {
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
    })

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
             error: { message: 'Unauthorized', status: 401 } 
        });
    })

    test("unauth for nonUser", async function () {
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
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({
             error: { message: 'Unauthorized', status: 401 } 
        });
    })

    test("bad request: missing data", async function () {
        const res = await request(app)
            .post("/users")
            .send({
                username: "newUser",
            })
            .set("authorization", `Bearer ${adminToken}`)
            expect(res.statusCode).toEqual(400)
            
    })

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
            .set("authorization", `Bearer ${adminToken}`)
        expect(res.statusCode).toEqual(400);
    })
});
