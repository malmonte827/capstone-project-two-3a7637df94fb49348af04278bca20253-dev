import React, { useState, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Alert from "../common/Alert"
import "./PetForm.css"
import CapstoneApi from "../api/CapstoneApi";
import UserContext from "../auth/UserContext";

/**  PetForm Component
 *
 * Handles adding a new pet or updating an exsisting pets info 
 * 
 */

function PetForm() {
    const location = useLocation()
    const {pet} = location.state || {}
    const {currentUser} = useContext(UserContext)

    const [formData, setFormData] = useState({
        name: pet ? pet.name :  "",
        age: pet ? pet.age :  "",
        species: pet ? pet.species :  "",
        hunger: pet ? pet.hunger :  ""
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
     * If a pet exists updates the pets info via an udatePet call
     * If no pet exists it creates a new pet via createPet call
     * Redirects to /pets upon success.
     *
     * @param {Object} evt - Form submission event.
     */
    async function handleSubmit(evt) {
        evt.preventDefault();
        try {
            if(pet){
                console.log("in update")
                await CapstoneApi.updatePet(currentUser.username, pet.pet_id, formData)
                navigate("/pets")
            }else{
                
                console.log("in create")
                const updatedFormData = {...formData, user_id:currentUser.id}
                console.log(updatedFormData)
                await CapstoneApi.createPet(currentUser.username, updatedFormData);
                navigate("/pets");
            }
        } catch (err) {
            setFormErrors(err);
        }
    }

    return (
        <div className="PetForm">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h2 className="mb-3">{ pet ? "Edit Pet" : "Add Pet"}</h2>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="name"
                                >
                                    Name
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="species"
                                >
                                    Species
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="species"
                                    name="species"
                                    value={formData.species}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="age"
                                >
                                    Age
                                </label>
                                <input
                                    className="form-control"
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="hunger"
                                >
                                    Hunger
                                </label>
                                <input
                                    className="form-control"
                                    type="int"
                                    id="hunger"
                                    name="hunger"
                                    value={formData.hunger}
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

export default PetForm;
