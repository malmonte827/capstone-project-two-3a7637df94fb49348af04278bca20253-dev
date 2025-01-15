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
        age: 1,
        species: "newSpecies",
    };
    it("works", async function () {
        const pet = await Pet.create({ ...newPet, user_id: testUserIds[0] });
        expect(pet).toEqual({
            ...newPet,
            userId: testUserIds[0],
            hunger: 100,
            id: expect.any(Number),
        });
    });
});

/****************************************************** update */

describe("update", function () {
    const updateData = {
        name: "new",
        age: 999,
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


