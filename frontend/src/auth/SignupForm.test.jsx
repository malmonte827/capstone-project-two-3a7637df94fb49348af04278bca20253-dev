import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { expect, vi } from "vitest";
import SignupForm from "./SignupForm";

vi.mock("../common/Alert");

describe("<SignupForm />", () => {
    const mockSignup = vi.fn();

    beforeEach(() => {
        mockSignup.mockReset();
    });

    it("renders without crashing", () => {
        render(
            <MemoryRouter>
                <SignupForm signup={mockSignup} />
            </MemoryRouter>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <SignupForm signup={mockSignup} />
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("handles form input changes", () => {
        render(
            <MemoryRouter>
                <SignupForm signup={mockSignup} />
            </MemoryRouter>
        );

        const usernameInput = screen.getByLabelText("Username");
        const passwordInput = screen.getByLabelText("Password");
        const firstNameInput = screen.getByLabelText("First Name");
        const lastNameInput = screen.getByLabelText("Last Name");
        const emailInput = screen.getByLabelText("Email");
        const phoneInput = screen.getByLabelText("Phone Number");

        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(firstNameInput, { target: { value: "John" } });
        fireEvent.change(lastNameInput, { target: { value: "Doe" } });
        fireEvent.change(emailInput, {
            target: { value: "johndoe@example.com" },
        });
        fireEvent.change(phoneInput, { target: { value: "123-456-7890" } });

        expect(usernameInput.value).toBe("testuser");
        expect(passwordInput.value).toBe("password123");
        expect(firstNameInput.value).toBe("John");
        expect(lastNameInput.value).toBe("Doe");
        expect(emailInput.value).toBe("johndoe@example.com");
        expect(phoneInput.value).toBe("123-456-7890");
    });

    it("submits the form and calls signup function", async () => {
        mockSignup.mockResolvedValueOnce();

        render(
            <MemoryRouter>
                <SignupForm signup={mockSignup} />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText("Username"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.change(screen.getByLabelText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.change(screen.getByLabelText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "johndoe@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Phone Number"), {
            target: { value: "123-456-7890" },
        });

        fireEvent.click(screen.getByText("Submit"));

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalledWith({
                username: "testuser",
                password: "password123",
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@example.com",
                phoneNumber: "123-456-7890",
            });
        });
    });
});
