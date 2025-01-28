import React, { useEffect, useState } from "react";
import decode from "jwt-decode";
import CapstoneApi from "./api/CapstoneApi";
import useLocalStorage from "./hooks/useLocalStorage";
import LoadingSpinner from "./common/LoadingSpinner";
import UserContext from "./auth/UserContext";
import Navigation from "./routes-nav/Navigation";
import RoutesList from "./routes-nav/RoutesList";

/** Capstone application
 *
 *  - currentUser: user obj from API
 *   The way to tell if someone is logged in
 *   Passed around using context throughout the app
 *   - data: the current users data
 *   - infoLoaded: has that data been pulled from the API
 *
 * - token: for logged in users
 *  this is their authentication JWT.
 *
 * App -> Routes
 */
function App() {
    const [currentUser, setCurrentUser] = useState({
        data: null,
        infoLoaded: false,
    });

    const [token, setToken] = useLocalStorage("capstone-token");

    // Loads user info from api
    // Only runs when a user is logged in and has a token

    useEffect(
        function loadUserInfo() {
            async function getCurrentUser() {
                if (token) {
                    try {
                        let { username } = decode(token);
                        CapstoneApi.token = token;
                        let currentUser = await CapstoneApi.getCurrentUser(
                            username
                        );

                        setCurrentUser({
                            data: currentUser,
                            infoLoaded: true,
                        });
                    } catch (err) {
                        setCurrentUser({
                            data: null,
                            infoLoaded: true,
                        });
                    }
                } else {
                    setCurrentUser({
                        data: null,
                        infoLoaded: true,
                    });
                }
            }
            getCurrentUser;
        },
        [token]
    );

    if (!currentUser.infoLoaded) return <LoadingSpinner />;

    /** Handles signing up users
     *
     * Automatically logs in user after signup
     */
    async function signup(signupData) {
        const token = await CapstoneApi.signup(signupData);
        setToken(token);
    }

    /** Handles loging in users*/
    async function login(loginData) {
        const token = await CapstoneApi.login(loginData);
        setToken(token);
    }

    /** Handles loging out */
    async function logout() {
        setCurrentUser({
            data: null,
            infoLoaded: true,
        });
        setToken(null);
    }

    returns(
        <UserContext.Provider
            value={{
                currentUser: currentUser.data,
                setCurrentUser,
            }}
        >
            <div className="App">
                <Navigation logout={logout} />
                <RoutesList
                    currentUser={currentUser.data}
                    login={login}
                    signup={signup}
                />
            </div>
        </UserContext.Provider>
    );
}

export default App;
