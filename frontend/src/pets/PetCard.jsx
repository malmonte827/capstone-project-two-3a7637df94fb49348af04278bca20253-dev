import React, {useContext, useState} from "react"
import {Link} from "react-router-dom"
import "./PetCard.css"
import CapstoneApi from "../api/CapstoneApi"
import UserContext from "../auth/UserContext"

/**
 * PetCard Component
 *
 * Displays the details of a pet, including its name, age, species, and hunger level.
 * Provides buttons to edit or delete the pet.
 *
 * Props:
 * - pet (object): The pet object containing pet details (pet_id, name, age, species, hunger).
 * - onDelete (function): A callback function to re-render the list after a pet is deleted.
 *
 * Context:
 * - currentUser (object): The logged-in user's information from UserContext.
 */

function PetCard({ pet, onDelete}){

  const {currentUser} = useContext(UserContext)
  const {pet_id, name, age, species, hunger} = pet

  /**
     * Handles the deletion of a pet.
     *
     * Makes an API call to delete the pet and triggers the onDelete callback if provided.
     */
  async function handleDelete(){
    try{
    await CapstoneApi.deletePet(currentUser.username, pet_id)
    if(onDelete){
      onDelete()
    }
    }catch(err){
      
    }
  }
return(

<div className="PetCard card">
  <div className="container">
    <div className="card">
      <div className="card-head">
        <div className="animal-detail">
          <h2>{pet_id}</h2>
          <img src="data:image/jpeg;base64,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" alt="Shiba inu" class="animal-img"/>
        </div>
      </div>
      <div className="card-body">
        <div className="animal-title">
          <h1>{species} <span className="badge"> DOG </span></h1>
        </div>
        <div className="animal-info">
          <h4>Info</h4>
          <ul>
            <li><span className="labels">Hunger Level:</span> {hunger}</li>
            <li><span className="labels">Age:</span> {age} years.</li>
          </ul>
        </div>

        <div className="mt-4">
                {/* Add Pet Button */}
                    <Link to="/pets/edit" state={{pet: pet}}className="btn btn-primary">
                        Edit
                    </Link>
                    <button onClick={handleDelete} className="btn btn-danger">
                        Delete
                    </button>
                </div>
                
        
      </div>
    </div>
  </div>
  </div>
)
}

export default PetCard