import React from "react";
import PetCard from "./PetCard";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CapstoneApi from "../api/CapstoneApi";
import UserContext from "../auth/UserContext";
import { expect, vi } from "vitest";

vi.mock("../api/CapstoneApi");

describe("<PetCard/>", () => {
    const pet = {
        pet_id: 1,
        name: "Buddy",
        age: 5,
        species: "Dog",
        description: "Friendly golden retriever",
        hunger: 3,
    };
    const currentUser = { username: "testuser" };
    const onDelete = vi.fn();

    it("renders without crashing", () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <PetCard pet={pet} onDelete={onDelete} />
                </UserContext.Provider>
            </MemoryRouter>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <PetCard pet={pet} onDelete={onDelete} />
                </UserContext.Provider>
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    describe("Displays correct pet information", () => {
        it("renders pet details correctly", () => {
            render(
                <MemoryRouter>
                    <UserContext.Provider value={{ currentUser }}>
                        <PetCard pet={pet} onDelete={onDelete} />
                    </UserContext.Provider>
                </MemoryRouter>
            );

            expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
                "Buddy"
            );
            expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
                "Buddy"
            );
            expect(
                screen.getByText("Friendly golden retriever")
            ).toBeInTheDocument();
        });
    });

    describe("Handles delete functionality", () => {
        it("calls API and onDelete when delete button is clicked", async () => {
            CapstoneApi.deletePet.mockResolvedValueOnce({});
            render(
                <MemoryRouter>
                    <UserContext.Provider value={{ currentUser }}>
                        <PetCard pet={pet} onDelete={onDelete} />
                    </UserContext.Provider>
                </MemoryRouter>
            );

            const deleteButton = screen.getByText("Delete");
            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(CapstoneApi.deletePet).toHaveBeenCalledWith(
                    currentUser.username,
                    pet.pet_id
                );
                expect(onDelete).toHaveBeenCalled();
            });
        });
    });
});
