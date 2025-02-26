"use strict";

/** Express app for capstone. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const {authenticateJWT} = require("./middleware/auth")
const usersRoutes = require("./routes/users")
const petsRoutes = require("./routes/pets")
const authRoutes = require("./routes/auth")
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes)
app.use("/users", usersRoutes)
app.use("/users/:username/pets", petsRoutes)
app.use(authenticateJWT)


/** Handle 404 errors -- mathces everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;
