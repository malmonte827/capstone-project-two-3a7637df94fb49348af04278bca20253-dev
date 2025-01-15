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


