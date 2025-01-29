import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../common/Alert"
import "./LoginForm.css"

/** Login Form
 *
 * Shows form and handles updates to state on changes
 *
 * onSubmit calls login function prop
 *
 * Routes -> LoginForm -> Alert
 * Routed as /login
 */

function LoginForm({ login }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [formErrors, setFormErrors] = useState([]);

    const navigate = useNavigate()

    /** 
     * Handles form input changes.
     * Updates the corresponding form field in state.
     *
     * @param {Object} evt - Event object from input field change.
     */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData((data) => ({ ...data, [name]: value }));
    }

    /** 
     * Handles form submission.
     *
     * Calls the login function prop with form data.
     * If login is successful, navigates the user to the homepage.
     * If login fails, catches the error and updates `formErrors` state.
     *
     * @param {Object} evt - Form submission event.
     */
    async function handleSubmit(evt) {
        evt.preventDefault();
        try {
            await login(formData);
            navigate("/");
        } catch (err) {
            const errors = Array.isArray(err) ? err : [err.message || "An error occurred"];
            setFormErrors(errors);
        }
    }

    return (
        <div className="LoginForm">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h3 className="mb-3">Login</h3>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="username"
                                >
                                    Username
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <input
                                    className="form-control"
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required

                                />
                            </div>

                            {formErrors.length ? (
                                <Alert type="danger" messages={formErrors} />
                            ) : null}
                            <div className="d-grid">
                                <button className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
