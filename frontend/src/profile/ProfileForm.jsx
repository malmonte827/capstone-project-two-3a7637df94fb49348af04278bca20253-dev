import React, { useState, useContext } from "react";
import Alert from "../common/Alert";
import CapstoneApi from "../api/CapstoneApi";
import UserContext from "../auth/UserContext"

/**
 * ProfileForm Component
 *
 * Displays and allows the user to update their profile information
 * Users can update their first name, last name, email, and password
 *
 * Context:
 * - currentUser (object): The logged-in user's information from UserContext
 * - setCurrentUser: Updates the user's data throughout the site

 */

function ProfileForm() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    username: currentUser.username,
    phoneNumber: currentUser.phoneNumber,
    password: ""
  });
  const [formErrors, setFormErrors] = useState([]);

  const [saveConfirmed, setSaveConfirmed] = useState(false);


  /**
   * Handles form submission to update user profile.
   *
   * Sends the updated profile data (except username) to the API.
   * If successful updates the user context and clears errors.
   *
   * @param {Object} evt - The form submission event.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();

    let profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    };

    let username = formData.username;
    let updatedUser;

    try {
      updatedUser = await CapstoneApi.saveProfile(username, profileData);
      console.log(updatedUser)
    } catch (errors) {
      setFormErrors(errors);
      return;
    }

    setFormData(f => ({ ...f }));
    setFormErrors([]);
    setSaveConfirmed(true);

    // trigger reloading of user information throughout the site
    setCurrentUser(currentUser => ({
      ...currentUser,
      data: updatedUser
    }));
  }

   /**
   * Handles input field changes and updates the form state.
   * Clears previous errors when user modifies a field.
   *
   * @param {Object} evt - The event object from an input field.
   */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(f => ({
      ...f,
      [name]: value,
    }));
    setFormErrors([]);
  }

  return (
    <div className="ProfileForm col-md-6 col-lg-4 offset-md-3 offset-lg-4">
      <h3>Profile</h3>
      <div className="card">
        <div className="card-body">
          <form>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                disabled
                className="form-control"
                placeholder={formData.username}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                name="firstName"
                className="form-control"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                name="lastName"
                className="form-control"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {formErrors.length
              ? <Alert type="danger" messages={formErrors} />
              : null}

            {saveConfirmed
              ?
              <Alert type="success" messages={["Updated successfully."]} />
              : null}

            <div className="d-grid">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Save Changes
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;
