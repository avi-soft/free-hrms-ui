import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { Toaster } from "react-hot-toast";
import CreateUpdateDepartment from "../../../src/components/core/dashboard/AdminPanel/Department/createUpdateDepartment";
const mockStore = configureMockStore();

const initialStoreState = {
  auth: { AccessToken: "mockAccessToken" },
  theme: { darkMode: false },
  Organisation: {
    selectedImage: null,
    AllOrganizations: [{ organizationId: "1", organizationName: "Test Org 1" }],
    existingImage: null
  },
  Department: { selectedImage: null, existingImage: null },
  department: {
    loading: false, // Add the loading property
    error: null,    // Add the error property if used in the component
  },
};

describe("CreateUpdateDepartment", () => {
  const renderComponent = (initialState = {}, locationState = {}) => {
    const store = mockStore({ ...initialStoreState, ...initialState });

    render(
      <Provider store={store}>
        <Router>
          <CreateUpdateDepartment />
        </Router>
        <Toaster />
      </Provider>,
      {
        initialEntries: [
          { pathname: "/department-create-update", state: locationState },
        ],
      }
    );
  };

  const waitForFormToLoad = async () => {
    await screen.findByRole("form");

    const orgSelect = screen.getByLabelText(/select organization/i);
    const deptInput = screen.getByPlaceholderText(/department name/i);
    const descInput = screen.getByPlaceholderText(/department description/i);
    const submitButton = screen.getByRole("button", {
      name: /create department/i,
    });

    const fill = async (data) => {
      const user = userEvent.setup();

      if (data.organization !== undefined)
        await user.selectOptions(orgSelect, data.organization);
      if (data.department !== undefined)
        await user.type(deptInput, data.department);
      if (data.description !== undefined)
        await user.type(descInput, data.description);

      await user.click(submitButton);
    };

    return {
      orgSelect,
      deptInput,
      descInput,
      submitButton,
      fill,
      validData: {
        organization: "1",
        department: "Valid Department",
        description: "Valid Description",
      },
    };
  };

  it("render headings  with correct text",async()=> {
    renderComponent({}, { isEditing: true });
    let heading=screen.getByTestId("heading-1");
       let heading2=screen.getByTestId("heading-2");

       expect(heading).toBeInTheDocument();
       expect(heading2).toBeInTheDocument();

  })

  it("should render form fields and placeholders", async () => {
    renderComponent();

    const { orgSelect, deptInput, descInput } = await waitForFormToLoad();
    

    expect(orgSelect).toBeInTheDocument();
    expect(deptInput).toBeInTheDocument();
    expect(descInput).toBeInTheDocument();
  });

  it("should display an error if department name is invalid", async () => {
    renderComponent();

    const { fill } = await waitForFormToLoad();
    await fill({ department: "AB" });

    const error = await screen.getByTestId("departmentName");
    expect(error).toBeInTheDocument();
  });

  it("should display an error if description is invalid", async () => {
    renderComponent();

    const { fill } = await waitForFormToLoad();
    await fill({ description: "Desc" });

    const error = await screen.getByTestId("deptDescError");
    expect(error).toBeInTheDocument();
  });

  it("should submit the form with valid data", async () => {
    renderComponent();

    const { fill, validData } = await waitForFormToLoad();
    await fill(validData);
  });

  it("should load organization list on mount", async () => {
    renderComponent();

    expect(screen.getByLabelText(/select organization/i)).toBeInTheDocument();
    expect(screen.getByText(/test org 1/i)).toBeInTheDocument();
  });

  it("should handle manager search input", async () => {
    renderComponent();

    const employeeSearchInput = screen.getByPlaceholderText(/search employee for adding as manager/i);
    await userEvent.type(employeeSearchInput, "John");

    expect(employeeSearchInput).toHaveValue("John");
  });
  

});
