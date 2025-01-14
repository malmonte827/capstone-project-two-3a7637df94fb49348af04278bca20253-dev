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
            phoneNumber: "1234567890",
            isAdmin: false,
        });
    });

    test("unauth if not user", async function () {
        try {
            await User.authenticate("nouUser", "password");
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });

    test("unauth if wrong password", async function () {
        expect.assertions(1);
        try {
            await User.authenticate("u1", "wrong");
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });
});

/****************************************************** register */

describe("register", function () {
    const newUser = {
        username: "newUser",
        firstName: "new",
        lastName: "User",
        email: "newUser@email.com",
        phoneNumber: "1111111111",
        isAdmin: false,
    };

    it("works", async function () {
        const user = await User.register({ ...newUser, password: "password" });

        expect(user).toEqual(newUser);
        const result = await db.query(
            `SELECT * FROM users WHERE username = 'newUser'`
        );
        expect(result.rows.length).toEqual(1);
        expect(result.rows[0].password.startsWith("$2b$")).toBeTruthy();
    });

    it("works: add admin", async function () {
        const user = await User.register({
            ...newUser,
            password: "password",
            isAdmin: true,
        });
        expect(user.isAdmin).toEqual(true);
    });

    test("duplicate: bad request", async function () {
        expect.assertions(1);
        try {
            await User.register({ ...newUser, password: "password" });
            await User.register({ ...newUser, password: "password" });
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});
