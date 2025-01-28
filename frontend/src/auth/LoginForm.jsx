import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../common/Alert"

/** Login Form
 *
 * Shows form and handles update sto state on changes
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

    /** Handles updating form fields on change */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData((data) => ({ ...data, [name]: value }));
    }

    /** handles form submition
     *
     * If succesful calls signup prop function and if not sets error
     */
    async function handleSubmit(evt) {
        evt.preventDefault();
        try {
            await login(formData);
            navigate("/");
        } catch (err) {
            setFormErrors(err);
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
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
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
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
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
