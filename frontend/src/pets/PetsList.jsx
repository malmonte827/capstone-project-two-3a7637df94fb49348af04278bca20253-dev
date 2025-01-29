import React, { useState, useEffect, useContext } from "react";
import CapstoneApi from "../api/CapstoneApi";
import PetCard from "./PetCard";
import LoadingSpinner from "../common/LoadingSpinner";
import UserContext from "../auth/UserContext";
import PetForm from "./PetForm"
import { Link } from "react-router-dom";

/**
 * PetList Component
 *
 * Displays a list  of all the users pets
 * Provides buttons to edit or delete the pet.
 *
 * Props:
 * - pet (object): The pet object containing pet details (pet_id, name, age, species, hunger).
 * - onDelete (function): A callback function to re-render the list after a pet is deleted.
 *
 * Context:
 * - currentUser (object): The logged-in user's information from UserContext.
 */

function PetList() {
    const { currentUser } = useContext(UserContext);
    const [pets, setPets] = useState(null);
    const [error, setError] = useState(null);

     // Fetches the user's pets on mount.
    useEffect(() => {
        getPets()
    }, [])

 /**
     * Retrieves pets from the API.
     * Updates state with the list of pets or handles errors.
     */
        async function getPets() {
            try{
        let pets = await CapstoneApi.getPets(currentUser.username);
        setPets(pets);
        setError(null)
            }catch(err){
                console.error("Error getting pets", err)
                setError(err)
            }
    }

    if (!pets) return <LoadingSpinner />;

    return (
        <div className="PetsList col-md-8 offset-md-2">
            {pets.length ? (
                <div className="PetsList-list">
                    {pets.map((p) => (
                        <PetCard
                            pet={p}
                            key={p.pet_id}
                            onDelete={getPets}
                        />
                    ))}
                </div>
            ) : (
                <p className="lead">Sorry, no pets were found!</p>
                
    
            )}
        <div>
            <button><Link to="/pets/add">Click to add pet</Link></button>
            
        </div>
        </div>
    );
}
export default PetList;
