import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { expect, vi } from "vitest";
import PetsList from "./PetsList";
import UserContext from "../auth/UserContext";
import CapstoneApi from "../api/CapstoneApi";

vi.mock("../api/CapstoneApi");

describe("<PetList />", () => {
    const currentUser = { username: "testuser" };
    const pets = [
        { pet_id: 1, name: "Buddy", age: 5, species: "Dog", hunger: 3 },
        { pet_id: 2, name: "Mittens", age: 3, species: "Cat", hunger: 5 },
    ];

    it("renders without crashing", () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <PetsList />
                </UserContext.Provider>
            </MemoryRouter>
        );
    });

    it("matches snapshot", async () => {
        CapstoneApi.getPets.mockResolvedValueOnce(pets);

        const { asFragment } = render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <PetsList />
                </UserContext.Provider>
            </MemoryRouter>
        );
        await waitFor(() =>
            expect(screen.getAllByText("Buddy").length).toBeGreaterThan(0)
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders pet cards when pets are available", async () => {
        CapstoneApi.getPets.mockResolvedValueOnce(pets);

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <PetsList />
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Buddy").length).toBeGreaterThan(0);
            expect(screen.getAllByText("Mittens").length).toBeGreaterThan(0);
        });
    });

    it("shows message when no pets are found", async () => {
        CapstoneApi.getPets.mockResolvedValueOnce([]);

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <PetsList />
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(
                screen.getByText("Sorry, no pets were found!")
            ).toBeInTheDocument();
        });
    });
});
