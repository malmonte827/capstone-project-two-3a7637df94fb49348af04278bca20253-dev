import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { expect, vi } from "vitest";
import PetForm from "./PetForm";
import UserContext from "../auth/UserContext";
import CapstoneApi from "../api/CapstoneApi";

vi.mock("../api/CapstoneApi");

describe("<PetForm />", () => {
    const currentUser = { username: "testuser", id: 1 };

    it("renders without crashing", () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <PetForm />
                </UserContext.Provider>
            </MemoryRouter>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <PetForm />
                </UserContext.Provider>
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("handles form input changes", () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <PetForm />
                </UserContext.Provider>
            </MemoryRouter>
        );

        const nameInput = screen.getByLabelText("Name");
        fireEvent.change(nameInput, { target: { value: "Fluffy" } });
        expect(nameInput.value).toBe("Fluffy");
    });

    it("submits the form and calls createPet API", async () => {
        CapstoneApi.createPet.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <PetForm />
                </UserContext.Provider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText("Name"), {
            target: { value: "Fluffy" },
        });
        fireEvent.change(screen.getByLabelText("Species"), {
            target: { value: "Cat" },
        });
        fireEvent.change(screen.getByLabelText("Age"), {
            target: { value: "2" },
        });
        fireEvent.change(screen.getByLabelText("Hunger"), {
            target: { value: "5" },
        });
        fireEvent.change(screen.getByLabelText("Description"), {
            target: { value: "A cute cat" },
        });

        fireEvent.click(screen.getByText("Submit"));

        await waitFor(() => {
            expect(CapstoneApi.createPet).toHaveBeenCalledWith("testuser", {
                name: "Fluffy",
                species: "Cat",
                age: "2",
                hunger: 5,
                description: "A cute cat",
                user_id: 1,
            });
        });
    });

    it("handles API errors and displays an alert", async () => {
        CapstoneApi.createPet.mockRejectedValueOnce(["Error creating pet"]);

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currentUser }}>
                    <PetForm />
                </UserContext.Provider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Submit"));

        await waitFor(() => {
            expect(screen.getByText("Error creating pet")).toBeInTheDocument();
        });
    });
});
