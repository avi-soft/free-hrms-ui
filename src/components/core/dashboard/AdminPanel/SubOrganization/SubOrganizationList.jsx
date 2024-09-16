import React, { useEffect, useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import Spinner from "../../../../common/Spinner.jsx";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { setOrganization } from "../../../../../slices/OrganisationSlice";
import { getOrganisation } from "../../../../../services/operations/OrganisationAPI";
import {
  AssignSubOrganizationToOrganization,
  deleteSubOrganisation,
  getSubOrganization,
  UnAssignedSubOrgList,
  UnassignSubOrganizationFromOrganization,
} from "../../../../../services/operations/subOrganisationAPI";
import {
  setSubOrganization,
  setLoading,
} from "../../../../../slices/subOrganizationSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setStep } from "../../../../../slices/employeeSlice.js";
const SubOrganizationList = () => {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [selectedOrganization, setSelectedOrganization] =
    useState("unassigned");
  const [updatedOrganization, setUpdatedOrganization] = useState("");
  const [showAssignDialog, setShowAssignDialog] = useState(false); // State for dialog visibility
  const [currentBranch, setCurrentBranch] = useState(null);
  const [selectedAssignOrganization, setSelectedAssignOrganization] =
    useState("");
  const [renderFlag, setRenderFlag] = useState(false);
  const [organizationError, setOrganizationError] = useState("");

  const { loading, AllSubOrganization } = useSelector(
    (state) => state.subOrganization
  );
  const { AllOrganizations } = useSelector((state) => state.Organisation);

  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchOrganizationList = async () => {
    try {
      dispatch(setLoading(true));
      const res = await dispatch(getOrganisation(AccessToken));
      const organizations = res?.data?.content;
      dispatch(setOrganization(organizations));
      if (organizations.length > 0) {
        // Set the updated organization if available
        const orgId = updatedOrganization;

        if (orgId) {
          setSelectedOrganization(orgId);
          fetchSubOrganization(orgId);
        } else {
          setSelectedOrganization("unassigned");
          fetchSubOrganization("unassigned");
        }
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching AllOrganizations", error);
      dispatch(setLoading(false));
    }
  };

  const fetchSubOrganization = async (orgId) => {
    console.log("org id", orgId);

    try {
      dispatch(setLoading(true));
      if (orgId == "unassigned") {
        console.log("inside if");
        const res = await dispatch(UnAssignedSubOrgList(AccessToken));
        console.log(res);
        dispatch(setSubOrganization(res?.data?.Branches?.content));
      } else {
        const res = await dispatch(getSubOrganization(AccessToken, orgId));
        dispatch(setSubOrganization(res?.data.BranchList));
      }

      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching departments", error);
      dispatch(setLoading(false));
    }
  };

  const handleAssignOrganization = async (orgId, branchId) => {
    if (!selectedAssignOrganization) {
      setOrganizationError("Please select an organization.");
      return;
    }
    setOrganizationError("");
    try {
      const response = await dispatch(
        AssignSubOrganizationToOrganization(AccessToken, orgId, branchId)
      );
      if (response?.status !== 200) throw new Error(response.data.message);
      toast.success(response?.data?.message);
      setRenderFlag(true);
      setShowAssignDialog(false); // Close dialog
    } catch (error) {
      console.error("Error assigning organization", error);
      toast.error("Failed to assign organization");
    }
  };
  const handleUnassignOrganization = async (AccessToken, orgId, branchId) => {
    try {
      // console.log(orgId, departmentId);

      const response = await dispatch(
        UnassignSubOrganizationFromOrganization(AccessToken, orgId, branchId)
      );
      if (response?.status !== 200) throw new Error(response.data.message);
      toast.success(response?.data?.message);
      fetchSubOrganization(selectedOrganization);
    } catch (error) {
      console.error("Error unassigning organization", error);
      toast.error("Failed to unassign organization");
    }
  };

  console.log(" all sub org", AllSubOrganization);

  function UnAssignAssignHeaders() {
    let headerFlag;
    AllSubOrganization?.map((subOrg, index) => {
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
  const AssignOrganizationHeaderFlag = UnAssignAssignHeaders();

  console.log("flag is", AssignOrganizationHeaderFlag);

  useEffect(() => {
    if (location.state?.updatedSuborganization) {
      setUpdatedOrganization(location.state.organizationId);
    } else if (location.state?.updatedSuborganization !== undefined) {
      setUpdatedOrganization(location.state.organizationId);
      // Reload departments or show updated message
    }
    fetchOrganizationList();
  }, [dispatch, AccessToken, location.state, updatedOrganization]);

  useEffect(() => {
    dispatch(setStep(1));
  }, [dispatch]);

  useEffect(() => {
    if (selectedOrganization) {
      fetchSubOrganization(selectedOrganization);
    }
  }, [selectedOrganization, setSelectedOrganization, renderFlag]);
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
              Sub Organization List
            </div>
            <div>
              <p className="text-xl font-semibold">
                Home / Dashboard /
                <span className="text-yellow-700"> Sub Organization List</span>
              </p>
            </div>
          </div>
          {/* Section 2 */}
          <div className="m-5 flex flex-col lg:flex-row items-start lg:items-center justify-between rounded p-5">
            <Link
              to="/suborganization/suborganization-create-update"
              className={`flex items-center gap-x-1 ${
                darkMode ? "primary-gradient " : "bg-red-600"
              } w-fit p-2 rounded-lg mb-3 lg:mb-0 text-white`}
            >
              <span>
                <HiOutlinePlusCircle />
              </span>
              <button>Add Sub Organization</button>
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
                You need to create an organization before managing
                sub-organizations.
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
                  <option value="unassigned">
                    Unassigned SubOrganizations
                  </option>

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
              {AllSubOrganization?.length === 0 ? (
                <div>
                  <h1
                    data-testid="No Departments Found"
                    className="text-center text-2xl mt-10"
                  >
                    No SubOrganization Found
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
                          {selectedOrganization == "unassigned" && (
                            <th
                              scope="col"
                              className="px-6 py-3"
                              data-testid="Department-Description-header"
                            >
                              Sub Organization Id
                            </th>
                          )}
                          <th
                            scope="col"
                            className="px-6 py-3"
                            data-testid="Department-Name-header"
                          >
                            SubOrganization Name
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
                        {AllSubOrganization?.map((subOrganization, index) => (
                          <tr
                            key={subOrganization.branchId}
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
                            {selectedOrganization == "unassigned" && (
                              <td className="px-6 py-4">
                                {subOrganization.branchId}
                              </td>
                            )}
                            <td className="px-6 py-4">
                              {subOrganization.branchName}
                            </td>
                            {AssignOrganizationHeaderFlag ? (
                              <td className="px-6 py-4 ">
                                <button
                                  data-testid="unassign-button"
                                  onClick={() =>
                                    handleUnassignOrganization(
                                      AccessToken,
                                      selectedOrganization,
                                      subOrganization.branchId
                                    )
                                  }
                                  className="bg-yellow-500 text-black py-1 px-4 rounded"
                                >
                                  UNASSIGN
                                </button>
                              </td>
                            ) : (
                              <td className="px-6 py-4 ">
                                <button
                                  data-testid="assign-button"
                                  onClick={() => {
                                    setCurrentBranch(subOrganization);
                                    setShowAssignDialog(true);
                                  }}
                                  className="bg-yellow-500 text-black py-1 px-4 rounded"
                                >
                                  ASSIGN
                                </button>
                              </td>
                            )}

                            <td className="px-6 py-4 flex gap-x-2">
                              <button
                                data-testid="editButton"
                                className="text-lg text-blue-600 dark:text-blue-500 hover:underline"
                                onClick={() =>
                                  navigate(
                                    `/suborganization/suborganization-create-update`,
                                    {
                                      state: {
                                        isEditing: true,
                                        subOrganization,
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
                                    text1: "Are You Sure?",
                                    text2:
                                      "You want to Delete this SubOrganization. This SubOrganization may contain important Information. Deleting this SubOrganization will remove all the details associated with it.",
                                    btn1Text: "Delete SubOrganization",
                                    btn2Text: "Cancel",
                                    btn1Handler: async () => {
                                      const response = await dispatch(
                                        deleteSubOrganisation(
                                          AccessToken,
                                          subOrganization.branchId
                                        )
                                      );
                                      if (response?.status !== 200)
                                        throw new Error(response.data.message);
                                      toast.success(response?.data?.message);
                                      // Fetch departments list based on the current selected organization
                                      fetchSubOrganization(
                                        selectedOrganization
                                      );
                                      setConfirmationModal(null);
                                    },
                                    btn2Handler: () =>
                                      setConfirmationModal(null),
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
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
      {showAssignDialog && (
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
                } max-h-60 overflow-y-auto`} // Apply max-height and scrolling
                value={selectedAssignOrganization}
                onChange={(e) => setSelectedAssignOrganization(e.target.value)}
              >
                <option value="">Select Organization</option>
                {AllOrganizations.map((org) => (
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
                    currentBranch.branchId
                  )
                }
              >
                Assign
              </button>
              <button
                className={`py-2 px-4 rounded ${
                  darkMode ? "bg-gray-600 text-white" : "bg-gray-500 text-white"
                }`}
                onClick={() => setShowAssignDialog(false)}
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

export default SubOrganizationList;
