"use strict";

const User = require("./user");
const db = require("../db");
const {
    UnauthorizedError,
    BadRequestError,
    NotFoundError,
} = require("../expressError");

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

/****************************************************** authenticate */

describe("authenticate", function () {
    it("works", async function () {
        const user = await User.authenticate("u1", "password1");
        expect(user).toEqual({
            username: "u1",
            firstName: "u1fn",
            lastName: "u1ln",
            email: "u1@email.com",
            phoneNumber: '1234567890',
            isAdmin: false,
        });
    });
});
