// DepartmentList.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import departmentReducer from "../../../src/slices/departmentSlice.js";
import themeReducer from "../../../src/slices/themeSlice.js";
import authReducer from "../../../src/slices/authSlice.js";
import organisationReducer from "../../../src/slices/OrganisationSlice";
import { vi } from "vitest";
import DepartmentList from "../../../src/components/core/dashboard/AdminPanel/Department/DepartmentList.jsx";
import {
  Departmentlist,
  deleteDepartment,
} from "../../../src/services/operations/departmentAPI.js";
import { getOrganisation } from "../../../src/services/operations/OrganisationAPI.js";

// Mock the modules
vi.mock("../../../src/services/operations/departmentAPI.js", () => ({
  Departmentlist: vi.fn(),
  deleteDepartment: vi.fn(),
}));

vi.mock("../../../src/services/operations/OrganisationAPI.js", () => ({
  getOrganisation: vi.fn(),
}));

describe("DepartmentList Component", () => {
  const setup = (initialState) => {
    const store = configureStore({
      reducer: {
        department: departmentReducer,
        theme: themeReducer,
        auth: authReducer,
        Organisation: organisationReducer,
      },
      preloadedState: initialState,
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <DepartmentList />
        </BrowserRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    Departmentlist.mockResolvedValue({ data: [] });
    deleteDepartment.mockResolvedValue({});
    getOrganisation.mockResolvedValue({ data: [] });
  });

  it("renders the Department List title", async () => {
    setup({
      department: {
        AllDepartments: [],
        loading: false,
      },
      theme: { darkMode: false },
      auth: { AccessToken: "dummy-token" },
      Organisation: { AllOrganizations: [] },
    });

    await waitFor(() => {
      expect(screen.getByTestId("Department List")).toBeInTheDocument();
    });
  });

  // it("displays loading spinner when loading", () => {
  //   setup({
  //     department: {
  //       AllDepartments: [],
  //       loading: true,
  //     },
  //     theme: { darkMode: false },
  //     auth: { AccessToken: "dummy-token" },
  //     Organisation: { AllOrganizations: [] },
  //   });

  //   expect(screen.getByText("Loading...")).toBeInTheDocument();
  // });

  it("renders department data", async () => {
    const departments = [
      {
        departmentId: "1",
        department: "HR",
        managerFirstName: "John",
        managerLastName: "Doe",
        description: "Human Resources",
      },
    ];

    Departmentlist.mockResolvedValueOnce({ data: departments });

    setup({
      department: {
        AllDepartments: departments,
        loading: false,
      },
      theme: { darkMode: false },
      auth: { AccessToken: "dummy-token" },
      Organisation: { AllOrganizations: ["TEST ORG 1", " TEST ORG 2"] },
    });

    await waitFor(() => {
      expect(screen.getByText("HR")).toBeInTheDocument();
      expect(screen.getByText("Human Resources")).toBeInTheDocument();
    });
  });

  it("opens confirmation modal on delete", async () => {
    const departments = [
      {
        departmentId: "1",
        department: "HR",
        managerFirstName: "John",
        managerLastName: "Doe",
        description: "Human Resources",
      },
    ];

    Departmentlist.mockResolvedValueOnce({ data: departments });

    setup({
      department: {
        AllDepartments: departments,
        loading: false,
      },
      theme: { darkMode: false },
      auth: { AccessToken: "dummy-token" },
      Organisation: { AllOrganizations: [
        "test org 1", "test org 2"
      ] },
    });

    fireEvent.click(screen.getByTestId("delete-button"));

    await waitFor(() => {
      expect(screen.getByText("Are You Sure?")).toBeInTheDocument();
    });
  });

  // it("renders and updates organization selection", async () => {
  //   const organizations = [
  //     {
  //       organizationId: "1",
  //       organizationName: "Org1",
  //     },
  //     {
  //       organizationId: "2",
  //       organizationName: "Org2",
  //     },
  //   ];

  //   getOrganisation.mockResolvedValueOnce({ data: organizations });

  //   setup({
  //     department: {
  //       AllDepartments: [],
  //       loading: false,
  //     },
  //     theme: { darkMode: false },
  //     auth: { AccessToken: "dummy-token" },
  //     Organisation: { AllOrganizations: organizations },
  //   });

  //   await waitFor(() => {
  //     const selectElement = screen.getByRole("combobox");
  //     expect(selectElement).toBeInTheDocument();
  //     expect(selectElement.value).toBe("1"); // Default to the first organization

  //     fireEvent.change(selectElement, { target: { value: "2" } });
  //     expect(selectElement.value).toBe("2");
  //   });
  // });

  it("navigates to add department page on button click", () => {
    setup({
      department: {
        AllDepartments: [],
        loading: false,
      },
      theme: { darkMode: false },
      auth: { AccessToken: "dummy-token" },
      Organisation: { AllOrganizations: [] },
    });

    const addButton = screen.getByText("Add Department");
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(window.location.pathname).toBe("/department/department-create-update");
  });
});
