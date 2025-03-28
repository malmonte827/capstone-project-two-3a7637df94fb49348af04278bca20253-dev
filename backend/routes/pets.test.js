"use strict";

const app = require("../app");

const request = require("supertest");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testUserIds,
    u1Token,
    u2Token,
    adminToken,
    testPetIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/****************************************************** POST /pets */

describe("POST /pets", function () {
    test("works: admin", async function () {
        const res = await request(app)
            .post(`/users/u1/pets`)
            .set("authorization", `Bearer ${adminToken}`)
            .send({
                name: "newPet",
                age: "2",
                hunger: 10,
                description: "my new pet",
                species: "pet",
                user_id: testUserIds[1],
            });
        expect(res.body).toEqual({
            pet: {
                id: expect.any(Number),
                name: "newPet",
                age: "2",
                species: "pet",
                hunger: 10,
                description: "my new pet",
                userId: testUserIds[1],
            },
        });
        expect(res.statusCode).toEqual(201);
    });

    test("works: same user", async function () {
        const res = await request(app)
            .post(`/users/u1/pets`)
            .set("authorization", `Bearer ${u1Token}`)
            .send({
                name: "newPet",
                age: "2",
                species: "pet",
                hunger: 10,
                description: "my new pet",
                user_id: testUserIds[0],
            });
        expect(res.body).toEqual({
            pet: {
                id: expect.any(Number),
                name: "newPet",
                age: "2",
                species: "pet",
                hunger: 10,
                description: "my new pet",
                userId: testUserIds[0],
            },
        });
        expect(res.statusCode).toEqual(201);
    });

    test("unauth: different user", async function () {
        const res = await request(app)
            .post(`/users/u1/pets`)
            .set("authorization", `Bearer ${u2Token}`)
            .send({
                name: "newPet",
                age: "2",
                species: "pet",
                user_id: testUserIds[0],
            });
        expect(res.statusCode).toEqual(401);
    });

    test("unauth: non user", async function () {
        const res = await request(app).post(`/users/u1/pets`).send({
            name: "newPet",
            age: "2",
            species: "pet",
            user_id: testUserIds[0],
        });
        expect(res.statusCode).toEqual(401);
    });

    test("bad request: missing data", async function () {
        const res = await request(app)
            .post("/users/u1/pets")
            .set("authorization", `Bearer ${adminToken}`)
            .send({
                name: "newPet",
            });
        expect(res.statusCode).toEqual(400);
    });

    test("bad request: invalid data", async function () {
        const res = await request(app)
            .post("/users/u1/pets")
            .set("authorization", `Bearer ${adminToken}`)
            .send({
                name: "newPet",
                species: "pet",
                age: 23,
                user_id: testUserIds[0],
            });
        expect(res.statusCode).toEqual(400);
    });
});

/****************************************************** GET /pets */

describe("GET /pets", function () {
    test("works: admin", async function () {
        const res = await request(app)
            .get("/users/u1/pets")
            .set("authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            pets: [{pet_id: expect.any(Number), name: "p1", age: "1", species: "cat", hunger: 1,description: "pet 1", user_id: expect.any(Number) }],
        });
    });

    test("works: same user", async function () {
        const res = await request(app)
            .get("/users/u1/pets")
            .set("authorization", `Bearer ${u1Token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            pets: [{ pet_id: expect.any(Number), name: "p1", age: '1', species: "cat", hunger: 1, description: "pet 1", user_id: expect.any(Number) }],
        });
    });

    test("unauth: different user", async function () {
        const res = await request(app)
            .get("/users/u1/pets")
            .set("authorization", `Bearer ${u2Token}`);
        expect(res.statusCode).toEqual(401);
    });

    test("unauth: non user", async function () {
        const res = await request(app).get("/users/u1/pets");
        expect(res.statusCode).toEqual(401);
    });
});

/****************************************************** GET /pets/:id */

describe("GET /pets/:id", function () {
    test("works: admin", async function () {
        const res = await request(app)
            .get(`/users/u1/pets/${testPetIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            pet: {
                id: testPetIds[0],
                name: "p1",
                age: "1",
                species: "cat",
                hunger: 1,
                description: "pet 1",
                userId: testUserIds[0],
            },
        });
    });

    test("works: same user", async function () {
        const res = await request(app)
            .get(`/users/u1/pets/${testPetIds[0]}`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            pet: {
                id: testPetIds[0],
                name: "p1",
                age: "1",
                species: "cat",
                hunger: 1,
                description: "pet 1",
                userId: testUserIds[0],
            },
        });
    });

    test("unauth: different user", async function () {
        const res = await request(app)
            .get(`/users/u1/pets/${testPetIds[0]}`)
            .set("authorization", `Bearer ${u2Token}`);
        expect(res.statusCode).toEqual(401);
    });

    test("unauth: non user", async function () {
        const res = await request(app).get(`/users/u1/pets/${testPetIds[0]}`);
        expect(res.statusCode).toEqual(401);
    });

    test("not found: no such pet", async function () {
        const res = await request(app)
            .get(`/users/u1/pets/1111111`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
    });
});
/****************************************************** PATCH /pets/:id */

