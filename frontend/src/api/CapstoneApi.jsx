import axios from "axios";

// Base URL for the backend, if enviorment not set use localhost
const BASE_URL = process.env.BACKEND_URL || "http://localhost:3001";

/**  API class to interact with the backend
 *
 * Uses static classes to send requests to the API
 */

class CapstoneApi {
    // token for authenticating requests with the API
    static token;

    /**
     * Makes an API request to a specific endpoint
     * Handles headers, query parameters, and request body based on the HTTP method
     *
     * @param {string} endpoint - The API endpoint ("users/username")
     * @param {object} data - The request payload (default is an empty object)
     * @param {string} method - The HTTP method (e.g., "get", "post", "patch", "delete")
     * @returns {Promise<object>} - The response data from the API
     * @throws {Array<string>} - Throws an array of error messages if the request fails
     */

    static async request(endpoint, data = {}, method = "get") {
        console.debug(`API Call:`, endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${CapstoneApi.token}` };
        const params = method === "get" ? data : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error(`API Error:`, err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    /********************************************************************************** API ROUTES */

    /**
     * Get the current user's information.
     *
     * @param {string} username - The username of the user.
     * @returns {Promise<object>} - The user's data.
     *
     */
    static async getCurrentUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    /**
     * Register a new user (signup).
     *
     * @param {object} data - The registration data (username, password, firstName, LastName, email, phoneNumber).
     * @returns {Promise<string>} - The authentication token for the new user.
     */
    static async signup(data) {
        let res = await this.request(`auth/register`, data, "post");
        return res.token;
    }

    /**
     * Log in an existing user.
     *
     * @param {object} data - The login data ( username, password).
     * @returns {Promise<string>} - The authentication token for the user.
     */
    static async login(data) {
        const res = await this.request(`auth/token`, data, "post");
        return res.token;
    }

    /**
     * Get all pets associated with a specific user.
     *
     * @param {string} username - The username of the user.
     * @returns {Promise<Array<object>>} - A list of the user's pets.
     */
    static async getPets(username) {
        const res = await this.request(`users/${username}/pets`);
        return res.pets;
    }

    /**
     * Create a new pet for a user.
     *
     * @param {string} username - The username of the user.
     * @param {object} petData - The details of the pet to create ( name, species, age).
     * @returns {Promise<object>} - The created pet's data.
     */
    static async createPet(username, petData) {
        const res = await this.request(
            `users/${username}/pets`,
            petData,
            "post"
        );
        return res.pet;
    }

    /**
     * Update an existing pet's information.
     *
     * @param {string} username - The username of the user.
     * @param {number} petId - The ID of the pet to update.
     * @param {object} petData - The updated pet data.
     * @returns {Promise<object>} - The updated pet's data.

     */
    static async updatePet(username, petId, petData) {
        const res = await this.request(
            `users/${username}/pets/${petId}`,
            petData,
            "patch"
        );
        return res.pet
    }

    /**
     * Delete a pet associated with a user.
     *
     * @param {string} username - The username of the user.
     * @param {number} petId - The ID of the pet to delete.
     * @returns {Promise<boolean>} - True if the pet was successfully deleted.
     */
    static async deletePet(username, petId) {
        const res = await this.request(
            `users/${username}/pets/${petId}`,
            {},
            "delete"
        );
        return res.deleted;
    }

    /**
     * Update the user's profile information.
     *
     * @param {string} username - The username of the user.
     * @param {object} data - The updated profile data (firstName, lastName).
     * @returns {Promise<object>} - The updated user data.
     */
    static async saveProfile(username, data) {
        const res = await this.request(`users/${username}`, data, "patch");
        return res.user;
    }
}

export default CapstoneApi;
