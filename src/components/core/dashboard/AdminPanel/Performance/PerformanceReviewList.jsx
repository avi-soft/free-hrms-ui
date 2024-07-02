import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import {
  DeleteManagerAddedReview,
  EditManagerAddedReview,
  ManagerAddedReviews,
} from "../../../../../services/operations/performanceAPI";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import Spinner from "../../../../common/Spinner";

const PerformanceReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const { darkMode } = useSelector((state) => state.theme);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const { AccessToken } = useSelector((state) => state.auth);
  const ReviewerId = user?.employeeId;
  const [confirmationModal, setConfirmationModal] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchEmployeeReviews = async () => {
      const response = await dispatch(
        ManagerAddedReviews(ReviewerId, AccessToken)
      );
      console.log(response);
      if (response?.status == 200) {
        setReviews(response.data.performanceList);
        setLoading(false);
      }
    };
    fetchEmployeeReviews();
  }, [ReviewerId, dispatch, AccessToken]);

  function refreshPage() {
    window.location.reload(false);
  }

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

  const handleEditClick = (review) => {
    setSelectedReview(review);
    reset(review);
    setShowEditForm(true);
  };

  const onSubmit = async (data) => {
    try {
      console.log("Review changes submitted:", data);
      const { performanceId } = data;
      const response = await dispatch(
        EditManagerAddedReview(performanceId, AccessToken, data)
      );
      console.log(response);
      if (response?.status !== 204) throw new Error(response?.data?.message);
      else {
        refreshPage();
        toast.success("Review updated successfully");
      }
      setShowEditForm(false);
    } catch (error) {
      console.log(error);
      toast.error("Error updating review");
    }
  };

  return (
    <div className={` h-max ${darkMode ? ' text-white' : 'bg-slate-100 text-black'}`}>
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-56">
          <Spinner />
        </div>
      ) : (
        <div className={`pb-9 rounded-md mb-5  mt-10 ${darkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
          <div className="p-5 flex items-center justify-between">
            <div className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-600'}`}>
              Performance Review List
            </div>
            <div>
              <p className={`text-xl left-6 font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                Home / Dashboard /
                <span className="text-yellow-700">
                  &nbsp; Performance Review List
                </span>
              </p>
            </div>
          </div>
          <h1 className={`text-center font-semibold mt-10 text-2xl ${darkMode ? 'text-yellow-500' : 'text-blue-900'}`}>
            Performance Review List
          </h1>
          <div className="p-10">
            {reviews.length > 0 ? (
              <table className="table-auto w-full">
                <thead>
                  <tr className={darkMode ? 'bg-gray-600' : 'bg-gray-200'}>
                    <th className={`py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider text-center`}>
                      Employee Name
                    </th>
                    <th className={`py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider text-center`}>
                      Employee Code
                    </th>
                    <th className={`py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider text-center`}>
                      Rating
                    </th>
                    <th className={`py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider text-center`}>
                      Comment
                    </th>
                    <th className={`py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider text-center`}>
                      Action
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
                      }
                    >
                      <td className={`py-3 px-4 border-b ${darkMode ? 'border-gray-600 text-black font-semibold' : 'border-slate-200'} text-center`}>{`${review.firstName} ${review.lastName}`}</td>
                      <td className={`py-3 px-4 border-b ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'} text-center`}>
                        {review.employeeCode}
                      </td>
                      <td
                        className={`px-3 py-4 border-b ${darkMode ? 'border-gray-600' : 'border-slate-200'} text-center ${getRatingColor(review.rating)}`}
                      >
                        {review.rating}
                      </td>
                      <td className={`py-3 px-4 border-b ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'} text-center`}>
                        {review.comment}
                      </td>
                      <td className={`py-3 px-4 border-b ${darkMode ? 'border-gray-600' : 'border-slate-200'} text-center`}>
                        <button
                          onClick={() => handleEditClick(review)}
                          className="mr-2 focus:outline-none"
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className={`${darkMode ? 'text-blue-500 hover:text-blue-400' : 'text-blue-500 hover:text-blue-700'}`}
                          />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmationModal({
                              text1: "Are you sure?",
                              text2:
                                "You want to delete this selected performance review.",
                              btn1Text: "Delete Review",
                              btn2Text: "Cancel",
                              btn1Handler: async () => {
                                await dispatch(
                                  DeleteManagerAddedReview(
                                    review?.performanceId,
                                    AccessToken
                                  )
                                );
                                refreshPage();
                              },
                              btn2Handler: () => setConfirmationModal(null),
                            })
                          }
                          className="focus:outline-none"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className={`${darkMode ? 'text-red-500 hover:text-red-400' : 'text-red-500 hover:text-red-700'}`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={`text-center mt-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                No Added performance reviews found....
              </p>
            )}
          </div>
          {showEditForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className={`rounded-lg p-6 w-96 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
                <h3 className="text-xl font-semibold mb-4">
                  Edit Performance Review
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input type="hidden" {...register("performanceId")} />
                  <div className="mb-4">
                    <label
                      className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                      htmlFor="rating"
                    >
                      Rating
                    </label>
                    <select
                      id="rating"
                      {...register("rating", { required: true })}
                      className={`block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'} rounded`}
                    >
                      <option value="">Select Rating</option>
                      <option value="VERY_POOR">Very Poor</option>
                      <option value="POOR">Poor</option>
                      <option value="FAIR">Fair</option>
                      <option value="GOOD">Good</option>
                      <option value="EXCELLENT">Excellent</option>
                    </select>
                    {errors.rating && (
                      <span className="text-red-600">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                      htmlFor="comment"
                    >
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      {...register("comment", { required: true })}
                      className={`block w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'} rounded`}
                      placeholder="Enter your comment"
                    ></textarea>
                    {errors.comment && (
                      <span className="text-red-600">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className={`mr-2 px-4 py-2 rounded ${darkMode ? 'bg-gray-500 text-gray-300 hover:bg-gray-400' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} transition duration-200`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'} transition duration-200`}
                    >
                      Edit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {confirmationModal && (
            <ConfirmationModal modalData={confirmationModal} />
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceReviewList;
