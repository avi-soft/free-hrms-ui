import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { formattedDate } from "../../../utils/dateFormatter";
const EmployeeAdditionalInfo = ({ user }) => {
  const navigate = useNavigate();



  const additionalDetails = [
    {
      name: "Department",
      value: user?.department || (
        <p className="text-pink-600">Add Department</p>
      ),
    },
    {
      name: "Position",
      value: user.position || <p className="text-pink-600">Add Position</p>,
    },
    {
      name: "Employee Code",
      value: user?.employeeCode || (
        <p className="text-pink-600">Add Employee Code</p>
      ),
    },
    {
      name: "Role",
      value: user?.roles[0]?.role || <p className="text-pink-600">Add Role</p>,
    },
    {
      name: "Join Date",
      value: user.joinDate ? (
        formattedDate(user.joinDate)
      ) : (
        <p className="text-pink-600">Add Join Date</p>
      ),
    },
    {
      name: "Aadhar Number",
      value: user.adhaarNumber || (
        <p className="text-pink-600">Add Aadhar Number</p>
      ),
    },
    {
      name: "PAN Number",
      value: user.panNumber || <p className="text-pink-600">Add PAN Number</p>,
    },
    {
      name: "UAN Number",
      value: user.uanNumber || <p className="text-pink-600">Add UAN Number</p>,
    },
    {
      name: "Salary",
      value: user.salary || <p className="text-pink-600">Add Salary</p>,
    },
  ];

  return (
    <div className="flex items-center justify-center flex-col gap-5 w-[75%] mx-auto">
      {/* Additional Details Section*/}
      <div className="flex gap-6 w-full flex-col p-8 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-xl text-red-950 font-semibold">
            Additional Details
          </p>
        </div>
        <div className="grid grid-cols-2 place-content-between gap-4">
          {additionalDetails.map((element, index) => (
            <div key={index} className="flex flex-col gap-1">
              <p className="text-xs text-zinc-700 font-bold">
                {element.name}
                <sup className="text-red-600">*</sup>
              </p>
              <div className="text-black">{element.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAdditionalInfo;
