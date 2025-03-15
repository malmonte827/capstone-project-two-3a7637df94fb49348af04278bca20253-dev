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
  const {pet_id, name, age, species, description, hunger} = pet

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
          <h2>{name}</h2>
          <img src="../image/download.jpg" alt="Pet Image" className="animal-img"/>
        </div>
      </div>
      <div className="card-body">
        <div className="animal-title">
          <h1>{name} <span className="badge"> {species} </span></h1>
        </div>
        <div className="animal-info">
          <h4>Info</h4>
          <ul>
            <li><span className="labels">Hunger Level:</span> {hunger}</li>
            <li><span className="labels">Age:</span> {age} years.</li>
          </ul>
        </div>
        <div className="animal-description">
          <h4>Description</h4>
          <p>{description}</p>   
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