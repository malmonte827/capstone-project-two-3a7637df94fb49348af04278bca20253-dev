import React from "react"
import {Routes, Route, Navigate} from "react-router-dom"
import LoginForm from "../auth/LoginForm"
import SignupForm from "../auth/SignupForm"
import Homepage from "../homepage/Homepage"

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
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </div>
    )
}

export default RoutesList