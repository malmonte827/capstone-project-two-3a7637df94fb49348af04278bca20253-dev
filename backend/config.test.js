'use strict'

describe('config can come from env', function(){
    const originalEnv = process.env

    beforeEach(function (){
        jest.resetModules()
        process.env = {
            ...originalEnv,
            NODE_ENV: "testNODE_ENV",
            DATABASE_URL: 'testdbURL',
            PORT: 1234,
            SECRET_KEY: 1234
          };
    
    })
    afterEach(function () {
        process.env = originalEnv
    })

    it('works', function () {
        const config = require('./config')
        expect(config.getDatabaseUri()).toEqual('testdbURL')
        expect(config.PORT).toEqual(1234)
        expect(config.SECRET_KEY).toEqual(1234)
        expect(config.BCRYPT_WORK_FACTOR).toEqual(12);


        process.env.NODE_ENV = "test";
        expect(config.getDatabaseUri()).toEqual('capstone_test')
        


    })
})