import React from "react"
import {Routes, Route, Navigate} from "react-router-dom"
import LoginForm from "../auth/LoginForm"
import SignupForm from "../auth/SignupForm"
import Homepage from "../homepage/Homepage"
import PetsList from "../pets/PetsList"
import PetForm from "../pets/PetForm"
import ProfileForm from "../profile/ProfileForm"

/** RoutesList Component
 *
 * Defines the routes for the site
 * 
 * dynamically changes weather signed in or not
 */

function RoutesList({login, signup, currentUser}){
    return(
        <div className="pt-5">
            <Routes>
                {!currentUser &&
                <>
                <Route path="/login" element={<LoginForm login={login}/>}/>
                <Route path="/signup" element={<SignupForm signup={signup}/>}/>
                </>}
                <Route path="/" element={<Homepage/>}/>
                <Route path="/profile" element={<ProfileForm/>}/>
                <Route path="/pets/:id" element={<PetForm/>}/>
                <Route path="/pets" element={<PetsList/>}/>
                <Route path="/pets/add" element={<PetForm/>}/>
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </div>
    )
}

export default RoutesList