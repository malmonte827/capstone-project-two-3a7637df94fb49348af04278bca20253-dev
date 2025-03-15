import React from "react";
import Alert from "./Alert";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("<Alert />", () => {
    it("renders without crashing", () => {
        render(<Alert />);
    });

    it("matches snapshot", () => {
        const { asFragment } = render(<Alert />);
        expect(asFragment()).toMatchSnapshot();
    });

    describe("Displays messages correctly", () => {
        it("displays the correct message when messages array is passed", () => {
            const messages = ["Error occurred!", "Please try again."];
            render(<Alert messages={messages} />);

            messages.forEach((msg) => {
                expect(screen.getByText(msg)).toBeInTheDocument();
            });
        });
    });
});
