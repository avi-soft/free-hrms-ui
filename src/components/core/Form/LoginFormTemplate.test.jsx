import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import LoginFormTemplate from "./LoginFormTemplate";
import { store } from "../../../store/store";
import { login } from "../../../services/operations/authAPI";
import * as authAPI from "../../../services/operations/authAPI"; 

describe("Login Components", () => {
  beforeEach(() => {
    jest.spyOn(store, "dispatch").mockImplementation(() => {});
  });

  afterEach(() => {
    store.dispatch.mockRestore();
  });

  beforeEach(() => {
    jest.spyOn(authAPI, "login").mockImplementation(() => {});
  });

  afterEach(() => {
    authAPI.login.mockRestore();
  });

  test("render the main heading with proper text content", () => {
    renderWithContext(<LoginFormTemplate />);
    const mainHeading = screen.getByTestId("main-heading");
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent("Sign-In Portal");
  });
  

  test("render the login heading with proper text content", () => {
    renderWithContext(<LoginFormTemplate />);
    const loginHeading = screen.getByTestId("login-heading");
    expect(loginHeading).toBeInTheDocument();
    expect(loginHeading).toHaveTextContent("Sign in to your account");
  });

  test("renders email label with correct test id", () => {
    renderWithContext(<LoginFormTemplate />);
    const emailLabel = screen.getByTestId("email-label");
    expect(emailLabel).toBeInTheDocument();
    expect(emailLabel).toHaveTextContent("Email Address");
  });

  test("renders email input field with correct placeholder", () => {
    renderWithContext(<LoginFormTemplate />);
    const emailInput = screen.getByTestId("email-input");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("placeholder", "Enter Email Address");
  });

  test("renders password label with correct test id", () => {
    renderWithContext(<LoginFormTemplate />);
    const passwordLabel = screen.getByTestId("password-label");
    expect(passwordLabel).toBeInTheDocument();
    expect(passwordLabel).toHaveTextContent("Password");
  });

  test("renders password text", () => {
    renderWithContext(<LoginFormTemplate />);
    const passwordInput = screen.getByTestId("password-input");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test('renders "Forgot Password?" link', () => {
    renderWithContext(<LoginFormTemplate />);
    const forgotPasswordLink = screen.getByTestId("forgot-password-link");
    expect(forgotPasswordLink).toBeInTheDocument();
  });

  test("renders submit button", () => {
    renderWithContext(<LoginFormTemplate />);
    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent("Sign In");
  });

  test("submitting the form with valid data dispatches login action", async () => {
    renderWithContext(<LoginFormTemplate />);
    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await act(async () => {});

    expect(authAPI.login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      role: "",
      navigate: expect.any(Function)
    });
  });
});

function renderWithContext(element) {
  render(
    <BrowserRouter>
      <Provider store={store}>{element}</Provider>
    </BrowserRouter>
  );
}
