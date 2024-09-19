// Spinner.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from 'vitest';
import Spinner from "../../../src/components/common/Spinner";

describe("Spinner Component", () => {
  it("renders without crashing", () => {
    render(<Spinner />);
    
    // Check if the spinner is in the document
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });

  it("has the correct class name", () => {
    render(<Spinner />);
    
    // Check if the spinner has the correct class name
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass("custom-loader");
  });
});
