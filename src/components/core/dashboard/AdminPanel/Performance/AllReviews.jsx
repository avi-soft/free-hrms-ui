import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allReviews } from "../../../../../services/operations/performanceAPI";
import toast from "react-hot-toast";
import Spinner from "../../../../common/Spinner";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    const getAllReviews = async () => {
      const response = await dispatch(allReviews(AccessToken));
      console.log(response);
      if (response?.status === 200 && response?.data?.success) {
        setReviews(response.data.performanceList || []);
        setLoading(false);
      } else {
        toast.error("Error Loading Reviews");
      }
    };
    getAllReviews();
  }, [dispatch, AccessToken]);

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
    <div className={` mb-5 mt-5 ${darkMode ? " text-white" : "bg-slate-100"}`}>
      {loading ? (
        <div className="absolute grid place-content-center h-[70%] w-[85%]">
          <Spinner />
        </div>
      ) : (
        <div
          className={`pb-9  shadow-md rounded-md mb-5 ${
            darkMode ? "bg-gray-800" : "bg-slate-100"
          }`}
        >
          <div className="p-5 flex items-center justify-between">
            <div
              className={`text-xl ${
                darkMode ? "text-white" : "text-slate-600"
              } font-semibold`}
            >
              All Performance Reviews
            </div>
            <div>
              <p
                className={`text-xl left-6 font-semibold ${
                  darkMode ? "text-white" : "text-slate-950"
                }`}
              >
                Home / Dashboard /
                <span className="text-yellow-700">
                  {" "}
                  All Performance Reviews
                </span>
              </p>
            </div>
          </div>
          <div className="p-10">
            {reviews.length === 0 ? (
              <p
                className={`text-center text-gray-500 ${
                  darkMode ? "text-gray-400" : ""
                }`}
              >
                No reviews available.
              </p>
            ) : (
              <table className="table-auto w-full">
                <thead>
                  <tr
                    className={`bg-gray-200 ${darkMode ? "bg-gray-700" : ""}`}
                  >
                    <th
                      className={`py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 text-black font-semibold uppercase tracking-wider text-center ${
                        darkMode ? "text-gray-400" : ""
                      }`}
                    >
                      Reviewed By
                    </th>
                    <th
                      className={`py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 text-black font-semibold uppercase tracking-wider text-center ${
                        darkMode ? "text-gray-400" : ""
                      }`}
                    >
                      Employee Name
                    </th>
                    <th
                      className={`py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 text-black font-semibold uppercase tracking-wider text-center ${
                        darkMode ? "text-gray-400" : ""
                      }`}
                    >
                      Rating
                    </th>
                    <th
                      className={`py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 text-black font-semibold uppercase tracking-wider text-center ${
                        darkMode ? "text-gray-400" : ""
                      }`}
                    >
                      Comment
                    </th>
                    <th
                      className={`py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 text-black font-semibold uppercase tracking-wider text-center ${
                        darkMode ? "text-gray-400" : ""
                      }`}
                    >
                      Review Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => (
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
                      }
                    >
                      <td
                        className={`py-3 px-4 border-b border-slate-200 text-center ${
                          darkMode ? "text-black text-lg font-semibold " : ""
                        }`}
                      >
                        {`${review.reviewerFirstName} ${review.reviewerLastName}`}
                      </td>
                      <td
                        className={`py-3 px-4 border-b border-slate-200 text-center ${
                          darkMode ? "text-black text-lg font-semibold " : ""
                        }`}
                      >
                        {`${review.firstName} ${review.lastName}`}
                      </td>
                      <td
                        className={`px-3 py-4 border-b border-slate-200 text-center ${getRatingColor(
                          review.rating
                        )} ${darkMode ? "" : ""}`}
                      >
                        {review.rating}
                      </td>
                      <td className="py-3 px-4 text-black border-b border-slate-200 text-center">
                        {review.comment}
                      </td>
                      <td
                        className={`py-3 px-4 border-b border-slate-200 text-center ${
                          darkMode ? "text-black text-lg " : ""
                        }`}
                      >
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

export default AllReviews;
