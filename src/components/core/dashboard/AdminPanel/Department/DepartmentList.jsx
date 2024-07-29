import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ConfirmationModal from "../../../../common/ConfirmationModal.jsx";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDepartment,
  Departmentlist,
} from "../../../../../services/operations/departmentAPI.js";
import Spinner from "../../../../common/Spinner.jsx";
import {
  setDepartments,
  setLoading,
} from "../../../../../slices/departmentSlice.js";
import { setOrganization } from "../../../../../slices/OrganisationSlice";
import { getOrganisation } from "../../../../../services/operations/OrganisationAPI";
import toast from "react-hot-toast";

const DepartmentList = () => {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [updatedOrganization, setUpdatedOrganization] = useState("");

  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const { loading, AllDepartments } = useSelector((state) => state.department);
  const { AllOrganizations } = useSelector((state) => state.Organisation);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchOrganizationList = async () => {
    try {
      dispatch(setLoading(true));
      const res = await dispatch(getOrganisation(AccessToken));
      const organizations = res?.data;
      dispatch(setOrganization(organizations));
      if (organizations.length > 0) {
        // Set the updated organization if available
        const orgId = updatedOrganization || organizations[0].organizationId;
        setSelectedOrganization(orgId);
        fetchDepartmentsList(orgId);
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching AllOrganizations", error);
      dispatch(setLoading(false));
    }
  };

  const fetchDepartmentsList = async (orgId) => {
    try {
      dispatch(setLoading(true));
      const res = await dispatch(Departmentlist(AccessToken, orgId));
      dispatch(setDepartments(res?.data));
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching departments", error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (location.state?.updatedDepartment) {
      setUpdatedOrganization(location.state.organizationId || "");
    }
     else if (location.state?.updatedDepartment !== undefined) {
      setUpdatedOrganization(location.state.organizationId || "");
      // Reload departments or show updated message
    }
    fetchOrganizationList();
  }, [dispatch, AccessToken, location.state, updatedOrganization]);

  useEffect(() => {
    if (selectedOrganization) {
      fetchDepartmentsList(selectedOrganization);
    }
  }, [selectedOrganization]);

  return (
    <div
      className={`mb-10 rounded shadow-lg ${
        darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-black"
      }`}
    >
      {loading ? (
        <div
          data-testid="spinner"
          className="absolute grid place-content-center mt-60 w-[85%]"
        >
          <Spinner />
        </div>
      ) : (
        <div className="pb-9 mt-3 rounded">
          {/* Section 1 */}
          <div className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div
              className="text-xl font-semibold mb-2 lg:mb-0"
              data-testid="Department List"
            >
              Department List
            </div>
            <div>
              <p className="text-xl font-semibold">
                Home / Dashboard /
                <span className="text-yellow-700"> Department List</span>
              </p>
            </div>
          </div>
          {/* Section 2 */}
          <div className="m-5 flex flex-col lg:flex-row items-start lg:items-center justify-between rounded p-5">
            <Link
              to="/department/department-create-update"
              className={`flex items-center gap-x-1 ${
                darkMode ? "primary-gradient " : "bg-red-600"
              } w-fit p-2 rounded-lg mb-3 lg:mb-0 text-white`}
            >
              <span>
                <HiOutlinePlusCircle />
              </span>
              <button>Add Department</button>
            </Link>
          </div>
          {AllOrganizations.length === 0 ? (
            <div className="p-5 mt-32 flex flex-col items-center justify-center">
              <div
                className={`text-xl font-semibold ${
                  darkMode ? "text-orange-400" : "text-slate-600"
                }`}
              >
                No Organizations Available
              </div>
              <p
                className={`text-center mt-4 ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
              >
                You need to create an organization before managing departments.
              </p>
              <div className="flex justify-center">
                <Link
                  to={`/organization/organization-create-update`}
                  className={`text-sm md:text-base underline font-medium rounded-md py-2 px-5 ${
                    darkMode ? "text-blue-400" : "text-blue-700"
                  }`}
                >
                  Create Organization
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-start p-5">
                <select
                  value={selectedOrganization}
                  onChange={(e) => setSelectedOrganization(e.target.value)}
                  className={`${
                    darkMode
                      ? "bg-slate-700 text-white"
                      : "bg-slate-200 text-black"
                  } p-2 rounded-lg`}
                >
                  {AllOrganizations.map((org) => (
                    <option
                      key={org?.organizationId}
                      value={org?.organizationId}
                    >
                      {org.organizationName}
                    </option>
                  ))}
                </select>
              </div>
              {/* Section 3 */}
              {AllDepartments?.length === 0 ? (
                <div>
                  <h1
                    data-testid="No Departments Found"
                    className="text-center text-2xl mt-10"
                  >
                    No Departments Found
                  </h1>
                </div>
              ) : (
                <div className="p-5">
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="min-w-full text-sm text-left">
                      <thead
                        className={`${
                          darkMode
                            ? "bg-slate-700 text-white"
                            : "bg-slate-200 text-black"
                        } text-xs uppercase`}
                      >
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3"
                            data-testid="Department-Name-header"
                          >
                            Department Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3"
                            data-testid="Department-Manager-header"
                          >
                            Department Manager
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3"
                            data-testid="Department-Description-header"
                          >
                            Department Description
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3"
                            data-testid="action-header"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {AllDepartments?.map((department, index) => (
                          <tr
                            key={department.departmentId}
                            className={
                              index % 2 === 0
                                ? darkMode
                                  ? "bg-slate-600 text-white"
                                  : "bg-white text-black"
                                : darkMode
                                ? "bg-slate-700 text-white"
                                : "bg-gray-100 text-black"
                            }
                          >
                            <td className="px-6 py-4">
                              {department.department}
                            </td>
                            <td className="px-6 py-4">
                              {department?.managerId
                                ? `${department.managerFirstName} ${department.managerLastName}`
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4">
                              {department.description}
                            </td>
                            <td className="px-6 py-4 flex gap-x-2">
                              <button
                                data-testid="editButton"
                                className="text-lg text-blue-600 dark:text-blue-500 hover:underline"
                                onClick={() =>
                                  navigate(
                                    `/department/department-create-update`,
                                    {
                                      state: {
                                        isEditing: true,
                                        department,
                                        organizationId: selectedOrganization,
                                      },
                                    }
                                  )
                                }
                              >
                                <FaRegEdit />
                              </button>
                              <Link
                                data-testid="delete-button"
                                to="#"
                                onClick={() =>
                                  setConfirmationModal({
                                    type: "delete",
                                    department,
                                  })
                                }
                                className="text-lg text-red-600 dark:text-red-500 hover:underline"
                              >
                                <RiDeleteBin6Line />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {confirmationModal && (
        <ConfirmationModal
          type={confirmationModal.type}
          department={confirmationModal.department}
          onClose={() => setConfirmationModal(null)}
          onConfirm={async () => {
            try {
              await dispatch(deleteDepartment(AccessToken, confirmationModal.department.departmentId));
              toast.success("Department deleted successfully");
              fetchDepartmentsList(selectedOrganization);
            } catch (error) {
              toast.error("Failed to delete department");
            }
            setConfirmationModal(null);
          }}
        />
      )}
    </div>
  );
};

export default DepartmentList;
