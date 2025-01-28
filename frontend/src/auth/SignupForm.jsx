import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../common/Alert"

/** Signup Form
 *
 * Shows form and handles update sto state on changes
 *
 * onSubmit calls signup function prop
 *
 * Routes -> SignuForm -> Alert
 * Routed as /signup
 */

function SignupForm({ signup }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
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
            await signup(formData);
            navigate("/");
        } catch (err) {
            setFormErrors(err);
        }
    }

    return (
        <div className="SignupForm">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h2 className="mb-3">Sign Up</h2>
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
                                    autoComplete="username"
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
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="firstName"
                                >
                                    First Name
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="lastName"
                                >
                                    Last Name
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="phoneNumber"
                                >
                                    Phone Number
                                </label>
                                <input
                                    className="form-control"
                                    type="tel"
                                    name="username"
                                    value={formData.phoneNumber}
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

export default SignupForm;
