import axios from "axios"

const BASE_URL = process.env.React_APP_BASE_URL || "http://localhost:3001"

/** APi class
 * 
 * Staic class to get/send to the API
 */

class CapstoneApi{
    // token for interacting with the API
    static token

    static async request(endpoint, data={}, method="get"){
        console.debug(`API Call:`, endpoint, data, method)

        const url = `${BASE_URL}/${endpoint}`
        const headers = {Authorization: `Bearer ${CapstoneApi.token}`}
        const params = (method === "get") ? data : {}

        try{
            return (await axios({url, method, data, params,headers})).data
        }catch(err){
            console.error(`API Error:`, err.response)
            let message = err.response.data.error.message
            throw Array.isArray(message) ? message : [message]
        }
    }

    /** API ROUTES */

    /** Get the current user */

    static async getCurrentUser(username){
        let res = await this.request(`/users/${username}`)
        return res.user
    }

/** Signup User */
    static async signup(data){
        let res = await this.request(`/auth/register`, data, "post")
        return res.token
    }

    /** Login User */
    static async login(data){
        const res = await this.request(`/auth/token`, data, "post")
        return res.token
    }
}

export default CapstoneApi