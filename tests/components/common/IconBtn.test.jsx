// IconBtn.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import IconBtn from "../../../src/components/common/IconBtn";

describe("IconBtn Component", () => {


  it("renders with children and text", () => {
    render(
      <IconBtn text="Click Me" customClasses="custom-class">
        <span>Icon</span>
      </IconBtn>
    );

    const buttonText = screen.getByText("Click Me");
    const buttonIcon = screen.getByText("Icon");
    expect(buttonText).toBeInTheDocument();
    expect(buttonIcon).toBeInTheDocument();
  });



  it("is disabled when disabled prop is true", () => {
    render(<IconBtn text="Click Me" disabled={true} />);

    const button = screen.getByText("Click Me");
    expect(button).toBeDisabled();
  });

  it("applies correct styles based on props", () => {
    const { container } = render(
      <IconBtn
        text="Click Me"
        outline={true}
        color={1}
        customWidth="w-40"
      />
    );

    const button = screen.getByText("Click Me");
    expect(button).toHaveClass("text-yellow-50 bg-slate-950 border-[1px] border-yellow-50");
    expect(button).toHaveClass("w-40");
  });

 

  it("applies the correct type attribute", () => {
    render(<IconBtn text="Click Me" type="submit" />);

    const button = screen.getByText("Click Me");
    expect(button).toHaveAttribute("type", "submit");
  });
});
