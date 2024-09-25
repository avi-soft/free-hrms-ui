import React, { useEffect, useState } from "react";
import { FaBan, FaRegEdit } from "react-icons/fa";
import ConfirmationModal from "../../../../common/ConfirmationModal.jsx";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AssignDepartmentOrganization,
  AssignDepartmentSubOrganization,
  deleteDepartment,
  Departmentlist,
  UnassignDepartmentOrganization,
  UnassignDepartmentSubOrganization,
  UnAssignedOrgDepartmentlist,
} from "../../../../../services/operations/departmentAPI.js";
import Spinner from "../../../../common/Spinner.jsx";
import {
  setDepartments,
  setLoading,
} from "../../../../../slices/departmentSlice.js";
import { setOrganization } from "../../../../../slices/OrganisationSlice";
import { getOrganisation } from "../../../../../services/operations/OrganisationAPI";
import toast from "react-hot-toast";
import { setSubOrganization } from "../../../../../slices/subOrganizationSlice.js";
import { getSubOrganizationList } from "../../../../../services/operations/subOrganisationAPI.js";
import { setStep } from "../../../../../slices/employeeSlice.js";
import {
  hasAddDepartmentPrivilege,
  hasAssignDepartmentToOrganizationPrivilege,
  hasDeleteDepartmentPrivilege,
  hasGetAllBranchPrivilege,
  hasGetAllOrganizationsPrivilege,
  hasRemoveDepartmentFromOrganizationPrivilege,
  hasUpdateDepartmentPrivilege,
} from "../../../../../utils/privileges.js";
import { fetchSubOrganizationOrgSpecific } from "../../../../../utils/subOrg.functions.js";

