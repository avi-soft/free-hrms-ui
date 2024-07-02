import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import NavBar from "./components/common/Navbar";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./components/core/dashboard/AdminPanel/Employee/EmployeeList";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import EmployeeInfo from "./pages/EmployeeInfo";
import CreateUpdateDepartment from "./components/core/dashboard/AdminPanel/Department/createUpdateDepartment";
import DepartmentList from "./components/core/dashboard/AdminPanel/Department/DepartmentList";
import CreateUpdateEmployee from "./components/core/dashboard/AdminPanel/Employee/CreateUpdateEmployee";
import AddPerformanceReview from "./components/core/dashboard/AdminPanel/Performance/AddPerformanceReview";
import ViewPerformance from "./components/core/dashboard/AdminPanel/Performance/ViewPerformance";
import PerformanceReviewList from "./components/core/dashboard/AdminPanel/Performance/PerformanceReviewList";
import CreateLeave from "./components/core/dashboard/Leave/CreateLeave";
import LeaveList from "./components/core/dashboard/Leave/LeaveList";
import PendingLeaveList from "./components/core/dashboard/Leave/PendingLeaveList";
import ApprovedLeaveList from "./components/core/dashboard/Leave/ApprovedLeaveList";
import DeclinedLeaveList from "./components/core/dashboard/Leave/DeclinedLeaveList";
import RequestedLeaveList from "./components/core/dashboard/Leave/RequestedLeaveList";
import AllReviews from "./components/core/dashboard/AdminPanel/Performance/AllReviews";
import { useSelector } from "react-redux";

function App() {
  const { darkMode } = useSelector((state) => state.theme);
  return (
    <div className={`flex flex-col  min-h-screen ${darkMode ? " bg-slate-600" : "bg-slate-200"}`}>
      <NavBar />
      <div>
        <Routes>
          <Route
            path="/employee-info/:employeeName"
            element={
              <PrivateRoute>
                <EmployeeInfo />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="/employee/employee-list" element={<EmployeeList />} />
            <Route
              path="/employee/employee-create-update"
              element={<CreateUpdateEmployee />}
            />
            <Route
              path="/department/department-create-update"
              element={<CreateUpdateDepartment />}
            />
            <Route
              path="/department/department-list"
              element={<DepartmentList />}
            />
            <Route path="/performance/all-reviews" element={<AllReviews />} />
            <Route
              path="/performance/add-review"
              element={<AddPerformanceReview />}
            />
            <Route
              path="/performance/view-performance"
              element={<ViewPerformance />}
            />
            <Route
              path="/performance/review-list"
              element={<PerformanceReviewList />}
            />
            <Route
              path="/leave/leave-create-update"
              element={<CreateLeave />}
            />
            <Route path="/leave/leave-list" element={<LeaveList />} />
            <Route
              path="/leave/Requested-leaves-list"
              element={<RequestedLeaveList />}
            />
            <Route
              path="/leave/leave-list-pending"
              element={<PendingLeaveList />}
            />
            <Route
              path="/leave/leave-list-approved"
              element={<ApprovedLeaveList />}
            />
            <Route
              path="/leave/leave-list-rejected"
              element={<DeclinedLeaveList />}
            />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
