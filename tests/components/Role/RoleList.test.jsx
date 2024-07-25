// RoleList.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "../../../src/slices/roleSlice.js";
import themeReducer from "../../../src/slices/themeSlice.js";
import authReducer from "../../../src/slices/authSlice.js";
import { vi } from "vitest";
import RoleList from "../../../src/components/core/dashboard/AdminPanel/Role/RoleList.jsx";
import {
  getRole,
  deleteRole,
} from "../../../src/services/operations/roleAPI.js";
import ConfirmationModal from "../../../src/components/common/ConfirmationModal";
import Spinner from "../../../src/components/common/Spinner";

// Mock the modules
vi.mock("../../../src/services/operations/roleAPI.js", () => ({
  getRole: vi.fn(),
  deleteRole: vi.fn(),
}));

vi.mock("../../../src/components/common/ConfirmationModal", () => ({
  __esModule: true,
  default: vi.fn(() => null),
}));

vi.mock("../../../src/components/common/Spinner", () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}));

describe("RoleList Component", () => {
  const setup = (initialState) => {
    const store = configureStore({
      reducer: {
        role: roleReducer,
        theme: themeReducer,
        auth: authReducer,
      },
      preloadedState: initialState,
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <RoleList />
        </BrowserRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    getRole.mockResolvedValue({ data: [] });
    deleteRole.mockResolvedValue({ status: 200, data: { message: "Role deleted successfully" } });
  });

  it("renders the Role List title", async () => {
    setup({
      role: {
        roles: [],
        loading: false,
      },
      theme: { darkMode: false },
      auth: { AccessToken: "dummy-token" },
    });

    await waitFor(() => {
      expect(screen.getByTestId("Role List")).toBeInTheDocument();
    });
  });


  it("renders role data", async () => {
    const roles = [
      {
        roleId: "1",
        role: "Admin",
      },
    ];

    getRole.mockResolvedValueOnce({ data: roles });

    setup({
      role: {
        roles: roles,
        loading: false,
      },
      theme: { darkMode: false },
      auth: { AccessToken: "dummy-token" },
    });

    await waitFor(() => {
      expect(screen.getByText("Admin")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  it("opens confirmation modal on delete", async () => {
    const roles = [
      {
        roleId: "1",
        role: "Admin",
      },
    ];

    getRole.mockResolvedValueOnce({ data: roles });

    setup({
      role: {
        roles: roles,
        loading: false,
      },
      theme: { darkMode: false },
      auth: { AccessToken: "dummy-token" },
    });

    fireEvent.click(screen.getByTestId("deleteBtn"));

    await waitFor(() => {
      expect(screen.getByTestId("ConfirmationModal")).toBeInTheDocument();
    });
  });

  it("navigates to add role page on button click", () => {
    setup({
      role: {
        roles: [],
        loading: false,
      },
      theme: { darkMode: false },
      auth: { AccessToken: "dummy-token" },
    });

    const addButton = screen.getByText("New Role");
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(window.location.pathname).toBe("/role/role-create-update");
  });
});
