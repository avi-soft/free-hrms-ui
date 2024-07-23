import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { Toaster } from "react-hot-toast";
import CreateUpdateOrganisation from "../../../src/components/core/dashboard/AdminPanel/Organization/CreateUpdateOrganization";

const mockStore = configureMockStore();
const store = mockStore({
  auth: { AccessToken: "mockAccessToken" },
  theme: { darkMode: false },
  Organisation: { selectedImage: null, existingImage: null },
});

describe("CreateUpdateOrganisation", () => {
  const renderComponent = (initialState = {}, locationState = {}) => {
    render(
      <Provider store={{ ...store, ...initialState }}>
        <Router>
          <CreateUpdateOrganisation />
        </Router>
        <Toaster />
      </Provider>,
      {
        initialEntries: [
          { pathname: "/organisation-create-update", state: locationState },
        ],
      }
    );
  };

  const waitForFormToLoad = async () => {
    await screen.findByRole("form");

    const orgInput = screen.getByPlaceholderText(/organisation name/i);
    const descInput = screen.getByPlaceholderText(/organisation description/i);
    const submitButton = screen.getByRole("button", {
      name: /submit organisation/i,
    });

    const fill = async (data) => {
      const user = userEvent.setup();

      if (data.organisation !== undefined)
        await user.type(orgInput, data.organisation);
      if (data.description !== undefined)
        await user.type(descInput, data.description);

      await user.click(submitButton);
    };

    return {
      orgInput,
      descInput,
      submitButton,
      fill,
      validData: {
        organisation: "Valid Organisation",
        description: "Valid Description",
      },
    };
  };

  it("should render form fields", async () => {
    renderComponent();

    const { orgInput, descInput } = await waitForFormToLoad();

    expect(orgInput).toBeInTheDocument();
    expect(descInput).toBeInTheDocument();
  });

  it("should display an error if organisation name is invalid", async () => {
    renderComponent();

    const { fill } = await waitForFormToLoad();
    await fill({ organisation: "AB" });

    const error = await screen.findByText(
      /organisation name must be at least 3 characters/i
    );
    expect(error).toBeInTheDocument();
  });

  it("should display an error if description is invalid", async () => {
    renderComponent();

    const { fill } = await waitForFormToLoad();
    await fill({ description: "Desc" });

    const error = await screen.findByText(
      /description must be at least 5 characters/i
    );
    expect(error).toBeInTheDocument();
  });

  it("should submit the form with valid data", async () => {
    renderComponent();

    const { fill, validData } = await waitForFormToLoad();
    await fill(validData);
  });
});
