// DepartmentList.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import departmentReducer from "../../../src/slices/departmentSlice.js";
import themeReducer from "../../../src/slices/themeSlice.js";
import authReducer from "../../../src/slices/authSlice.js";
import { vi } from "vitest";
import DepartmentList from "../../../src/components/core/dashboard/AdminPanel/Department/DepartmentList.jsx";
import {
  Departmentlist,
  deleteDepartment,
} from "../../../src/services/operations/departmentAPI.js";

// Mock the modules
vi.mock("../../../src/services/operations/departmentAPI.js", () => ({
  Departmentlist: vi.fn(),
  deleteDepartment: vi.fn(),
}));

describe("DepartmentList Component", () => {
  const setup = (initialState) => {
    const store = configureStore({
      reducer: {
        department: departmentReducer,
        theme: themeReducer,
        auth: authReducer,
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
  });

  it("renders the Department List title", async () => {
    setup({
      department: {
        AllDepartments: [],
        loading: false,
      },
      theme: { darkMode: false },
      auth: { AccessToken: "dummy-token" },
    });

    await waitFor(() => {
      expect(screen.getByTestId("Department List")).toBeInTheDocument();
    });
  });

  //   it("displays loading spinner when loading", () => {
  //     setup({
  //       department: {
  //         AllDepartments: [],
  //         loading: true,
  //       },
  //       theme: { darkMode: false },
  //       auth: { AccessToken: "dummy-token" },
  //     });
  //     expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  //   });

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
    });

    fireEvent.click(screen.getByTestId("delete-button"));

    await waitFor(() => {
      expect(screen.getByText("Are You Sure?")).toBeInTheDocument();
    });
  });
});
