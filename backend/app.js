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
const corsOptions = {
    origin: "*", // Allow all domains (adjust as needed for security)
    methods: "GET,POST,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes)
app.use("/users", usersRoutes)
app.use("/users", petsRoutes)
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

console.log("Registered Routes:");
app._router.stack.forEach((middleware) => {
    if (middleware.route) { // Routes registered directly
        console.log(middleware.route.path);
    } else if (middleware.name === 'router') { // Routes in other files
        middleware.handle.stack.forEach((route) => {
            if (route.route) {
                console.log(route.route.path);
            }
        });
    }
});

module.exports = app;
