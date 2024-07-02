import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { formattedDate } from "../../../utils/dateFormatter";
import { FaPlus } from "react-icons/fa";

function EmployeePersonalInfo({ user }) {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const personalDetails = [
    {
      name: "First Name",
      value: user.firstName,
    },
    {
      name: "Last Name",
      value: user.lastName ? user.lastName : "Add Last Name",
    },
    {
      name: "Email",
      value: user?.email,
    },
    {
      name: "Contact Number",
      value: user.contact ? (
        user?.contact
      ) : (
        <p className="text-pink-600">Add Contact Number</p>
      ),
    },
    {
      name: "Date Of Birth",
      value: user?.dateOfBirth ? (
        formattedDate(user?.dateOfBirth)
      ) : (
        <p className="text-pink-600">Add Date Of Birth</p>
      ),
    },
    {
      name: "Gender",
      value: user?.gender ? (
        user?.gender
      ) : (
        <p className="text-pink-600">Add Gender</p>
      ),
    },
  ];

  return (
    <div className="">
      <div className="flex items-center justify-center flex-col gap-5 w-[75%] mx-auto">
        {/* Personal Details Section*/}
        <div className="flex gap-6 w-full flex-col p-8 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-xl text-red-950 font-semibold">
              Personal Details
            </p>
          </div>
          <div className="grid grid-cols-2 place-content-between gap-4">
            {personalDetails.map((element, index) => (
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
    </div>
  );
}

export default EmployeePersonalInfo;