const DepartmentList = () => {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [selectedOrganization, setSelectedOrganization] =
    useState("unassigned");
  const [updatedOrganization, setUpdatedOrganization] = useState("");
  const [selectedAssignOrganization, setSelectedAssignOrganization] =
    useState("");

  const [selectedAssignSubOrganization, setSelectedAssignSubOrganization] =
    useState("");
  const [showOrganizationAssignDialog, setShowOrganizationAssignDialog] =
    useState(false); // State for dialog visibility
  const [showSubOrganizationAssignDialog, setShowSubOrganizationAssignDialog] =
    useState(false); // State for dialog visibility

  const [currentDepartment, setCurrentDepartment] = useState(null);

  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const { loading, AllDepartments } = useSelector((state) => state.department);
  const { AllOrganizations } = useSelector((state) => state.Organisation);
  const { AllSubOrganization } = useSelector((state) => state.subOrganization);
  const [renderFlag, setRenderFlag] = useState(false);
  const [organizationError, setOrganizationError] = useState("");
  const [subOrganizationError, setSubOrganizationError] = useState("");
  const { user } = useSelector((state) => state.profile);

  const navigate = useNavigate();
  const location = useLocation();

  console.log("ALL SUB ORG",AllSubOrganization);
  console.log("GETTING RE RENDERED");
  

  const fetchOrganizationList = async () => {
    if (hasGetAllOrganizationsPrivilege) {
      try {
        dispatch(setLoading(true));
        const res = await dispatch(getOrganisation(AccessToken));
        const organizations = res?.data?.content;
        dispatch(setOrganization(organizations));
        if (organizations.length > 0) {
          // Set the updated organization if available
          const orgId = updatedOrganization;
          console.log(orgId, "orgid");

          if (orgId) {
            setSelectedOrganization(orgId);
            fetchDepartmentsList(orgId);
          } else {
            setSelectedOrganization("unassigned");
            fetchDepartmentsList("unassigned");
          }
        }
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching AllOrganizations", error);
        dispatch(setLoading(false));
      }
    }
  };

  const fetchDepartmentsList = async (orgId) => {
    try {
      dispatch(setLoading(true));

      if (orgId == "unassigned") {
        console.log("inside if");
        const res = await dispatch(UnAssignedOrgDepartmentlist(AccessToken));
        console.log(res);
        dispatch(setDepartments(res?.data?.Departments?.content));
      } else {
        console.log("INSIDE ELSE", orgId);
        const res = await dispatch(Departmentlist(AccessToken, orgId));
        console.log("else", res);
        dispatch(setDepartments(res?.data?.content));
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching departments", error);
      dispatch(setLoading(false));
    }
  };
  const handleAssignOrganization = async (orgId, departmentId) => {
    if (!selectedAssignOrganization) {
      setOrganizationError("Please select an organization.");
      return;
    }
    setOrganizationError("");
    try {
      const response = await dispatch(
        AssignDepartmentOrganization(AccessToken, orgId, departmentId)
      );
      if (response?.status !== 200) throw new Error(response.data.message);
      toast.success(response?.data?.message);
      setSelectedAssignOrganization("");
      setRenderFlag(true);
      setShowOrganizationAssignDialog(false); // Close dialog
    } catch (error) {
      console.error("Error assigning organization", error);
      toast.error("Failed to assign organization");
    }
  };
  const handleUnassignOrganization = async (
    AccessToken,
    orgId,
    departmentId
  ) => {
    try {
      console.log(orgId, departmentId);

      const response = await dispatch(
        UnassignDepartmentOrganization(AccessToken, orgId, departmentId)
      );
      if (response?.status !== 200) throw new Error(response.data.message);
      toast.success(response?.data?.message);
      fetchDepartmentsList(selectedOrganization); // Refresh department list
    } catch (error) {
      console.error("Error unassigning organization", error);
      toast.error("Failed to unassign organization");
    }
  };

  //ASSIGN UNASSIGN Sub Org to Department
  const handleAssignSubOrganization = async (orgId, departmentId) => {
    if (!selectedAssignSubOrganization) {
      setSubOrganizationError("Please select a sub-organization.");
      return;
    }
    setSubOrganizationError("");

    try {
      const response = await dispatch(
        AssignDepartmentSubOrganization(AccessToken, orgId, departmentId)
      );
      console.log(response);

      if (response?.status !== 200) throw new Error(response.data.message);
      toast.success(response?.data?.message);
      setShowSubOrganizationAssignDialog(false);
      setSelectedAssignSubOrganization("");
      setRenderFlag(true);
    } catch (error) {
      console.error("Error assigning organization", error);
      toast.error("Failed to assign organization");
    }
  };
  const handleUnassignSubOrganization = async (
    AccessToken,
    orgId,
    departmentId
  ) => {
    try {
      console.log(orgId, departmentId);

      const response = await dispatch(
        UnassignDepartmentSubOrganization(AccessToken, orgId, departmentId)
      );
      if (response?.status !== 200) throw new Error(response.data.message);
      toast.success(response?.data?.message);
      fetchDepartmentsList(selectedOrganization); // Refresh department list
    } catch (error) {
      console.error("Error unassigning organization", error);
      toast.error("Failed to unassign organization");
    }
  };

  console.log(hasGetAllOrganizationsPrivilege);

  const fetchSubOrganization = async (orgId) => {
    if (hasGetAllBranchPrivilege) {
      try {
        dispatch(setLoading(true));
        if(selectedOrganization !="unassigned") {
          console.log("department selected",selectedOrganization);
        
          const res = await dispatch(fetchSubOrganizationOrgSpecific(dispatch,AccessToken,selectedOrganization));
          console.log(res, "sub org response");
          dispatch(setSubOrganization(res?.data?.BranchList));

        }
        else{
        const res = await dispatch(getSubOrganizationList(AccessToken));
        console.log(res, "sub org response");

        dispatch(setSubOrganization(res?.data?.Branches?.content));

        }


        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching departments", error);
        dispatch(setLoading(false));
      }
    }
  };

  useEffect(() => {
    fetchSubOrganization();
    if (location.state?.updatedDepartment) {
      setUpdatedOrganization(location.state.organizationId);
    } else if (location.state?.updatedDepartment !== undefined) {
      setUpdatedOrganization(location.state.organizationId);
    }
    fetchOrganizationList();
  }, [dispatch,  updatedOrganization]);

  console.log(renderFlag);

  useEffect(() => {
    console.log("inside  useeffeccttt");

    if (selectedOrganization) {
      fetchDepartmentsList(selectedOrganization);
    }
    // fetchDepartmentsList
  }, [selectedOrganization, renderFlag]);

  useEffect(() => {
    dispatch(setStep(1));
  }, [dispatch]);

  function UnAssignAssignOrganizationHeaders() {
    let headerFlag;
    AllDepartments?.map((subOrg, index) => {
      const hasOrganization = subOrg?.organizations?.length > 0;
      const organizationId = hasOrganization
        ? subOrg.organizations[0].organizationId
        : null;
      if (organizationId) {
        console.log("here");

        headerFlag = true;
      } else {
        console.log("here 2");

        headerFlag = false;
      }
    });
    return headerFlag;
  }

  const AssignOrganizationHeaderFlag = UnAssignAssignOrganizationHeaders();

  function UnAssignAssignSubOrganizationHeaders() {
    let SubheaderFlag;
    AllDepartments?.map((subOrg, index) => {
      const hasOrganization = subOrg?.branches?.length > 0;
      const organizationId = hasOrganization
        ? subOrg.branches[0].branchId
        : null;
      if (organizationId) {
        console.log("here");

        SubheaderFlag = true;
      } else {
        console.log("here 2");

        SubheaderFlag = false;
      }
    });
    return SubheaderFlag;
  }

  console.log("flag is", AssignOrganizationHeaderFlag);

  const AssignSubOrganizationHeaderFlag =
    UnAssignAssignSubOrganizationHeaders();

  console.log(" sub  orgflag is", AssignSubOrganizationHeaderFlag);

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
          <div
            className={`m-5 flex flex-col lg:flex-row items-start lg:items-center justify-between rounded p-5   ${
              hasAddDepartmentPrivilege ? "" : "cursor-not-allowed opacity-50"
            }`}
          >
            <Link
              to={
                hasAddDepartmentPrivilege
                  ? "/department/department-create-update"
                  : "#"
              }
              className={`flex items-center gap-x-1 ${
                darkMode ? "primary-gradient" : "bg-red-600"
              } w-fit p-2 rounded-lg mb-3 lg:mb-0 text-white`}
              onClick={(e) => {
                if (!hasAddDepartmentPrivilege) e.preventDefault(); // Prevent navigation if no privilege
              }}
            >
              <span
                className={`${
                  hasAddDepartmentPrivilege
                    ? ""
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                <HiOutlinePlusCircle />
              </span>
              <button
                className={`${
                  hasAddDepartmentPrivilege
                    ? ""
                    : "cursor-not-allowed opacity-50"
                }`}
                disabled={!hasAddDepartmentPrivilege}
              >
                Add Department
              </button>
            </Link>
          </div>
          {AllOrganizations?.content?.length === 0 ? (
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
                  disabled={
                    AllOrganizations?.length === 0 ||
                    AllOrganizations == undefined
                  }
                  className={`${
                    darkMode
                      ? "bg-slate-700 text-white"
                      : "bg-slate-200 text-black"
                  } p-2 rounded-lg ${
                    AllOrganizations?.length === 0 ||
                    AllOrganizations == undefined
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                >
                  <option value="unassigned">Unassigned Departments</option>
                  {AllOrganizations?.map((org) => (
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
                          {AssignOrganizationHeaderFlag ? (
                            <th
                              scope="col"
                              className="px-6 py-3"
                              data-testid="Department-Description-header"
                            >
                              Unassign Organization
                            </th>
                          ) : (
                            <th
                              scope="col"
                              className="px-6 py-3"
                              data-testid="Department-Description-header"
                            >
                              Assign Organization
                            </th>
                          )}

                          {selectedOrganization !== "unassigned" && (
                            <th
                              scope="col"
                              className="px-6 py-3"
                              data-testid="Department-Description-header"
                            >
                              Sub-Organization
                            </th>
                          )}

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
                                ? `${
                                    department.managerFirstName ||
                                    department?.manager?.firstName
                                  } ${department.managerLastName}`
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4">
                              {department.description}
                            </td>
                            {AssignOrganizationHeaderFlag ? (
                              <td className="px-6 py-4 ">
                                <button
                                  data-testid="unassign-button"
                                  onClick={() =>
                                    handleUnassignOrganization(
                                      AccessToken,
                                      selectedOrganization,
                                      department.departmentId
                                    )
                                  }
                                  className={`bg-yellow-500 text-black py-1 px-4 rounded ${
                                    !hasRemoveDepartmentFromOrganizationPrivilege
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  disabled={
                                    !hasRemoveDepartmentFromOrganizationPrivilege
                                  } // Disable if privilege is not present
                                >
                                  UNASSIGN
                                </button>
                              </td>
                            ) : (
                              <td className="px-6 py-4 ">
                                <button
                                  data-testid="assign-button"
                                  onClick={() => {
                                    setCurrentDepartment(department);
                                    setShowOrganizationAssignDialog(true);
                                  }}
                                  className={`bg-yellow-500 text-black py-1 px-4 rounded ${
                                    !hasAssignDepartmentToOrganizationPrivilege
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  disabled={
                                    !hasAssignDepartmentToOrganizationPrivilege
                                  } // Disable if privilege is not present
                                >
                                  ASSIGN
                                </button>
                              </td>
                            )}

                            {selectedOrganization !== "unassigned" ? (
                              Array.isArray(department?.branches) &&
                              department?.branches.length > 0 ? (
                                <td className="px-6 py-4">
                                  <button
                                    data-testid="unassign-button"
                                    onClick={() =>
                                      handleUnassignSubOrganization(
                                        AccessToken,
                                        department?.branches[0]?.branchId,
                                        department.departmentId
                                      )
                                    }
                                    className="bg-yellow-500 text-black py-1 px-4 rounded"
                                  >
                                    UNASSIGN
                                  </button>
                                </td>
                              ) : (
                                <td className="px-6 py-4">
                                  <button
                                    data-testid="assign-button"
                                    onClick={() => {
                                      setCurrentDepartment(department);
                                      setShowSubOrganizationAssignDialog(true);
                                      fetchSubOrganization()
                                    }}
                                    className="bg-yellow-500 text-black py-1 px-4 rounded"
                                  >
                                    ASSIGN
                                  </button>
                                </td>
                              )
                            ) : null}

                            <td className="px-6 py-4 flex items-center justify-between w-1/2 gap-x-2">
                              <button
                                data-testid="editButton"
                                className={`text-lg text-blue-600 ${
                                  hasUpdateDepartmentPrivilege
                                    ? "text-blue-600 hover:underline"
                                    : " opacity-50 cursor-not-allowed"
                                }`}
                                onClick={() => {
                                  if (hasUpdateDepartmentPrivilege) {
                                    navigate(
                                      `/department/department-create-update`,
                                      {
                                        state: {
                                          isEditing: true,
                                          department,
                                          organizationId: selectedOrganization,
                                        },
                                      }
                                    );
                                  }
                                }}
                                disabled={!hasUpdateDepartmentPrivilege}
                              >
                                <FaRegEdit />
                              </button>
                              <button
                                disabled={!hasDeleteDepartmentPrivilege}
                                data-testid="delete-button"
                                to="#"
                                onClick={() => {
                                  setConfirmationModal({
                                    text1: "Are You Sure?",
                                    text2:
                                      "You want to delete this department. This department may contain important information. Deleting this department will remove all the details associated with it.",
                                    btn1Text: "Delete Department",
                                    btn2Text: "Cancel",
                                    btn1Handler: async () => {
                                      const response = await dispatch(
                                        deleteDepartment(
                                          AccessToken,
                                          department.departmentId
                                        )
                                      );
                                      if (response?.status !== 200)
                                        throw new Error(response.data.message);
                                      toast.success(response?.data?.message);
                                      // Fetch departments list based on the current selected organization
                                      fetchDepartmentsList(
                                        selectedOrganization
                                      );
                                      setConfirmationModal(null);
                                    },
                                    btn2Handler: () =>
                                      setConfirmationModal(null),
                                  });
                                }}
                                className={`text-red-600 text-lg   ${
                                  hasDeleteDepartmentPrivilege
                                    ? "text-red-600 text-lg"
                                    : "opacity-50 cursor-not-allowed"
                                }`}
                                style={{
                                  pointerEvents: hasDeleteDepartmentPrivilege
                                    ? "auto"
                                    : "none",
                                }}
                              >
                                <RiDeleteBin6Line />
                              </button>
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
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
      {showOrganizationAssignDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`p-6 rounded-lg shadow-lg max-w-sm w-full ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Assign Organization</h2>
            <div className="mb-4">
              <label
                htmlFor="organization-select"
                className="block text-sm font-medium"
              >
                Select Organization
              </label>
              <select
                id="organization-select"
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-700"
                } max-h-60 overflow-y-auto  ${
                  !hasGetAllOrganizationsPrivilege
                    ? "text-blue-400 cursor-not-allowed"
                    : "text-lg text-blue-600 dark:text-blue-500 hover:underline"
                }`}
                value={selectedAssignOrganization}
                disabled={!hasGetAllOrganizationsPrivilege} // Disable the select field based on privilege
                onChange={(e) => setSelectedAssignOrganization(e.target.value)}
              >
                <option value="">Select Organization</option>
                {AllOrganizations?.map((org) => (
                  <option key={org?.organizationId} value={org?.organizationId}>
                    {org.organizationName}
                  </option>
                ))}
              </select>
              {organizationError && (
                <p className="text-red-500 text-md mt-2">{organizationError}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                className={`py-2 px-4 rounded mr-2 ${
                  darkMode ? "bg-blue-500 text-white" : "bg-blue-600 text-white"
                }`}
                onClick={() =>
                  handleAssignOrganization(
                    selectedAssignOrganization,
                    currentDepartment.departmentId
                  )
                }
              >
                Assign
              </button>
              <button
                className={`py-2 px-4 rounded ${
                  darkMode ? "bg-gray-600 text-white" : "bg-gray-500 text-white"
                }`}
                onClick={() => setShowOrganizationAssignDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubOrganizationAssignDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`p-6 rounded-lg shadow-lg max-w-sm w-full ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              Assign Sub Organization
            </h2>
            <div className="mb-4">
              <label
                htmlFor="sub-organization-select"
                className="block text-sm font-medium"
              >
                Select Sub Organization
              </label>
              <select
                id="sub-organization-select"
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-700"
                } max-h-60 overflow-y-auto`}
                value={selectedAssignSubOrganization}
                onChange={(e) =>
                  setSelectedAssignSubOrganization(e.target.value)
                }
              >
                <option value="">Select Sub Organization</option>
                { AllSubOrganization && AllSubOrganization?.map((subOrg) => (
                  <option key={subOrg?.branchId} value={subOrg?.branchId}>
                    {subOrg.branchName}
                  </option>
                ))}
              </select>
              {subOrganizationError && (
                <p className="text-red-500 text-md mt-2">
                  {subOrganizationError}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                className={`py-2 px-4 rounded mr-2 ${
                  darkMode ? "bg-blue-500 text-white" : "bg-blue-600 text-white"
                }`}
                onClick={() =>
                  handleAssignSubOrganization(
                    selectedAssignSubOrganization,
                    currentDepartment.departmentId
                  )
                }
              >
                Assign
              </button>
              <button
                className={`py-2 px-4 rounded ${
                  darkMode ? "bg-gray-600 text-white" : "bg-gray-500 text-white"
                }`}
                onClick={() => setShowSubOrganizationAssignDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
