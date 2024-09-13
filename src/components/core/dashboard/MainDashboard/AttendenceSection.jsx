import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiBorderRadius } from "react-icons/bi";
import { LuClock3 } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { FaCheckCircle, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { fetchElevation } from "../../../../utils/utility.functions";

const AttendenceSection = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    altitude: null,
  });
  const [locationLoader, setLocationLoader] = useState(false);
  const dispatch = useDispatch();
  const { AccessToken } = useSelector((state) => state.auth);
  const [locationsData, setLocationData] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };

  const handleLocationClick = () => {
    setLocationLoader(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Set the location state with latitude and longitude
          setLocation({
            latitude,
            longitude,
            elevation: null, // Fetch elevation next
          });

          // Fetch the elevation data using Open-Elevation API
           const fetchedElevation=fetchElevation(latitude, longitude);

           if (fetchedElevation=== null) {
            setLoading(false);
            toast.error("Failed to retrieve Location Data.");
            return;
          }

          const locationData = {
            latitude: Number(latitude),
            longitude: Number(longitude),
            elevation: fetchedElevation,
          };
        },
        (error) => {
          console.error("Error fetching location: ", error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Function to fetch elevation data from Open-Elevation API


  const sendLocationToBackend = async (locationData) => {
    console.log(locationData);
    setLocationLoader(false);

    try {
      const response = await dispatch(
        AddEmployeeLocation(locationData, AccessToken)
      );

      console.log(response);

      //   if (response.ok) {
      //     console.log("Location sent successfully!");
      //   } else {
      //     console.error("Failed to send location.");
      //   }
    } catch (error) {
      console.error("Error sending location to backend: ", error);
    }
  };
  return (
    <div className="flex justify-center items-center  h-auto mb-10 mt-5">
      <div
        className={`pb-9 pt-5 px-6 w-[400px]  max-w-lg rounded ${
          darkMode ? "bg-slate-700 text-white" : "bg-slate-100 text-black"
        }`}
      >
        <div
          className={`p-x-2 border-b-[2px]  flex justify-start items-center   `}
        >
          <BiBorderRadius />
          <p className="ml-4">Attendence</p>
        </div>
        {/* Attendance Header */}
        <div className="flex items-center justify-between mt-2 mb-4">
          <button
            className={`px-4 py-2 rounded-full font-semibold ${
              darkMode ? "bg-green-600" : "bg-green-400 text-white"
            } flex justify-between items-center gap-2`}
            onClick={handleLocationClick}
            disabled={locationLoader}
          >
            <IoLocationOutline />
            <span>{locationLoader ? "please wait.." : "Location"}</span>
          </button>

          <div className="text-gray-500 text-sm">00:00 Hrs</div>
        </div>

        {/* Attendance Box */}
        <div className="text-center border border-gray-300 rounded-lg p-4 mb-4 mt-3">
          <input
            type="text"
            placeholder="Add Notes"
            className={`w-full p-2 rounded-md mb-3 ${
              darkMode ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          />
          <button
            className={`w-full flex flex-row items-center  justify-center gap-x-5 py-2 px-4 text-white rounded-md font-medium ${
              darkMode ? " bg-green-500" : "bg-green-400"
            }`}
          >
              <div className="flex  items-center  gap-1">
                <p className="ml-3 font-semibold"> Check-in</p>
                <div>
                  <FaSignInAlt />
                </div>
              </div>
              <div className=" text-gray-500 text-sm">
                {formatTime(currentTime)}
              </div>
          </button>
        </div>
        {/* Location display */}
        {location.latitude && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Latitude: {location.latitude}
            </p>
            <p className="text-sm text-gray-500">
              Longitude: {location.longitude}
            </p>
            <p className="text-sm text-gray-500">
              Elevation: {location.elevation} meters
            </p>
          </div>
        )}

        {/* Time Details */}
        <div className="text-center">
          <p className="text-lg font-bold">00:00 Hrs</p>
          <p className="text-sm text-gray-500">10 Sep 2024</p>
          <p className="text-sm text-red-500">Yet to Check-in</p>
        </div>

        {/* Schedule Bar */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-500 text-sm">10</p>
          <p className="text-gray-500 text-sm">IT Consultant - HD</p>
          <p className="text-gray-500 text-sm">14:30</p>
        </div>
      </div>
    </div>
  );
};

export default AttendenceSection;
