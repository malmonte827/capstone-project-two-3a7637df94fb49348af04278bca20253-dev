import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ProfileForm from "./ProfileForm";
import UserContext from "../auth/UserContext";

describe("<ProfileForm />", () => {
    const currentUser = {
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phoneNumber: "123-456-7890",
    };
    const setCurrentUser = vi.fn();

    it("renders without crashing", () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser, setCurrentUser }}>
                    <ProfileForm />
                </UserContext.Provider>
            </MemoryRouter>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser, setCurrentUser }}>
                    <ProfileForm />
                </UserContext.Provider>
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("allows user to update profile fields", () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser, setCurrentUser }}>
                    <ProfileForm />
                </UserContext.Provider>
            </MemoryRouter>
        );

        const firstNameInput = screen.getByLabelText("First Name");
        fireEvent.change(firstNameInput, { target: { value: "Updated" } });
        expect(firstNameInput.value).toBe("Updated");
    });
});
