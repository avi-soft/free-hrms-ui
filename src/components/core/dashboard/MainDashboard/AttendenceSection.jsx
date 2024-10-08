import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiBorderRadius } from "react-icons/bi";
import { IoLocationOutline } from "react-icons/io5";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { fetchElevation } from "../../../../utils/utility.functions";
import toast from "react-hot-toast";
import { AttendenceClockIn, AttendenceClockOut, EmployeeAttendenceStatus } from "../../../../services/operations/AttendenceAPI";

const AttendenceSection = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const [locationLoader, setLocationLoader] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const [locationsData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    elevation: null,
  });
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [clockedTime, setClockedTime] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const dispatch = useDispatch();
  const { AccessToken } = useSelector((state) => state.auth);

  useEffect(() => {
      fetchEmployeeAttendenceStatus();  // Only fetch attendance status if not checked in

  
  }, [AccessToken, user?.userId, currentTime, isCheckedIn]);

  useEffect(() => {
    if(isCheckedIn) {
    fetchEmployeeAttendenceStatus(); 
    } // Only fetch attendance status if not checked in
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
  
    return () => clearInterval(interval); // Cleanup the interval on component unmount // Cleanup the interval on component unmount

}, [AccessToken, user?.userId, currentTime, isCheckedIn]);

  

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const elevation = await fetchElevation(latitude, longitude);
        if (elevation != null) {
          setLocationData({ latitude, longitude, elevation, userId: user?.userId });
          toast.success("Location fetched successfully");
        } else {
          toast.error("Error retrieving location");
        }
      });
    }
  };

  const handleCheckIn = async () => {
    if (!locationsData.latitude || !locationsData.longitude || !locationsData.elevation) {
      toast.error("Please fetch your location before checking in.");
    } else {
      const checkInResponse = await dispatch(AttendenceClockIn(locationsData, AccessToken));
      if (checkInResponse.status === 200) {
        fetchEmployeeAttendenceStatus();
        toast.success("Clock In Successful");
      }
    }
  };

  const handleCheckOut = async () => {
    const checkOutResponse = await dispatch(AttendenceClockOut(locationsData, AccessToken));
    if (checkOutResponse.status === 200) {
      toast.success("Clock Out Successful");
      setIsCheckedIn(false);
      setClockedTime(""); // Reset clocked time on check-out
    }
  };

  async function fetchEmployeeAttendenceStatus() {
    const response = await dispatch(EmployeeAttendenceStatus(AccessToken, user?.userId));
    if (response?.status === 200) {
      setIsCheckedIn(response?.data?.isUserClockedIn);
      setClockedTime(response?.data?.clockedTime || "0 minutes and 0 seconds"); // Set clocked time
    }
  }

  return (
    <div className="flex justify-center items-center h-auto mb-10 mt-5">
      <div className={`pb-9 pt-5 px-6 w-[400px] max-w-lg rounded ${darkMode ? "bg-slate-700 text-white" : "bg-slate-100 text-black"}`}>
        <div className={`p-x-2 border-b-[2px] flex justify-start items-center`}>
          <BiBorderRadius />
          <p className="ml-4">Attendance</p>
        </div>

        <div className="flex items-center justify-between mt-2 mb-4">
          <button
            className={`px-4 py-2 rounded-full font-semibold ${darkMode ? "bg-green-600" : "bg-green-400 text-white"} flex justify-between items-center gap-2`}
            onClick={handleLocationClick}
            disabled={locationLoader}
          >
            <IoLocationOutline />
            <span>{locationLoader ? "Please wait.." : "Location"}</span>
          </button>
          <div className="text-gray-500 text-sm">{clockedTime}</div> {/* Display clocked time */}
        </div>

        <div className="text-center border border-gray-300 rounded-lg p-4 mb-4 mt-3">
          <input
            type="text"
            placeholder="Add Notes"
            className={`w-full p-2 rounded-md mb-3 ${darkMode ? "bg-slate-600 text-white" : "bg-white text-black"}`}
          />
          <button
            className={`w-full flex flex-row items-center justify-center gap-x-5 py-2 px-4 text-white rounded-md font-medium ${isCheckedIn ? "bg-red-500" : darkMode ? "bg-green-500" : "bg-green-400"}`}
            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
          >
            <div className="flex items-center gap-1">
              <p className="ml-3 font-semibold">{isCheckedIn ? "Check-out" : "Check-in"}</p>
              <div>{isCheckedIn ? <FaSignOutAlt /> : <FaSignInAlt />}</div>
            </div>
            <div className="text-gray-500 text-sm">{currentTime}</div> {/* Display current time */}
          </button>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold">{clockedTime}</p> {/* Display clocked time */}
          <p className="text-sm text-gray-500">{currentTime}</p> {/* Display current time */}
          <p className="text-sm text-red-500">{isCheckedIn ? "Checked in" : "Yet to Check-in"}</p>
        </div>

        <div className="flex justify-center items-center mt-6">
          <p className="text-gray-500 text-sm">{user?.roles[0]?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default AttendenceSection;
