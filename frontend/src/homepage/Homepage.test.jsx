import React from "react";
import Homepage from "./Homepage";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserContext from "../auth/UserContext";

describe("<Homepage />", () => {
    const currentUser = { firstName: "John", username: "john_doe" };

    it("renders without crashing", () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <Homepage />
                </UserContext.Provider>
            </MemoryRouter>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <Homepage />
                </UserContext.Provider>
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    describe("Displays correct user information", () => {
        it("greets the logged-in user", () => {
            render(
                <MemoryRouter>
                    <UserContext.Provider value={{ currentUser }}>
                        <Homepage />
                    </UserContext.Provider>
                </MemoryRouter>
            );

            expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
                "Welcome Back, John"
            );
        });

        it("shows login and signup buttons if no user is logged in", () => {
            render(
                <MemoryRouter>
                    <UserContext.Provider value={{ currentUser: null }}>
                        <Homepage />
                    </UserContext.Provider>
                </MemoryRouter>
            );

            expect(
                screen.getByRole("link", { name: /Login/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("link", { name: /Signup/i })
            ).toBeInTheDocument();
        });
    });

    describe("Displays success message", () => {
        it("shows success message if passed in location state", () => {
            const successMessage = "Your action was successful!";
            render(
                <MemoryRouter
                    initialEntries={[{ state: { message: successMessage } }]}
                >
                    <UserContext.Provider value={{ currentUser }}>
                        <Homepage />
                    </UserContext.Provider>
                </MemoryRouter>
            );

            expect(screen.getByText(successMessage)).toBeInTheDocument();
        });

        it("does not show success message if no message is passed", () => {
            render(
                <MemoryRouter>
                    <UserContext.Provider value={{ currentUser }}>
                        <Homepage />
                    </UserContext.Provider>
                </MemoryRouter>
            );

            expect(
                screen.queryByText(/Your action was successful!/)
            ).not.toBeInTheDocument();
        });
    });
});
