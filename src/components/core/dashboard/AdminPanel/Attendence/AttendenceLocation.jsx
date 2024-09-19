import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchElevation } from "../../../../../utils/utility.functions";
import {
  AddAttendenceLocation,
  DeleteAttendenceLocation,
  GetAttendenceLocation,
  UpdateAttendenceLocation,
} from "../../../../../services/operations/AttendenceAPI";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrFormPrevious, GrNext, GrPrevious } from "react-icons/gr";

const AttendenceLocation = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const { AccessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [locationsData, setLocationData] = useState([]);
  const [editingLocation, setEditingLocation] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 2;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();


  console.log('total pages',totalPages);
  
  // Fetch attendance locations with pagination
  async function fetchAttendenceLocations(page = 0) {
    try {
      setLoading(true);
      const response = await dispatch(
        GetAttendenceLocation(AccessToken, page, itemsPerPage)
      );
      if (response?.status === 200) {
        setLocationData(response?.data?.AttendanceLocations?.content || []);
        setTotalPages(response?.data?.AttendanceLocations?.totalPages || 0);
      }
    } catch (error) {
      console.error("Error fetching attendance locations:", error);
      toast.error("Failed to fetch locations.");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    setLoading(true);
    const { attendanceLocation } = data;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const elevation = await fetchElevation(latitude, longitude);

          if (elevation === null) {
            setLoading(false);
            toast.error("Failed to retrieve elevation.");
            return;
          }

          const locationData = {
            attendanceLocation,
            latitude: Number(latitude),
            longitude: Number(longitude),
            elevation,
          };

          try {
            if (editingLocation !== null) {
              const locationId =
                locationsData[editingLocation]?.attendanceLocationId;
              const response = await dispatch(
                UpdateAttendenceLocation(locationId, locationData, AccessToken)
              );
              if (response?.status === 200) {
                toast.success("Location updated successfully");
                fetchAttendenceLocations(currentPage);
              }
            } else {
              // Adding a new location
              const response = await dispatch(
                AddAttendenceLocation(locationData, AccessToken)
              );
              if (response?.status === 201) {
                toast.success(response?.data?.message);
                fetchAttendenceLocations(currentPage);
              }
            }
            reset();
          } catch (error) {
            console.error("Error submitting location:", error);
            toast.error("Failed to submit location.");
          }

          setLoading(false); // Stop loader
        },
        (error) => {
          setLoading(false); // Stop loader
          console.error("Geolocation error:", error);
          toast.error("Failed to get your location.");
        }
      );
    } else {
      setLoading(false);
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleEdit = (location, index) => {
    setValue("attendanceLocation", location.attendanceLocation);
    setEditingLocation(index);
  };

  const handleDelete = async (locationId) => {
    try {
      const response = await dispatch(
        DeleteAttendenceLocation(locationId, AccessToken)
      );
      if (response?.status === 200) {
        toast.success(response?.data?.message);
        setCurrentPage(0)
        fetchAttendenceLocations(currentPage);
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete Attendence location");
    }
  };

  const validateLocation = (value) => {
    const trimmedValue = value.trim();
    

    if (trimmedValue === "") {
      return "Location name cannot be just spaces";
    }

      const letterOnlyPattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
      if (!letterOnlyPattern.test(trimmedValue)) {
        return "Location name can only contain letters";
      }
      
      return true;
    };

  useEffect(() => {
    fetchAttendenceLocations(currentPage);
  }, [dispatch, AccessToken, currentPage]);

  return (
    <div>
      <div
        className={`ml-20 pb-9 w-[500px] h-[400px] mb-5 mt-10 shadow-lg ${
          darkMode ? "bg-slate-700" : "bg-slate-50"
        } rounded-md`}
      >
        <h1
          className={`text-center font-semibold ${
            darkMode ? "text-white" : "text-blue-900"
          } mt-10 pt-5 text-2xl`}
        >
          Add Attendance Location
          
        </h1>

        {/* Location Form */}
        <form
          className="flex flex-col items-center mt-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Input for attendance location */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Location Name
            </label>
            <input
        type="text"
        className={`p-2 border ${
          errors.attendanceLocation
            ? "border-red-500"
            : darkMode
            ? "border-gray-600"
            : "border-gray-300"
        } rounded-md w-full`}
        placeholder="Enter location name"
        {...register("attendanceLocation", {
          validate: validateLocation
        })}
      />
            {errors.attendanceLocation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.attendanceLocation.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white ${
              darkMode ? "bg-green-600" : "bg-blue-600"
            }`}
            disabled={loading} // Disable button while loading
          >
            {loading
              ? "Submitting..."
              : editingLocation !== null
              ? "Update Location"
              : "Submit"}
          </button>
        </form>

        {/* Display Locations */}
        <div className="mt-2 flex flex-col justify-center items-center">
          <h2
            className={`text-md border-b-2 font-semibold ${
              darkMode ? "text-white" : "text-blue-900"
            }`}
          >
            Attendance Locations
          </h2>

          {loading ? (
            <div className="mt-4">Loading...</div>
          ) : locationsData?.length === 0 ? (
            <p className={`${darkMode ? "text-white" : "text-gray-600"} mt-1`}>
              No locations available.
            </p>
          ) : (
            <div>
              <ul className="mt-4">
                {locationsData?.map((location, index) => (
                  <li
                    key={index}
                    className={`flex justify-between gap-x-3 items-center py-2 ${
                      darkMode ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {location?.attendanceLocation}

                    <div className="flex space-x-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleEdit(location, index)}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() =>
                          handleDelete(location?.attendanceLocationId)
                        }
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

            </div>
          )}
        </div>
        <div className="flex justify-between p-3">
                <button
                  onClick={() =>
                    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))
                  }
                  disabled={currentPage === 0}
                  className={`text-white p-2 rounded disabled:opacity-50`}
                >
                  <GrPrevious />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prevPage) =>
                      Math.min(prevPage + 1, totalPages - 1)
                    )
                  }
                  disabled={currentPage >= totalPages - 1}
                  className={`text-white p-2 rounded disabled:opacity-50 `}
                >
                  <GrNext />
                </button>
              </div>
      </div>
      
    </div>
  );
};

export default AttendenceLocation;
