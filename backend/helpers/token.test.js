const jwt = require("jsonwebtoken")
const {SECRET_KEY} = require("../config")
const {createToken} = require("./token")

describe("createToken", function () {
    it("works: admin", function () {
        const token = createToken({username: "test", isAdmin: true})
        const payload = jwt.verify(token, SECRET_KEY)
        expect(payload).toEqual({
            iat: expect.any(Number),
            username: "test",
            isAdmin: true
        })
    })

    it("works: not admin", function () {
        const token = createToken({username: "test", isAdmin: false})
        const payload = jwt.verify(token, SECRET_KEY)
        expect(payload).toEqual({
            iat: expect.any(Number),
            username: "test",
            isAdmin: false
        })
    })

    it("works: default no admin", function () {
        const token = createToken({username: "test"})
        const payload = jwt.verify(token, SECRET_KEY)
        expect(payload).toEqual({
            iat: expect.any(Number),
            username: "test",
            isAdmin: false
        })
    })
})