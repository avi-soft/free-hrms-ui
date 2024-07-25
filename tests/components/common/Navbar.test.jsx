// NavBar.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../../../src/slices/themeSlice";
import authReducer from "../../../src/slices/authSlice";
import profileReducer from "../../../src/slices/profileSlice";
import { vi } from "vitest";
import NavBar from "../../../src/components/common/Navbar";

// Mock the components and assets
vi.mock("../../components/core/Navbar/ProfileDropDown", () => ({
  __esModule: true,
  default: () => <div>Profile Dropdown</div>,
}));

vi.mock("../../assets/Images/Moon.svg", () => ({
  __esModule: true,
  default: "mock-moon.svg",
}));

vi.mock("../../assets/Images/Sun.svg", () => ({
  __esModule: true,
  default: "mock-sun.svg",
}));

describe("NavBar Component", () => {
  const setup = (initialState) => {
    const store = configureStore({
      reducer: {
        theme: themeReducer,
        auth: authReducer,
        profile: profileReducer,
      },
      preloadedState: initialState,
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </Provider>
    );
  };

  it("renders the NavBar component", () => {
    setup({
      theme: { darkMode: false },
      auth: { AccessToken: null },
    });

    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.queryByText("Profile Dropdown")).toBeNull();
  });

  it("renders profile dropdown when AccessToken is present", () => {
    setup({
      theme: { darkMode: false },
      auth: { AccessToken: "dummy-token" },
    });

    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByTestId("profile-dropdown")).toBeInTheDocument();
  });

  it("toggles theme on button click", async () => {
    setup({
      theme: { darkMode: false },
      auth: { AccessToken: "dummy-token" },
    });

    const themeButton = screen.getByTestId("themeToggle");
    fireEvent.click(themeButton);

    await waitFor(() => {
      // Check if Sun icon is present (dark mode should be enabled)
      expect(screen.getByAltText("Sun")).toBeInTheDocument();
    });

    fireEvent.click(themeButton);

    await waitFor(() => {
      // Check if Moon icon is present (light mode should be re-enabled)
      expect(screen.getByAltText("Moon")).toBeInTheDocument();
    });
  });

  it("navigates to employee info page on form submission", async () => {
    setup({
      theme: { darkMode: false },
      auth: { AccessToken: "dummy-token" },
    });

    fireEvent.change(screen.getByPlaceholderText("Search Employee.."), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/employee-info/123");
    });
  });

});
