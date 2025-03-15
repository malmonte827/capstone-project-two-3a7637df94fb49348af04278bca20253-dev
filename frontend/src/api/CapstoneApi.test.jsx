import { vi, expect, it, describe } from "vitest";
import axios from "axios";
import CapstoneApi from "./CapstoneApi";

vi.mock("axios");

describe("CapstoneApi", () => {
    const mockResponse = {
        data: {
            user: {
                username: "testuser",
                firstName: "John",
                lastName: "Doe",
            },
        },
    };

    it("should call axios with correct URL and return user data from getCurrentUser", async () => {
        axios.mockResolvedValue(mockResponse);

        const result = await CapstoneApi.getCurrentUser("testuser");

        expect(axios).toHaveBeenCalledWith({
            url: "http://localhost:3001/users/testuser",
            method: "get",
            data: {},
            params: {},
            headers: { Authorization: "Bearer undefined" },
        });

        expect(result).toEqual(mockResponse.data.user);
    });

    it("should handle API errors in getCurrentUser", async () => {
        axios.mockRejectedValue({
            response: {
                data: {
                    error: {
                        message: "User not found",
                    },
                },
            },
        });

        try {
            await CapstoneApi.getCurrentUser("testuser");
        } catch (error) {
            expect(error).toEqual(["User not found"]);
        }
    });
});
