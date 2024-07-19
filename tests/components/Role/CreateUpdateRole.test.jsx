import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { Toaster } from "react-hot-toast";
import CreateUpdateRole from "../../../src/components/core/dashboard/AdminPanel/Role/CreateUpdateRole";

const mockStore = configureMockStore();
const store = mockStore({
  auth: { AccessToken: "mockAccessToken" },
  theme: { darkMode: false },
});

describe("CreateUpdateRole", () => {
  const renderComponent = (initialState = {}, locationState = {}) => {
    render(
      <Provider store={{ ...store, ...initialState }}>
        <Router>
          <CreateUpdateRole />
        </Router>
        <Toaster />
      </Provider>,
      {
        initialEntries: [
          { pathname: "/role-create-update", state: locationState },
        ],
      }
    );
  };

  const waitForFormToLoad = async () => {
    await screen.findByRole("form");

    const roleInput = screen.getByPlaceholderText(/enter role name/i);
    const submitButton = screen.getByRole("button", {
      name: /create role/i,
    });

    const fill = async (data) => {
      const user = userEvent.setup();

      if (data.role !== undefined) await user.type(roleInput, data.role);

      await user.click(submitButton);
    };

    return {
      roleInput,
      submitButton,
      fill,
      validData: {
        role: "Valid Role",
      },
    };
  };

  it("should render form fields", async () => {
    renderComponent();

    const { roleInput } = await waitForFormToLoad();

    expect(roleInput).toBeInTheDocument();
  });

  it("should display an error if role name is invalid", async () => {
    renderComponent();

    const { fill } = await waitForFormToLoad();
    await fill({ role: "A" });

    const error = await screen.findByText(
      /role name must be at least 2 characters/i
    );
    expect(error).toBeInTheDocument();
  });

  it("should submit the form with valid data", async () => {
    renderComponent();

    const { fill, validData } = await waitForFormToLoad();
    await fill(validData);
  });
});
