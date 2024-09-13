import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  AddShiftTimings,
  DeleteShiftTimings,
  GetShiftTimings,
  UpdateShiftTimings,
} from "../../../../../services/operations/AttendenceAPI";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const AttendenceShift = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const { AccessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [shiftTimings, setShiftTimings] = useState([]);
  const [editingShift, setEditingShift] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const parseShiftDuration = (duration) => {
    const hoursMatch = duration.match(/(\d+)H/); // Extract hours
    const minutesMatch = duration.match(/(\d+)M/); // Extract minutes

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    return { hours, minutes };
  };

  const fetchShiftTime = async () => {
    const response = await dispatch(GetShiftTimings(AccessToken));
    const formattedShiftTimings = response?.data?.ShiftDurationList.map(
      (shift) => {
        const { hours, minutes } = parseShiftDuration(shift.shiftDuration);
        return {
          ...shift,
          shiftDurationHours: hours,
          shiftDurationMinutes: minutes,
        };
      }
    );
    setShiftTimings(formattedShiftTimings);
  };

  useEffect(() => {
    fetchShiftTime();
  }, []);

  console.log(shiftTimings);

  // Submit handler for the form
  const onSubmit = async (data) => {
    const { shiftTime } = data;
    const [hours, minutes] = shiftTime.split(":").map(Number);

    const shiftData = {
      shiftDurationHours: hours,
      shiftDurationMinutes: minutes,
    };

    console.log("Shift Timings Submitted: ", shiftData);

    if (editingShift !== null) {
      const shiftToEdit = shiftTimings[editingShift];
      const response = await dispatch(
        UpdateShiftTimings(shiftData, AccessToken)
      );
      console.log("Shift Updated Response: ", response);
      if (response?.status !== 200) throw new Error(response);
      else {
        console.log("esle");

        toast.success(response?.data?.message);
        setEditingShift(null);
        fetchShiftTime();
      }
    } else {
      const response = await dispatch(AddShiftTimings(shiftData, AccessToken));
      console.log("Shift Added Response: ", response);
      if (response?.status !== 201) throw new Error(response);
      toast.success(response?.data?.message);
      fetchShiftTime();
    }

    reset();
  };

  // Handle edit shift
  const handleEdit = (index) => {
    const shift = shiftTimings[index];
    const shiftTime = `${String(shift.shiftDurationHours).padStart(
      2,
      "0"
    )}:${String(shift.shiftDurationMinutes).padStart(2, "0")}`;
    setValue("shiftTime", shiftTime);
    setEditingShift(index);
  };

  // Handle delete shift
  const handleDelete = async (index) => {
    console.log(index);

    const response = await dispatch(DeleteShiftTimings(index, AccessToken));
    if (response?.status !== 200) throw new Error(response);
    else {
      toast.success(response?.data?.message);
      fetchShiftTime();
    }
    //   console.log();
  };

  const shiftTimePattern = /^(2[0-4]|[01]?[0-9]):[0-5][0-9]$/;

  return (
    <div>
      <div
        className={` pb-9  w-[500px] h-[400px] mb-5 mt-10 shadow-lg ${
          darkMode ? "bg-slate-700" : "bg-slate-50"
        } rounded-md mb-5`}
      >
        <h1
          className={`text-center font-semibold ${
            darkMode ? "text-white" : "text-blue-900"
          } mt-10 pt-5 text-2xl`}
        >
          Add Shift Details
        </h1>

        {/* Shift Timing Form */}
        <form
          className="flex flex-col items-center mt-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Input for shift time */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Shift Timings (HH:mm)
            </label>
            <input
              type="text"
              className={`p-2 border ${
                errors.shiftTime
                  ? "border-red-500"
                  : darkMode
                  ? "border-gray-600"
                  : "border-gray-300"
              } rounded-md w-full`}
              placeholder="Enter shift time (HH:mm)"
              {...register("shiftTime", {
                required: "Shift time is required",
                pattern: {
                  value: shiftTimePattern,
                  message: "Invalid time format (HH:mm)",
                },
              })}
            />
            {errors.shiftTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shiftTime.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white ${
              darkMode ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {editingShift !== null ? "Update Shift" : "Submit"}
          </button>
        </form>

        {/* Display Shift Timings */}
        <div className="mt-8 flex flex-col justify-center items-center">
          <h2
            className={`text-lg   border-b-2 font-semibold  ${
              darkMode ? "text-white" : "text-blue-900"
            }`}
          >
            Shift Timings
          </h2>

          {shiftTimings?.length === 0 ? (
            <p className={`${darkMode ? "text-white" : "text-gray-600"} mt-2`}>
              No shift timings available.
            </p>
          ) : (
            <ul className="mt-4">
              {shiftTimings.map((shift, index) => (
                <li
                  key={index}
                  className={`flex justify-between gap-x-3 items-center py-2 ${
                    darkMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  <div>
                    <span>
                      {String(shift.shiftDurationHours).padStart(2, "0")}:
                      {String(shift.shiftDurationMinutes).padStart(2, "0")}{" "}
                      hours
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEdit(index)}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(shift?.shiftDurationId)}
                    >
                      <RiDeleteBin6Line />{" "}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendenceShift;
