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
                first_name: "new",
                last_name: "User",
                email: "newUser@email.com",
                phone_number: "123-456-7890",
                is_admin: false,
            })
            .set("authorization", `Bearer ${adminToken}`);
        console.log(res.body);
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
            token: expect.any(Number),
        });
    });
});
