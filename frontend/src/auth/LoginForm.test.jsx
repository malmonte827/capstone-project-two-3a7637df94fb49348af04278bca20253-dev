import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { expect, vi } from "vitest";
import LoginForm from "./LoginForm";

vi.mock("../common/Alert");

describe("<LoginForm />", () => {
    const mockLogin = vi.fn();

    beforeEach(() => {
        mockLogin.mockReset();
    });

    it("renders without crashing", () => {
        render(
            <MemoryRouter>
                <LoginForm login={mockLogin} />
            </MemoryRouter>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <LoginForm login={mockLogin} />
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("handles form input changes", () => {
        render(
            <MemoryRouter>
                <LoginForm login={mockLogin} />
            </MemoryRouter>
        );

        const usernameInput = screen.getByLabelText("Username");
        const passwordInput = screen.getByLabelText("Password");

        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });

        expect(usernameInput.value).toBe("testuser");
        expect(passwordInput.value).toBe("password123");
    });

    it("submits the form and calls login function", async () => {
        mockLogin.mockResolvedValueOnce();
        render(
            <MemoryRouter>
                <LoginForm login={mockLogin} />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText("Username"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByText("Submit"));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                username: "testuser",
                password: "password123",
            });
        });
    });
});
