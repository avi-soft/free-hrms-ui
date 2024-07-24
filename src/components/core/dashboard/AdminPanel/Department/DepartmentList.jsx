import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ConfirmationModal from "../../../../common/ConfirmationModal.jsx";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
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

const DepartmentList = () => {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState("");

  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const { loading, AllDepartments } = useSelector((state) => state.department);
  const { AllOrganizations } = useSelector((state) => state.Organisation);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizationList = async () => {
      try {
        dispatch(setLoading(true));
        const res = await dispatch(getOrganisation(AccessToken));
        const organizations = res?.data;
        dispatch(setOrganization(organizations));
        if (organizations.length > 0) {
          setSelectedOrganization(organizations[0].organizationId); // Set the first organization as selected
        }
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching AllOrganizations", error);
        dispatch(setLoading(false));
      }
    };
  
    fetchOrganizationList();
  }, [dispatch, AccessToken]);
  

  useEffect(() => {
    if (selectedOrganization) {
      const fetchDepartmentsList = async () => {
        try {
          dispatch(setLoading(true));
          const res = await dispatch(
            Departmentlist(AccessToken, selectedOrganization)
          );
          dispatch(setDepartments(res?.data));
          dispatch(setLoading(false));
        } catch (error) {
          console.error("Error fetching departments", error);
          dispatch(setLoading(false));
        }
      };

      fetchDepartmentsList();
    }
  }, [dispatch, AccessToken, selectedOrganization]);

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <div
      className={`h-[600px] mb-10 rounded shadow-lg ${
        darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-black"
      }`}
    >
      {loading ? (
        <div className="absolute grid place-content-center mt-60 w-[85%]">
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
                  <option value="">Select Organization</option>
                  {AllOrganizations.map((org) => (
                    <option key={org?.organizationId} value={org.organizationId}>
                      {org.organizationName}
                    </option>
                  ))}
                </select>
              </div>
              {/* Section 3 */}
              {AllDepartments?.length === 0 ? (
                <div>
                  <h1 className="text-center text-2xl mt-10">
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
                            <td className="px-6 py-4">{department.department}</td>
                            <td className="px-6 py-4">
                              {department?.managerId
                                ? `${department.managerFirstName} ${department.managerLastName}`
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4">{department.description}</td>
                            <td className="px-6 py-4 flex gap-x-2">
                              <button
                                className="text-lg text-blue-600 dark:text-blue-500 hover:underline"
                                onClick={() =>
                                  navigate(`/department/department-create-update`, {
                                    state: { isEditing: true, department },
                                  })
                                }
                              >
                                <FaRegEdit />
                              </button>
                              <Link
                                data-testid="delete-button"
                                onClick={() =>
                                  setConfirmationModal({
                                    text1: "Are You Sure?",
                                    text2:
                                      "You want to Delete this Department. This Department may contain important Information. Deleting this department will remove all the details associated with it.",
                                    btn1Text: "Delete Department",
                                    btn2Text: "Cancel",
                                    btn1Handler: async () => {
                                      dispatch(
                                        deleteDepartment(
                                          AccessToken,
                                          department.departmentId
                                        )
                                      );
                                      refreshPage();
                                    },
                                    btn2Handler: () => setConfirmationModal(null),
                                  })
                                }
                                className="text-red-600 text-lg"
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
          {confirmationModal && (
            <ConfirmationModal modalData={confirmationModal} />
          )}
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
