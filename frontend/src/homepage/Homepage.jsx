import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/UserContext";
import "./Homepage.css"

/** Homepage
 *
 * If the user is logged in, it greets them by their first name or username.
 * If the user is not logged in, it shows login and signup buttons.
 * 
 * Routes -> Homepage
 *
 * Routed at /
 */
function Homepage() {
    const { currentUser } = useContext(UserContext);

    return (
        <div className="Homepage">
            <div className="container text-center">
                <h1 className="mb-4 fw-bold">Capstone</h1>
                <p className="lead">
                    This is my Capstone project hope you like it!
                </p>
                {currentUser ? (
                    <h2>
                        Welcome Back,{" "}
                        {currentUser.firstName || currentUser.username}
                    </h2>
                ) : (
                    <p>
                        <Link
                            className="btn btn-primary fw-bold me-3"
                            to="/login"
                        >
                            Login
                        </Link>
                        <Link
                            className="btn btn-primary fw-bold me-3"
                            to="/signup"
                        >
                            Signup
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}
export default Homepage
