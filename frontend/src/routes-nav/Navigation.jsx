import React, { useContext } from "react";
import UserContext from "../auth/UserContext";
import { Link, NavLink } from "react-router-dom";
import "./Navigation.css"

/** Navigation Component
 *
 * Displays the sites navigation bar on every page
 *
 * when a user is logged in it shows links to other areas of site
 * when not shows links to signup and login forms
 *
 */
function Navigation({ logout }) {
    const { currentUser } = useContext(UserContext);

 
 // Renders the navigation links for logged-in users
    function loggedInNav() {
        return (
            <ul className="navbar-nav ms-auto">
                <li className="nav-item me-4">
                    <NavLink className="nav-link" to="/pets">
                        Pets
                    </NavLink>
                </li>
                <li className="nav-item me-4">
                    <NavLink className="nav-link" to="/profile">
                        Profile
                    </NavLink>
                </li>
                <li className="nav-item me-4">
                    <NavLink className="nav-link" to="/" onClick={logout}>
                        Logout {currentUser.firstName || currentUser.username}
                    </NavLink>
                </li>
            </ul>
        );
    }
 // Renders the navigation links for logged-out users

    function loggedOutNav() {
        return (
            <ul className="navbar-nav ms-auto">
                <li className="nav-item me-4">
                    <NavLink className="nav-link" to="/login">
                        Login
                    </NavLink>
                </li>
                <li className="nav-item me-4">
                    <NavLink className="nav-link" to="/signup">
                        Signup
                    </NavLink>
                </li>
            </ul>
        );
    }

    return (
        <nav className="Navigation navbar navbar-expandd-md">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Capstone
                </Link>
                {currentUser ? loggedInNav() : loggedOutNav()}
            </div>
        </nav>
    );
}

export default Navigation;
