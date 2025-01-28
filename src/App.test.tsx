import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

describe("App", () => {
  it("renders headline", () => {
    render(<App />);
    expect(screen.getByText("Vite + React")).toBeInTheDocument();
  });

  it("renders logos", () => {
    render(<App />);
    expect(screen.getByAltText("Vite logo")).toBeInTheDocument();
    expect(screen.getByAltText("React logo")).toBeInTheDocument();
  });

  it("updates count when button is clicked", () => {
    render(<App />);
    const button = screen.getByRole("button");

    // Initial state
    expect(button.textContent).toContain("count is 0");

    // Click the button
    fireEvent.click(button);

    // Count should increase by 1 as per your implementation
    expect(button.textContent).toContain("count is 1");
  });
});
