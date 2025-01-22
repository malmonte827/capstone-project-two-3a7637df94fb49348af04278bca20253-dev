"use strict"

const app = require("../app");

const request = require("supertest");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/****************************************************** POST /auth/register */

describe("POST /auth/register", function (){
    test("works", async function () {
        const res = await request(app)
        .post("/auth/register")
        .send({
            username: "new",
            password: "password",
            firstName: "first",
            lastName: "last",
            email: "new@email.com",
            phoneNumber: "1231231234",

        })
        expect(res.statusCode).toEqual(201)
        expect(res.body).toEqual({
            token: expect.any(String)
        })
        
    })

    test("bad request: missing data", async function () {
        const res = await request(app)
        .post("/auth/register")
        .send({
            username: "new",
        })
        expect(res.statusCode).toEqual(400)
    })

    test("bad request: invalid data", async function () {
        const res = await request(app)
        .post("/auth/register")
        .send({
            username: "new",
            password: "password",
            firstName: "first",
            lastName: "last",
            email: "notAnEmail",
            phoneNumber: "1231231234",
        })
        expect(res.statusCode).toEqual(400)
    })

})