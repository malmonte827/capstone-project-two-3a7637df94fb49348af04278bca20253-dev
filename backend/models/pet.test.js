"use strict";

const Pet = require("./pet");
const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testUserIds,
    testPetIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/****************************************************** create */
describe("create", function () {
    const newPet = {
        name: "new",
        age: "1",
        description: "test",
        hunger: 5,
        species: "newSpecies",
    };
    it("works", async function () {
        const pet = await Pet.create({ ...newPet, user_id: testUserIds[0] });
        expect(pet).toEqual({
            ...newPet,
            userId: testUserIds[0],
            hunger: 5,
            id: expect.any(Number),
        });
    });
});

/****************************************************** update */

describe("update", function () {
    const updateData = {
        name: "new",
        age: "999",
        description: "test",
        hunger: 55,
        species: "newSpecies",
    };
    it("works", async function () {
        const update = await Pet.update(testPetIds[0], updateData);
        expect(update).toEqual({
            ...updateData,
            id: testPetIds[0],
            userId: testUserIds[0],
        });
    });

    test("not found: no known pet", async function () {
        expect.assertions(1);
        try {
            await Pet.update(0, { name: "nonPet" });
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("bad request: no data", async function () {
        expect.assertions(1);
        try {
            await Pet.update(testPetIds[0], {});
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/****************************************************** get */

describe("get", function () {
    it("works", async function () {
        const pet = await Pet.get(testPetIds[0]);
        expect(pet).toEqual({
            id: testPetIds[0],
            name: "p1",
            age: "1",
            species: "cat",
            description: "its a cat",
            hunger: 1,
            userId: testUserIds[0],
        });
    });

    test("not found: no known pet", async function () {
        expect.assertions(1);
        try {
            await Pet.get(0);
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/****************************************************** remove */

describe("remove", function () {
    it("works", async function () {
        await Pet.remove(testPetIds[0]);
        const result = await db.query(`SELECT *  FROM pets WHERE id=$1`, [
            testPetIds[0],
        ]);
        expect(result.rows.length).toEqual(0);
    });

    test("not found: no known pet", async function () {
        expect.assertions(1);
        try {
            await Pet.remove(0);
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
