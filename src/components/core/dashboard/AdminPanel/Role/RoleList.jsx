import React, { useEffect, useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ExportDataJSON from "../../../../../utils/ExportFromJson";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import Spinner from "../../../../common/Spinner";
import {
  deleteRole,
  getRole,
} from "../../../../../services/operations/roleAPI";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { setRoles, setLoading } from "../../../../../slices/roleSlice";
import { setStep } from "../../../../../slices/employeeSlice";

const RoleList = () => {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const { loading, roles } = useSelector((state) => state.role);
  const hasCreateRolePrivilege =
    user?.roles?.[0]?.privilege?.includes("CREATE_ROLE");
  const hasUpdateRolePrivilege =
    user?.roles?.[0]?.privilege?.includes("UPDATE_ROLE");
  const hasDeleteRolePrivilege =
    user?.roles?.[0]?.privilege?.includes("DELETE_ROLE");

  const [confirmationModal, setConfirmationModal] = useState(null);
  console.log(confirmationModal);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    dispatch(setStep(1));
  }, [dispatch]);

  const fetchRoles = async () => {
    try {
      dispatch(setLoading(true));
      console.log("Fetching roles...");
      const res = await dispatch(getRole(AccessToken));
      dispatch(setRoles(res?.data));
    } catch (error) {
      console.error("Error fetching roles", error);
    } finally {
      dispatch(setLoading(false));
      console.log("Loading state set to false");
    }
  };

  const handleEdit = (role) => {
    navigate("/role/role-create-update", { state: { isEditing: true, role } });
  };

  return (
    <div className={` mb-2 rounded-md ${darkMode ? "text-white" : ""}`}>
      {loading ? (
        <div
          data-testid="spinner"
          className="absolute grid place-content-center mt-60 w-[85%]"
        >
          <Spinner />
        </div>
      ) : (
        <div
          className={`pb-9 ${
            darkMode ? "bg-gray-800" : "bg-slate-100"
          } rounded mt-10`}
        >
          <div className="p-5 flex items-center justify-between">
            <div
              data-testid="Role List"
              className={`text-xl ${
                darkMode ? "text-white" : "text-slate-600"
              } font-semibold`}
            >
              Role List
            </div>
            <div>
              <p
                className={`text-xl left-6 font-semibold ${
                  darkMode ? "text-white" : "text-slate-950"
                }`}
              >
                Home / Dashboard /{" "}
                <span data-testid="side-header" className="text-yellow-700">
                  Role List
                </span>
              </p>
            </div>
          </div>
          <div className="m-5 flex items-center justify-between rounded p-5">
            <Link
              to={hasCreateRolePrivilege ? "/role/role-create-update" : "#"}
              className={`flex items-center ${
                darkMode ? "primary-gradient" : ""
              } text-white gap-x-1 bg-red-600 w-fit p-2 rounded-lg ${
                !hasCreateRolePrivilege ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={(e) => !hasCreateRolePrivilege && e.preventDefault()} // Prevent navigation if no privilege
            >
              <span>
                <HiOutlinePlusCircle />
              </span>
              <button disabled={!hasCreateRolePrivilege}>New Role</button>
            </Link>
          </div>

          <div className="p-5">
            {roles?.length > 0 ? (
              <div className="relative overflow-x-auto shadow-md rounded-md">
                <div
                  className={`p-5 ${
                    darkMode ? "bg-slate-700" : "bg-slate-200"
                  }`}
                >
                  <table
                    className={`w-full text-sm rounded-md text-left rtl:text-right ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    } dark:text-gray-400`}
                  >
                    <thead
                      className={`text-base border-b-[1px] ${
                        darkMode
                          ? "text-gray-200 bg-gray-800"
                          : "text-black bg-slate-300"
                      }`}
                    >
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3"
                          data-testid="serial-number-header"
                        >
                          S. No.
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3"
                          data-testid="role-header"
                        >
                          Role
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
                      {roles.map((role, index) => (
                        <tr
                          key={role?.role}
                          className={
                            index % 2 === 0
                              ? `${
                                  darkMode
                                    ? "bg-gray-800 text-white"
                                    : "bg-white text-black"
                                }`
                              : `${
                                  darkMode
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-100 text-black"
                                }`
                          }
                        >
                          <td className="px-6 py-4">{index + 1}</td>
                          <td scope="row" className="px-6 py-4">
                            {role?.role}
                          </td>
                          <td className="px-6 py-4 flex gap-x-1">
                            <button
                              disabled={!hasUpdateRolePrivilege}
                              className="mr-2"
                              onClick={() => handleEdit(role)}
                            >
                              <FaRegEdit
                                className={`${
                                  darkMode ? "text-yellow-500" : "text-blue-500"
                                } ${
                                  !hasUpdateRolePrivilege &&
                                  "cursor-not-allowed opacity-50"
                                }`}
                              />
                            </button>
                            <button
                              disabled={!hasDeleteRolePrivilege}
                              data-testid="deleteBtn"
                              className={`${
                                darkMode ? "text-red-400" : "text-red-600"
                              } text-lg  ${
                                !hasDeleteRolePrivilege &&
                                "cursor-not-allowed opacity-50"
                              }`}
                              onClick={() =>
                                setConfirmationModal({
                                  text1: "Are you sure?",
                                  text2:
                                    "You want to delete this selected role from the records.",
                                  btn1Text: "Delete Role",
                                  btn2Text: "Cancel",
                                  btn1Handler: async () => {
                                    const response = await dispatch(
                                      deleteRole(AccessToken, role?.roleId)
                                    );
                                    console.log(response);
                                    if (response?.status != 200) return null;
                                    else {
                                      fetchRoles();
                                      toast.success(response?.data?.message);
                                      setConfirmationModal(null);
                                    }
                                  },
                                  btn2Handler: () => setConfirmationModal(null),
                                })
                              }
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
            ) : (
              <p data-testid="no-role-found" className="text-center mt-[7%]">
                No roles found
              </p>
            )}
          </div>
          {confirmationModal && (
            <div data-testid="ConfirmationModal">
              <ConfirmationModal modalData={confirmationModal} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleList;
