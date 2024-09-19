import React, { useEffect } from "react";
import AttendenceShift from "./AttendenceShift";
import AttendenceLocation from "./AttendenceLocation";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../../../../../slices/employeeSlice";

const AttendenceConfiguration = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch=useDispatch()

  useEffect(() => {
    dispatch(setStep(1));
  }, [dispatch]);

  return (
    <div>
      <div
        className={`pb-9 mb-5 mt-10 shadow-lg ${
          darkMode ? "bg-slate-800" : "bg-slate-100"
        } rounded-md mb-5`}
      >
        <div className="p-5 flex items-center justify-between">
          <div
            className={`text-xl ${
              darkMode ? "text-white" : "text-slate-600"
            } font-semibold`}
          >
            Attendence Configuration
          </div>
          <div>
            <p
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-slate-950"
              }`}
            >
              Home / Dashboard /
              <span className="text-yellow-700"> Attendence Configuration</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-evenly gap-x-2 w-full">
          <AttendenceShift />
          <AttendenceLocation />
        </div>
      </div>
    </div>
  );
};

export default AttendenceConfiguration;
