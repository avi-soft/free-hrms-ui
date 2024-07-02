import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { GrDocumentCsv } from "react-icons/gr";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SiMicrosoftexcel } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  EmployeeDelete,
  EmployeesList,
} from "../../../../../services/operations/employeeAPI";
import {
  setEditing,
  setPreEditedEmployeeDetails,
} from "../../../../../slices/editingSlice";
import { setStep } from "../../../../../slices/employeeSlice";
import ExportDataJSON from "../../../../../utils/ExportFromJson";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import Spinner from "../../../../common/Spinner";
import axios from "axios";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const employeesPerPage = 5;
  const navigate = useNavigate();



  useEffect(() => {
    fetchEmployeesList(currentPage);
  }, [currentPage]);

  const fetchEmployeesList = async (page) => {
    try {
      setLoading(true);
      const res = await dispatch(
        EmployeesList(AccessToken, page, employeesPerPage)
      );
      setEmployees(res?.data?.Users);
      setTotalPages(Math.ceil(res.data.totalCount / employeesPerPage));
    } catch (error) {
      console.error("Error fetching employees", error);
    }
    setLoading(false);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) =>(prevPage -  1));
  };

  const handleEdit = async (employee) => {
    console.log(employee?.employeeId)
      const response = await axios.get(`http://ec2-16-16-249-120.eu-north-1.compute.amazonaws.com/api/v1/employee/${employee.employeeId}`,{
        headers:{
        Authorization : `Bearer ${AccessToken}`
    }});
    const editedEmployeeData=response?.data?.Employee;

    console.log(editedEmployeeData);
    dispatch(setEditing(true));
    dispatch(setPreEditedEmployeeDetails(editedEmployeeData));
    navigate("/employee/employee-create-update", { state: { employee } });
    dispatch(setStep(2));
  };

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <div
      className={` h-lvh mb-2 rounded-md ${
        darkMode ? " text-white" : ""
      }`}
    >
      {loading ? (
        <div className="absolute grid place-content-center  h-[70%] w-[85%]">
          <Spinner />
        </div>
      ) : (
        <div
          className={`pb-9  ${
            darkMode ? "bg-gray-800" : "bg-slate-100"
          } rounded mt-10`}
        >
          <div className="p-5 flex items-center justify-between">
            <div
              className={`text-xl ${
                darkMode ? "text-white" : "text-slate-600"
              } font-semibold`}
            >
              Employee List
            </div>
            <div>
              <p
                className={`text-xl left-6 font-semibold ${
                  darkMode ? "text-white" : "text-slate-950"
                }`}
              >
                Home / Dashboard /
                <span className="text-yellow-700">Employee List</span>
              </p>
            </div>
          </div>
          <div className="m-5 flex items-center justify-between rounded p-5">
            <div
              className={`flex items-center   ${
                darkMode ? "primary-gradient" : ""
              } text-white gap-x-1 bg-red-600 w-fit p-2 rounded-lg`}
            >
              <span>
                <HiOutlinePlusCircle />
              </span>
              <button>
                <Link to="/employee/employee-create-update">New Employee</Link>
              </button>
            </div>
            <div className="flex items-center gap-x-7">
              <div
                className={`gap-x-2 ${
                  darkMode ? " bg-blue-800" : "bg-slate-200"
                } p-2 rounded-md`}
              >
                <button
                  onClick={() => ExportDataJSON(employees, "Employee", "xls")}
                  data-testid="export-excel-button"
                >
                  <div className="flex items-center gap-x-1">
                    <SiMicrosoftexcel />
                    <span>Export</span>
                  </div>
                </button>
              </div>
              <div
                onClick={() => ExportDataJSON(employees, "Employee", "csv")}
                className={`gap-x-2 ${
                  darkMode ? " bg-blue-800" : "bg-slate-200"
                } p-2 rounded-md`}
                data-testid="export-csv-button"
              >
                <button>
                  <GrDocumentCsv />
                </button>
                <span>Export</span>
              </div>
            </div>
          </div>
          <div className="p-5">
            {employees?.length > 0 ? (
              <div className="relative overflow-x-auto shadow-md rounded-md">
                <div
                  className={` p-5  ${
                    darkMode ? " bg-slate-700" : "bg-slate-200"
                  }`}
                >
                  <table
                    className={`w-full text-sm rounded-md  text-left rtl:text-right ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    } dark:text-gray-400`}
                  >
                    <thead
                      className={` text-base  border-b-[1px] ${
                        darkMode
                          ? "text-gray-200 bg-gray-800"
                          : "text-black bg-slate-300"
                      }`}
                    >
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3"
                          data-testid="avatar-header"
                        >
                          Avatar
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3"
                          data-testid="name-header"
                        >
                          Employee Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3"
                          data-testid="email-header"
                        >
                          Employee Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3"
                          data-testid="address-header"
                        >
                          Employee Code
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
                      {employees.map((employee, index) => (
                        <tr
                          key={employee?.employeeId}
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
                          <td scope="row" className="px-6 py-4 w-10">
                            <div className="flex justify-start">
                              <img
                                className="rounded-full aspect-square w-[30px] h-[30px] object-cover"
                                src={employee?.profileImage}
                                alt={`${employee?.firstName}`}
                              />
                            </div>
                          </td>
                          <td scope="row" className="px-6 py-4">
                            <Link
                              to={`/employee-info/${employee?.employeeName}`}
                              className={`${
                                darkMode ? "text-yellow-500" : "text-blue-500"
                              }`}
                            >
                              {employee?.employeeName}
                            </Link>
                          </td>
                          <td className="px-6 py-4">{employee?.email}</td>
                          <td className="px-6 py-4">
                            {employee?.employeeCode}
                          </td>
                          <td className="px-6 py-4 flex gap-x-2">
                            <button onClick={() => handleEdit(employee)}>
                              <FaRegEdit
                                className={`${
                                  darkMode ? "text-yellow-500" : "text-blue-500"
                                }`}
                              />
                            </button>
                            <button
                              className={`${
                                darkMode ? "text-red-400" : "text-red-600"
                              } text-lg`}
                              onClick={() =>
                                setConfirmationModal({
                                  text1: "Are you sure?",
                                  text2:
                                    "You want to delete this selected employee from the records.",
                                  btn1Text: "Delete Employee",
                                  btn2Text: "Cancel",
                                  btn1Handler: async () => {
                                    await dispatch(
                                      EmployeeDelete(
                                        employee?.userId,
                                        AccessToken
                                      )
                                    );
                                    refreshPage();
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
                      disabled={currentPage === totalPages}
                      className={` text-white p-2 disabled:opacity-50 text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                        darkMode ? "bg-gray-600" : "bg-slate-400"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p
                data-testid="no-employee-found"
                className="text-center mt-[7%]"
              >
                No employees found
              </p>
            )}
          </div>
          {confirmationModal && (
            <ConfirmationModal modalData={confirmationModal} />
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
