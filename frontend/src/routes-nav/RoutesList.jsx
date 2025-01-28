import React from "react"
import {Routes, Route, Navigate} from "react-router-dom"
import LoginForm from "auth/LoginForm"
import SignupForm from "auth/SignupForm"

function RoutesList(login, signup, currentUser){
    returns(
        <div className="pt-5">
            <Routes>
                {!currentUser &&
                <>
                <Route path="/signup" element={<LoginForm login={login}/>}/>
                <Route path="/login" element={<SignupForm signup={signup}/>}/>
                </>}
                <Route path="/" element={<Homepage/>}/>
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </div>
    )
}

export default RoutesList