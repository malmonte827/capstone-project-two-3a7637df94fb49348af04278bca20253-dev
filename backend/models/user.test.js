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

/****************************************************** update */

describe("update", function () {
    const updateData = {
        firstName: "newfirst",
        lastName: "newLast",
        email: "new@email.com",
        phoneNumber: "999999999",
        isAdmin: true,
    };
    it("works", async function () {
        const update = await User.update("u1", updateData);
        expect(update).toEqual({
            ...updateData,
            username: "u1",
        });
    });

    it("works: new password", async function () {
        const update = await User.update("u1", { password: "new" });
        expect(update).toEqual({
            username: "u1",
            firstName: "u1fn",
            lastName: "u1ln",
            email: "u1@email.com",
            phoneNumber: "1234567890",
            isAdmin: false,
        });

        const result = await db.query(
            `SELECT * FROM users WHERE username = 'u1'`
        );
        expect(result.rows.length).toEqual(1);
        expect(result.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("not found: no known user", async function () {
        expect.assertions(1);
        try {
            await User.update("nonUser", { firstName: "nonUser" });
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("bad request: no data", async function () {
        expect.assertions(1);
        try {
            await User.update("u1", {});
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});
