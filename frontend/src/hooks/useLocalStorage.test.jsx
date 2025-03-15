import { renderHook, act } from "@testing-library/react";
import useLocalStorage from "../hooks/useLocalStorage";

describe("useLocalStorage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("initializes with value from localStorage", () => {
        localStorage.setItem("testKey", JSON.stringify("storedValue"));

        const { result } = renderHook(() =>
            useLocalStorage("testKey", "defaultValue")
        );

        expect(result.current[0]).toBe("storedValue");
    });

    test("initializes with default value when no localStorage entry exists", () => {
        const { result } = renderHook(() =>
            useLocalStorage("testKey", "defaultValue")
        );

        expect(result.current[0]).toBe("defaultValue");
    });

    test("updates localStorage when state changes", () => {
        const { result } = renderHook(() =>
            useLocalStorage("testKey", "defaultValue")
        );

        act(() => {
            result.current[1]("newValue");
        });

        expect(localStorage.getItem("testKey")).toBe(
            JSON.stringify("newValue")
        );
    });

    test("removes item from localStorage when set to null", () => {
        localStorage.setItem("testKey", JSON.stringify("toBeRemoved"));

        const { result } = renderHook(() =>
            useLocalStorage("testKey", "defaultValue")
        );

        act(() => {
            result.current[1](null);
        });

        expect(localStorage.getItem("testKey")).toBe(null);
    });

    test("handles JSON parsing errors gracefully", () => {
        localStorage.setItem("testKey", "invalidJSON"); // Corrupted JSON

        const { result } = renderHook(() =>
            useLocalStorage("testKey", "defaultValue")
        );

        expect(result.current[0]).toBe("defaultValue");
    });
});
