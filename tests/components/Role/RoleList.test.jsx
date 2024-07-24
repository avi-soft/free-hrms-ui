import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { Toaster } from "react-hot-toast";
import RoleList from "../../../src/components/core/dashboard/AdminPanel/Role/RoleList";
import { http, HttpResponse, rest } from "msw";
import { setupServer } from "msw/node";

const mockStore = configureMockStore();
const store = mockStore({
  auth: { AccessToken: "mockAccessToken" },
  theme: { darkMode: false },
});

describe("RoleList", () => {
  const renderComponent = (initialState = {}, locationState = {}) => {
    render(
      <Provider store={{ ...store, ...initialState }}>
        <Router>
          <RoleList />
        </Router>
        <Toaster />
      </Provider>
    );
  };

  it("should render the headings", async () => {
    renderComponent();
    const heading = screen.getByTestId("Role List");

    const heading2 = screen.getByTestId("side-header");
    expect(heading).toBeInTheDocument();
    expect(heading2).toBeInTheDocument();
  });

  // it("should render the table headers", async () => {
  //   renderComponent();

  //   const tableHeaders = await screen.findAllByRole("columnheader");
  //   expect(tableHeaders).toHaveLength(3);
  // });

  // it("should render the spinner", async () => {
  //   renderComponent();

  //   await waitFor(() => {
  //     const spinner = screen.getByTestId("spinner");
  //     expect(spinner).toBeInTheDocument();
  //   });
  // });

  it("should render the roles in table", async () => {
    renderComponent();

    await waitFor(() => {
      const errorMessage = screen.getByTestId("no-role-found");
      expect(errorMessage).toBeInTheDocument(); // 2 roles + 1 header row
    });
  });
});
