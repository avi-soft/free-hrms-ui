import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ConfirmationModal from "../../../../common/ConfirmationModal.jsx";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../common/Spinner.jsx";
import {
  setLoading,
  setOrganization,
} from "../../../../../slices/OrganisationSlice.js";

const OrganizationList = () => {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.organization);
  const { organizations } = useSelector((state) => state.organization);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizationList = async () => {
      try {
        dispatch(setLoading(true));
        const res = await dispatch(getOrganization(AccessToken));
        dispatch(setOrganization(res?.data));
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching organizations", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchOrganizationList();
  }, [dispatch, AccessToken]);

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
            <div className="text-xl font-semibold mb-2 lg:mb-0">
              Organization List
            </div>
            <div>
              <p className="text-xl font-semibold">
                Home / Dashboard /
                <span className="text-yellow-700"> Organization List</span>
              </p>
            </div>
          </div>
          {/* Section 2 */}
          <div className="m-5 flex flex-col lg:flex-row items-start lg:items-center justify-between rounded p-5">
            <div
              className={`flex items-center gap-x-1 ${
                darkMode ? "primary-gradient " : "bg-red-600"
              } w-fit p-2 rounded-lg mb-3 lg:mb-0 text-white`}
            >
              <span>
                <HiOutlinePlusCircle />
              </span>
              <button
                onClick={() =>
                  navigate("/organization/organization-create-update", {
                    state: { isEditing: false },
                  })
                }
              >
                Add Organization
              </button>
            </div>
          </div>
          {/* Section 3 */}

          {organizations.length === 0 ? (
            <div>
              <h1 className="text-center text-2xl mt-10">
                No Organizations Found
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
                        data-testid="sno-header"
                      >
                        S No.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                        data-testid="organization-name-header"
                      >
                        Organization Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                        data-testid="organization-head-header"
                      >
                        Organization Head
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
                    {organizations?.map((organization, index) => (
                      <tr
                        key={organization.organizationId}
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
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">
                          {organization.organizationName}
                        </td>
                        <td className="px-6 py-4">
                          {organization.organizationHead
                            ? `${organization.organizationHead.firstName} ${organization.organizationHead.lastName}`
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 flex gap-x-2">
                          <button
                            className="text-lg text-blue-600 dark:text-blue-500 hover:underline"
                            onClick={() =>
                              navigate(
                                `/organization/organization-create-update`,
                                {
                                  state: {
                                    isEditing: true,
                                    organization,
                                  },
                                }
                              )
                            }
                          >
                            <FaRegEdit />
                          </button>
                          <Link
                            onClick={() =>
                              setConfirmationModal({
                                text1: "Are You Sure?",
                                text2:
                                  "You want to Delete this Organization. Deleting this Organization may affect other functionalities. Are you sure you want to proceed?",
                                btn1Text: "Delete Organization",
                                btn2Text: "Cancel",
                                btn1Handler: async () => {

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

          {confirmationModal && (
            <ConfirmationModal modalData={confirmationModal} />
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationList;
