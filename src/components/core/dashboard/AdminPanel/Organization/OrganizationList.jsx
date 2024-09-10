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
import {
  deleteOrganisation,
  getOrganisation,
} from "../../../../../services/operations/OrganisationAPI.js";
import toast from "react-hot-toast";

const OrganizationList = () => {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.Organisation);
  const { AllOrganizations } = useSelector((state) => state.Organisation);
  const navigate = useNavigate();
  const organizationsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);


  console.log(loading);
  console.log(AllOrganizations);

  const fetchOrganizationList = async (currentPage) => {
    try {
      dispatch(setLoading(true));
      const res = await dispatch(getOrganisation(AccessToken,currentPage,organizationsPerPage));
      console.log(res);
      console.log(res?.data);
      dispatch(setOrganization(res?.data?.content));
      setTotalPages(res?.data?.totalPages)
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching AllOrganizations", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchOrganizationList(currentPage);
  }, [dispatch, AccessToken,currentPage]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  return (
    <div
      className={` mb-10 rounded shadow-lg ${
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
            <Link to="/organization/organization-create-update">
              <div
                className={`flex items-center gap-x-1 ${
                  darkMode ? "primary-gradient " : "bg-red-600"
                } w-fit p-2 rounded-lg mb-3 lg:mb-0 text-white`}
              >
                <span>
                  <HiOutlinePlusCircle />
                </span>
                <button>Add Organization</button>
              </div>
            </Link>
          </div>
          {/* Section 3 */}

          {/* add two numbers */}

          {AllOrganizations.length === 0 ? (
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
                        Organization Logo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                        data-testid="organization-head-header"
                      >
                        Organization Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                        data-testid="organization-head-header"
                      >
                        Organization Details
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
                    {AllOrganizations?.map((organization, index) => (
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
                        <td scope="row" className="px-6 py-4 ">
                          <div className="flex justify-start">
                            <img
                              className="rounded-full aspect-square w-[30px] h-[30px] object-cover"
                              src={organization?.organizationImage}
                              alt={`${organization?.organizationName}`}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {organization.organizationName}
                        </td>
                        <td className="px-6 py-4">
                          {organization.organizationDescription.length > 20
                            ? `${organization.organizationDescription.slice(
                                0,
                                50
                              )}...`
                            : organization.organizationDescription}
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
                                  const response = await dispatch(
                                    deleteOrganisation(
                                      AccessToken,
                                      organization?.organizationId
                                    )
                                  );
                                  console.log(response);
                                  if (response?.status != 200) return null;
                                  else {
                                    toast.success(response?.data?.message);
                                    fetchOrganizationList();
                                    setConfirmationModal(null);
                                  }
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
                <div className="flex justify-between p-5">
                        <button
                          onClick={handlePreviousPage}
                          disabled={currentPage === 0}
                          className={` text-white p-2 rounded disabled:opacity-50 ${
                            darkMode ? "bg-gray-600" : "bg-slate-400"
                          }`}
                        >
                          Previous
                        </button>
                        <button
                          onClick={handleNextPage}
                          disabled={
                            currentPage === totalPages - 1 ||
                            AllOrganizations.length < organizationsPerPage
                          }
                          className={` text-white p-2 disabled:opacity-50 text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                            darkMode ? "bg-gray-600" : "bg-slate-400"
                          }`}
                        >
                          Next
                        </button>
                      </div>
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
