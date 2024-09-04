import React, { useEffect, useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import Spinner from "../../../../common/Spinner.jsx";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { setOrganization } from "../../../../../slices/OrganisationSlice";
import { getOrganisation } from "../../../../../services/operations/OrganisationAPI";
import { deleteSubOrganisation, getSubOrganization } from "../../../../../services/operations/subOrganisationAPI";
import {
  setSubOrganization,
  setLoading,
} from "../../../../../slices/subOrganizationSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
const SubOrganizationList = () => {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [updatedOrganization, setUpdatedOrganization] = useState("");
  const [showAssignDialog, setShowAssignDialog] = useState(false); // State for dialog visibility
  const [currentBranch, setCurrentBranch] = useState(null);
  const { loading, AllSubOrganization } = useSelector((state) => state.subOrganization);
  const { AllOrganizations } = useSelector((state) => state.Organisation);

  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const location = useLocation();
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
        fetchSubOrganization(orgId);
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching AllOrganizations", error);
      dispatch(setLoading(false));
    }
  };

  const fetchSubOrganization = async (orgId) => {
    try {
      dispatch(setLoading(true));
      const res = await dispatch(
        getSubOrganization(AccessToken, orgId)
      );
      dispatch(setSubOrganization(res?.data.BranchList));
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching departments", error);
      dispatch(setLoading(false));
    }
  };

  const handleAssignOrganization = async (orgId, departmentId) => {

    console.log(orgId,departmentId);

    try {
      const response = await dispatch(
        AssignDepartmentOrganization(AccessToken, orgId, departmentId)
      );
      if (response?.status !== 200) throw new Error(response.data.message);
      toast.success(response?.data?.message);
      fetchDepartmentsList(selectedAssignOrganization); // Refresh department list
      setShowAssignDialog(false); // Close dialog
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

  console.log(" all sub org",AllSubOrganization);
  

  function UnAssignAssignHeaders() {
    let headerFlag;
    AllSubOrganization?.map((department, index) => {
      const hasOrganization = department?.organizations?.length > 0;
      const organizationId = hasOrganization
        ? department.organizations[0].organizationId
        : null;
      if (organizationId) {
        headerFlag = true;
      } else {
        headerFlag = false;
      }
    });
    return headerFlag;
  }
  const AssignOrganizationHeaderFlag = UnAssignAssignHeaders();

  console.log("flag is", AssignOrganizationHeaderFlag);

  useEffect(() => {
    if (location.state?.updatedSuborganization) {
      setUpdatedOrganization(location.state.organizationId || "");
    }
     else if (location.state?.updatedSuborganization !== undefined) {
      setUpdatedOrganization(location.state.organizationId || "");
      // Reload departments or show updated message
    }
    fetchOrganizationList();
  }, [dispatch, AccessToken, location.state, updatedOrganization]);

  useEffect(() => {
    if (selectedOrganization) {
        fetchSubOrganization(selectedOrganization);
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
              SubOrganization List
            </div>
            <div>
              <p className="text-xl font-semibold">
                Home / Dashboard /
                <span className="text-yellow-700"> SubOrganization List</span>
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
              <button>Add SubOrganization</button>
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
                          <th
                            scope="col"
                            className="px-6 py-3"
                            data-testid="Department-Name-header"
                          >
                            SubOrganization Name
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
                            <td className="px-6 py-4">
                              {subOrganization.branchName}
                            </td>
                         
                           
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
    </div>
  );
};

export default SubOrganizationList;
