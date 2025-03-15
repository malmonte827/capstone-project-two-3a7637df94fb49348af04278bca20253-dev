import React from "react";
import Navigation from "./Navigation";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserContext from "../auth/UserContext";
import { vi } from "vitest";

describe("<Navigation />", () => {
    const logout = vi.fn();

    describe("When the user is logged in", () => {
        const currentUser = { firstName: "John", username: "john_doe" };

        it("renders without crashing", () => {
            render(
                <MemoryRouter>
                    <UserContext.Provider value={{ currentUser }}>
                        <Navigation />
                    </UserContext.Provider>
                </MemoryRouter>
            );
        });

        it("matches snapshot", () => {
            const currentUser = { firstName: "John", username: "john_doe" };
            const { asFragment } = render(
                <MemoryRouter>
                    <UserContext.Provider value={{ currentUser }}>
                        <Navigation logout={logout} />
                    </UserContext.Provider>
                </MemoryRouter>
            );
            expect(asFragment()).toMatchSnapshot();
        });

        it("renders the logged-in navigation links", () => {
            render(
                <MemoryRouter>
                    <UserContext.Provider value={{ currentUser }}>
                        <Navigation logout={logout} />
                    </UserContext.Provider>
                </MemoryRouter>
            );

            expect(screen.getByText("Pets")).toBeInTheDocument();
            expect(screen.getByText("Profile")).toBeInTheDocument();
            expect(screen.getByText(`Logout John`)).toBeInTheDocument();
        });

        it("calls logout when the logout link is clicked", () => {
            render(
                <MemoryRouter>
                    <UserContext.Provider value={{ currentUser }}>
                        <Navigation logout={logout} />
                    </UserContext.Provider>
                </MemoryRouter>
            );

            const logoutLink = screen.getByText(`Logout John`);
            fireEvent.click(logoutLink);

            expect(logout).toHaveBeenCalled();
        });
    });

    describe("When the user is logged out", () => {
        it("renders the logged-out navigation links", () => {
            render(
                <MemoryRouter>
                    <UserContext.Provider value={{ currentUser: null }}>
                        <Navigation logout={logout} />
                    </UserContext.Provider>
                </MemoryRouter>
            );

            expect(screen.getByText("Login")).toBeInTheDocument();
            expect(screen.getByText("Signup")).toBeInTheDocument();
        });
    });
});