describe("PATCH /pets/:id", function () {
    test("works: admin", async function () {
        const res = await request(app)
            .patch(`/users/u1/pets/${testPetIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`)
            .send({
                name: "newName",
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            pet: {
                id: testPetIds[0],
                name: "newName",
                age: "1",
                species: "cat",
                hunger: 1,
                description: "pet 1",
                userId: testUserIds[0],
            },
        });
    });

    test("works: same user", async function () {
        const res = await request(app)
            .patch(`/users/u1/pets/${testPetIds[0]}`)
            .set("authorization", `Bearer ${u1Token}`)
            .send({
                name: "newName",
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            pet: {
                id: testPetIds[0],
                name: "newName",
                age: "1",
                species: "cat",
                hunger: 1,
                description: "pet 1",
                userId: testUserIds[0],
            },
        });
    });

    test("works: multiple inputs", async function () {
        const res = await request(app)
            .patch(`/users/u1/pets/${testPetIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`)
            .send({
                name: "newName",
                species: "turtle",
                age: "45",
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            pet: {
                id: testPetIds[0],
                name: "newName",
                age: "45",
                species: "turtle",
                hunger: 1,
                description: "pet 1",
                userId: testUserIds[0],
            },
        });
    });

    test("unauth: different user", async function () {
        const res = await request(app)
            .patch(`/users/u1/pets/${testPetIds[0]}`)
            .set("authorization", `Bearer ${u2Token}`)
            .send({
                name: "newName",
            });
        expect(res.statusCode).toEqual(401);
    });

    test("unauth: non user", async function () {
        const res = await request(app)
            .patch(`/users/u1/pets/${testPetIds[0]}`)
            .send({
                name: "newName",
            });
        expect(res.statusCode).toEqual(401);
    });

    test("bad request: invalid data", async function () {
        const res = await request(app)
            .patch(`/users/u1/pets/${testPetIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`)
            .send({
                species: 24,
            });
        expect(res.statusCode).toEqual(400);
    });

    test("bad request: no data", async function () {
        const res = await request(app)
            .patch(`/users/u1/pets/${testPetIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(400);
    });

    test("not found: no such pet", async function () {
        const res = await request(app)
            .patch(`/users/u1/pets/999999`)
            .set("authorization", `Bearer ${adminToken}`)
            .send({
                name: "newName",
            });
        expect(res.statusCode).toEqual(404);
    });
});

/****************************************************** DELETE /pets/:id */

describe("DELETE /pets/:id", function () {
    test("works: admin", async function () {
        const res = await request(app)
        .delete(`/users/u1/pets/${testPetIds[0]}`)
        .set("authorization", `Bearer ${adminToken}`)
        expect(res.body).toEqual({
            deleted: "p1"
        })
    })

    test("works: same user", async function () {
        const res = await request(app)
        .delete(`/users/u1/pets/${testPetIds[0]}`)
        .set("authorization", `Bearer ${u1Token}`)
        expect(res.body).toEqual({
            deleted: "p1"
        })
    })

    test("unauth: different user", async function () {
        const res = await request(app)
        .delete(`/users/u1/pets/${testPetIds[0]}`)
        .set("authorization", `Bearer ${u2Token}`)
        expect(res.statusCode).toEqual(401)
    })

    test("unauth: non user", async function () {
        const res = await request(app)
        .delete(`/users/u1/pets/${testPetIds[0]}`)
        expect(res.statusCode).toEqual(401)
    })

    test("not found: no such pet", async function () {
        const res = await request(app)
        .delete(`/users/u1/pets/999999999`)
        .set("authorization", `Bearer ${adminToken}`)
        expect(res.statusCode).toEqual(404)
    })
})