import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmployeePerformanceReviews } from "../../../../../services/operations/performanceAPI";
import toast from "react-hot-toast";
import Spinner from "../../../../common/Spinner";

const ViewPerformance = () => {
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.profile);
  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const employeeId = user?.employeeId;

  useEffect(() => {
    const employeeReviews = async () => {
      const response = await dispatch(
        EmployeePerformanceReviews(employeeId, AccessToken)
      );
      console.log(response);
      if (response?.status === 200) {
        setReviews(response?.data || []);
        setLoading(false);
      } else {
        toast.error("Error Loading Reviews");
      }
    };
    employeeReviews();
  }, [employeeId, dispatch, AccessToken]);

  const getRatingColor = (rating) => {
    switch (rating) {
      case "EXCELLENT":
        return "text-green-500";
      case "GOOD":
        return "text-blue-500";
      case "FAIR":
        return "text-yellow-500";
      case "POOR":
        return "text-orange-500";
      case "VERY_POOR":
        return "text-red-500";
      default:
        return "";
    }
  };

  const parseDateString = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");
    return new Date(year, month - 1, day, hours, minutes);
  };

  const formatDate = (dateString) => {
    const date = parseDateString(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  return (
    <div className={`h-max ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {loading ? (
        <div className="absolute grid place-content-center h-[70%] w-[85%]">
          <Spinner />
        </div>
      ) : (
        <div className={`pb-9 shadow-md rounded-md mb-5 mt-10 ${darkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
          <div className="p-5 flex items-center justify-between">
            <div className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
              View Performance Review
            </div>
            <div>
              <p className={`text-xl left-6 font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-950'}`}>
                Home / Dashboard /
                <span className="text-yellow-700">
                  &nbsp; View Performance Review
                </span>
              </p>
            </div>
          </div>
          <div className="p-10">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500">No reviews available.</p>
            ) : (
              <table className="table-auto w-full">
                <thead>
                  <tr className={`${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <th className={`py-3 px-4 border-b-2 text-sm leading-4 font-semibold uppercase tracking-wider text-center ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-300 text-black'}`}>
                      Reviewed By
                    </th>
                    <th className={`py-3 px-4 border-b-2 text-sm leading-4 font-semibold uppercase tracking-wider text-center ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-300 text-black'}`}>
                      Rating
                    </th>
                    <th className={`py-3 px-4 border-b-2 text-sm leading-4 font-semibold uppercase tracking-wider text-center ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-300 text-black'}`}>
                      Comment
                    </th>
                    <th className={`py-3 px-4 border-b-2 text-sm leading-4 font-semibold uppercase tracking-wider text-center ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-300 text-black'}`}>
                      Review Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review,index) => (
                    <tr
                      key={review.performanceId}
                      className={
                        index % 2 === 0
                          ? `${
                              darkMode
                                ? "bg-gray-400 text-white"
                                : "bg-white text-black"
                            }`
                          : `${
                              darkMode
                                ? "bg-gray-600 text-white"
                                : "bg-gray-100 text-black"
                            }`
                      }                    >
                      <td className={`py-3 px-4 border-b text-center ${darkMode ? 'border-gray-600 text-black font-semibold' : 'border-slate-200'}`}>{`${review.reviewerFirstName} ${review.reviewerLastName}`}</td>
                      <td
                        className={`px-3 py-4 border-b text-center ${getRatingColor(review.rating)} ${darkMode ? 'border-gray-600 ' : 'border-slate-200'}`}
                      >
                        {review.rating}
                      </td>
                      <td className={`py-3 px-4 border-b text-center ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'}`}>
                        {review.comment}
                      </td>
                      <td className={`py-3 px-4 border-b text-center ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'}`}>
                        {formatDate(review.reviewDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPerformance;
