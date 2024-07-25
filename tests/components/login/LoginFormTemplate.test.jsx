import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginFormTemplate from "../../../src/components/core/Form/LoginFormTemplate";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { Toaster } from "react-hot-toast";

const mockStore = configureMockStore();
const store = mockStore({
  theme: { darkMode: false },
  Organisation: { showOption: "false" },
  profile: { user: null },
});

describe("LoginFormTemplate", () => {
  const renderComponent = () => {
    const onSubmit = vi.fn();

    render(
      <Provider store={store}>
        <Router>
          <LoginFormTemplate onSubmit={onSubmit} />
        </Router>
        <Toaster />
      </Provider>
    );

    return {
      onSubmit,
      expectErrorToBeInTheDocument: (errorMessage) => {
        const errors = screen.queryAllByRole("alert");
        const error = errors.find((err) =>
          err.textContent.includes(errorMessage)
        );
        expect(error).toBeDefined();
        expect(error).toBeInTheDocument();
      },
      waitForFormToLoad: async () => {
        await screen.findByRole("form");

        const emailInput = screen.getByPlaceholderText(/enter email address/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);
        const submitButton = screen.getByRole("button", { name: /login/i });

        const validData = {
          email: "test@example.com",
          password: "ValidPassword1!",
        };

        const fill = async (data) => {
          const user = userEvent.setup();

          if (data.email !== undefined) await user.type(emailInput, data.email);

          if (data.password !== undefined)
            await user.type(passwordInput, data.password);

          await user.click(submitButton);
        };

        return {
          emailInput,
          passwordInput,
          submitButton,
          fill,
          validData,
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { emailInput, passwordInput } = await waitForFormToLoad();

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it("should display an error if email is invalid", async () => {
    const { waitForFormToLoad, expectErrorToBeInTheDocument } =
      renderComponent();

    const form = await waitForFormToLoad();
    await form.fill({
      email: "invalid-email",
      password: form.validData.password,
    });

    expectErrorToBeInTheDocument("Please enter a valid email address.");
  });

  it("should re-enable the submit button after submission", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockResolvedValue({});

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).not.toBeDisabled();
  });

  it("should re-enable the submit button after submission failure", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue("error");

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).not.toBeDisabled();
  });

  it("should toggle password visibility", async () => {
    const { waitForFormToLoad } = renderComponent();
    const form = await waitForFormToLoad();

    const toggleButton = screen.getByTestId("toggle-password-visibility");

    // Initially, the password input should be of type password
    expect(form.passwordInput).toHaveAttribute("type", "password");

    // Click to show the password
    userEvent.click(toggleButton);
    await waitFor(() => {
      expect(form.passwordInput).toHaveAttribute("type", "text");
    });

    // Click to hide the password again
    userEvent.click(toggleButton);
    await waitFor(() => {
      expect(form.passwordInput).toHaveAttribute("type", "password");
    });
  });
});
