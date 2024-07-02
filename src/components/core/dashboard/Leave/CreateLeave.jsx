import React from "react";
import { useForm } from "react-hook-form";
import { createLeave } from "../../../../services/operations/leaveAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const CreateLeave = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { AccessToken } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const employeeId = user?.employeeId;
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);

  const onSubmit = (data) => {
    console.log(data);
    const response = dispatch(
      createLeave(employeeId, data, AccessToken, navigate)
    );
  };

  return (
    <div
      className={`pb-9 mt-5 ${
        darkMode ? " bg-slate-700" : "bg-slate-100"
      } rounded-md mb-5`}
    >
      <div className="p-5 flex items-center justify-between">
        <div
          className={`text-xl ${
            darkMode ? "text-white" : "text-slate-600"
          } font-semibold`}
        >
          New Leave
        </div>
        <div>
          <p
            className={`text-xl left-6 font-semibold ${
              darkMode ? "text-white" : "text-slate-950"
            }`}
          >
            Home / Dashboard /<span className="text-yellow-700">New Leave</span>
          </p>
        </div>
      </div>

      <form
        className="p-5"
        data-testid="create-leave-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-4">
            <label
              htmlFor="leaveType"
              className={`block text-sm font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              } mb-1`}
            >
              Leave Type<sup className="text-red-900">*</sup>
            </label>
            <select
              id="leaveType"
              {...register("leaveType", { required: true })}
              className={`bg-richblack-800 rounded-[0.5rem] w-full p-[12px] border-b-[1px] border-slate-800 ${
                darkMode ? "bg-gray-500 text-white" : ""
              }`}
              data-testid="leave-type-select"
            >
              <option value="">Select Leave Type</option>
              <option value="PLANNED">Planned Leave</option>
              <option value="SICK">Medical Leave</option>
            </select>
            {errors.leaveType && (
              <span
                className={`text-red-600 ${darkMode ? "text-red-400" : ""}`}
              >
                This field is required
              </span>
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="numberOfDays"
              className={`block text-sm font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              } mb-1`}
            >
              Number of Days<sup className="text-red-900">*</sup>
            </label>
            <input
              type="number"
              id="numberOfDays"
              {...register("numberOfDays", { required: true, min: 1 })}
              className={`bg-richblack-800 rounded-[0.5rem] w-full p-[12px] border-b-[1px] border-slate-800 ${
                darkMode ? "bg-gray-500 text-white" : ""
              }`}
              placeholder="Enter Number of Days"
              data-testid="number-of-days-input"
            />
            {errors.numberOfDays && (
              <span className="text-red-600">
                This field is required and must be at least 1 day
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-4">
            <label
              htmlFor="startDate"
              className={`block text-sm font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              } mb-1`}
            >
              Start Leave Date<sup className="text-red-900">*</sup>
            </label>
            <input
              type="date"
              id="startDate"
              {...register("startDate", { required: true })}
              className={`bg-richblack-800 rounded-[0.5rem] w-full p-[12px] border-b-[1px] border-slate-800 ${
                darkMode ? "bg-gray-500 text-white" : ""
              }`}
              data-testid="start-date-input"
            />
            {errors.startDate && (
              <span className="text-red-600">This field is required</span>
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="endDate"
              className={`block text-sm font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              } mb-1`}
            >
              End Leave Date<sup className="text-red-900">*</sup>
            </label>
            <input
              type="date"
              id="endDate"
              {...register("endDate", { required: true })}
              className={`bg-richblack-800 rounded-[0.5rem] w-full p-[12px] border-b-[1px] border-slate-800 ${
                darkMode ? "bg-gray-500 text-white" : ""
              }`}
              data-testid="end-date-input"
            />
            {errors.endDate && (
              <span className="text-red-600">This field is required</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="mt-4">
            <label
              htmlFor="leaveDetails"
              className={`block text-sm font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              } mb-1`}
            >
              Leave Details<sup className="text-red-900">*</sup>
            </label>
            <textarea
              id="reason"
              {...register("reason", { required: true })}
              className={`bg-richblack-800 rounded-[0.5rem] w-full p-[12px] border-b-[1px] border-slate-800 ${
                darkMode ? "bg-gray-500 text-white" : ""
              }`}
              placeholder="Enter Leave Details"
              data-testid="leave-details-input"
            ></textarea>
            {errors.leaveDetails && (
              <span className="text-red-600">This field is required</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={` mt-5 text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
            darkMode ? "primary-gradient" : "bg-blue-700 text-white"
          } py-1 px-5`}
          data-testid="submit-button"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateLeave;
