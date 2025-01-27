import React, {useEffect, useState} from "react"
import decode from "jwt-decode"
import CapstoneApi from "./api/CapstoneApi"



/** Capstone application
 *
 *  - currentUser: user obj from API
 *   The way to tell if someone is logged in
 *   Passed around using context throughout the app
 *   - data: the current users data
 *   - infoLoaded: has that data been pulled from the API
 *
 * - token: for logged in users 
 *  this is their authentication JWT.
 *
 * App -> Routes
 */
function App() {

    const [currentUser, setCurrentUser] = useState({
        data: null,
        infoLoaded: false
    })

    const [token, setToken] = useLocalStorage("capstone-token")

// Loads user info from api
// Only runs when a user is logged in and has a token

    useEffect(
        function loadUserInfo(){
            async function getCurrentUser(){
                if(token){
                    try{
                        let {username} = decode(token)
                        CapstoneApi.token = token
                        let currentUser = await CapstoneApi.getCurrentUser(username)

                        setCurrentUser({
                            data: currentUser,
                            infoLoaded: true
                        })
                    }catch(err){
                        setCurrentUser({
                            data: null,
                            infoLoaded: true
                        })
                    }
                }else{
                    setCurrentUser({
                        data: null,
                        infoLoaded: true
                    }) 
                }

            }
            getCurrentUser
        }, [token]
    )

    returns(<></>);
}

export default App