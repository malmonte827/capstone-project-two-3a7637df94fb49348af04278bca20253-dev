import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("<LoadingSpinner />", () => {
    it("renders without crashing", () => {
        render(<LoadingSpinner />);
    });

    it("matches snapshot", () => {
        const { asFragment } = render(<LoadingSpinner />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders the spinner", () => {
        render(<LoadingSpinner />);

        const spinner = screen.getByRole("status");
        expect(spinner).toBeInTheDocument();

        expect(spinner).toHaveClass("spinner-border");
    });

    it("has a visually hidden loading text", () => {
        render(<LoadingSpinner />);

        const hiddenText = screen.getByText(/loading.../i);
        expect(hiddenText).toHaveClass("visually-hidden");
    });
});
