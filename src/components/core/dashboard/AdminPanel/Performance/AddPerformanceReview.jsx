import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addPerformanceReview,
  ViewManagerEmployees,
} from "../../../../../services/operations/performanceAPI";
import Spinner from "../../../../common/Spinner";
import toast from "react-hot-toast";

const AddPerformanceReview = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { AccessToken } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const managerId = user?.userId;

  console.log(employees)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await dispatch(
          ViewManagerEmployees(managerId, AccessToken)
        );
        setEmployees(response?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [managerId, AccessToken, dispatch]);

  const handleCheckboxChange = (employeeId) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter((id) => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };

  const handleReviewSubmit = () => {
    if (selectedEmployees.length === 1) {
      setCurrentEmployee(
        employees.find((e) => e.userId === selectedEmployees[0])
      );
      setShowForm(true);
    } else {
      toast.error("Please select exactly one employee to review.");
    }
  };

  const onSubmit = async (data) => {
    const employeeId = currentEmployee?.employeeId;
    const res = await dispatch(
      addPerformanceReview(managerId, employeeId, data, AccessToken, navigate)
    );
    setShowForm(false);
    setSelectedEmployees([]);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees
    ?.filter((employee) => {
      if (searchTerm === "") {
        return true;
      } else {
        return (
          employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    })
    .slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={`h-max mb-4 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
      {loading ? (
        <div className="absolute grid place-content-center h-[70%] w-[85%]">
          <Spinner />
        </div>
      ) : (
        <div className={`pb-9 mb-5 mt-10 shadow-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-md mb-5`}>
          <div className="p-5 flex items-center justify-between">
            <div className={`text-xl ${darkMode ? 'text-white' : 'text-slate-600'} font-semibold`}>
              Add Performance Review
            </div>
            <div>
              <p className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                Home / Dashboard /
                <span className="text-yellow-700">Add Performance Review</span>
              </p>
            </div>
          </div>
          <h1 className={`text-center font-semibold ${darkMode ? 'text-white' : 'text-blue-900'} mt-10 text-2xl`}>
            Add Performance Review
          </h1>
          <div className="p-10">
            {employees?.length === 0 ? (
              <div className={`text-center mt-24 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No employees available for Adding Review...
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`border ${darkMode ? 'border-gray-500 bg-gray-700 text-white' : 'border-gray-300'} rounded p-2 mb-4`}
                />
                <table className={`min-w-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded-lg overflow-hidden shadow-lg`}>
                  <thead className={`${darkMode ? 'bg-gray-600' : 'bg-slate-200'}`}>
                    <tr>
                      <th className="py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 text-black font-semibold uppercase tracking-wider text-center">
                        Select
                      </th>
                      <th className="py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 text-black font-semibold uppercase tracking-wider text-center">
                        Profile
                      </th>
                      <th className="py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 text-black font-semibold uppercase tracking-wider text-center">
                        Name
                      </th>
                      <th className="py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 text-black font-semibold uppercase tracking-wider text-center">
                        Position
                      </th>
                      <th className="py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 text-black font-semibold uppercase tracking-wider text-center">
                        Contact
                      </th>
                      <th className="py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 text-black font-semibold uppercase tracking-wider text-center">
                        Gender
                      </th>
                      <th className="py-3 px-4 border-b-2 border-slate-300 text-sm leading-4 text-black font-semibold uppercase tracking-wider text-center">
                        Join Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployees.map((employee) => (
                      <tr
                        key={employee.userId}
                        className={darkMode ? 'odd:bg-gray-700 even:bg-gray-600' : 'odd:bg-white even:bg-slate-100'}
                      >
                        <td className="py-3 px-4 border-b border-slate-200 text-center">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(
                              employee.userId
                            )}
                            onChange={() =>
                              handleCheckboxChange(employee.userId)
                            }
                            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                          />
                        </td>
                        <td className="py-3 px-4 border-b border-slate-200 text-center">
                          <img
                            src={employee.profileImage}
                            alt="Profile"
                            className="h-10 w-10 rounded-full mx-auto"
                          />
                        </td>
                        <td className="py-3 px-4 border-b border-slate-200 text-center">
                          {employee.firstName} {employee.lastName}
                        </td>
                        <td className="py-3 px-4 border-b border-slate-200 text-center">
                          {employee.position}
                        </td>
                        <td className="py-3 px-4 border-b border-slate-200 text-center">
                          {employee.contact}
                        </td>
                        <td className="py-3 px-4 border-b border-slate-200 text-center">
                          {employee.gender}
                        </td>
                        <td className="py-3 px-4 border-b border-slate-200 text-center">
                          {new Date(employee.joinDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={handleReviewSubmit}
                  className="text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 px-4 py-2 mt-4 bg-yellow-500 text-black"
                >
                  Proceed with Review
                </button>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mr-2"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastEmployee >= employees.length}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
          {showForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className={`rounded-lg p-6 w-96 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                <h3 className="text-xl font-semibold mb-4">
                  Add Performance Review
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-semibold mb-1"
                      htmlFor="rating"
                    >
                      Rating
                    </label>
                    <select
                      id="rating"
                      {...register("rating", { required: true })}
                      className={`block w-full p-2 border ${darkMode ? 'border-gray-500 bg-gray-700 text-white' : 'border-gray-300'} rounded`}
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
                      className="block text-sm font-semibold mb-1"
                      htmlFor="comment"
                    >
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      {...register("comment", { required: true })}
                      className={`block w-full p-2 border ${darkMode ? 'border-gray-500 bg-gray-700 text-white' : 'border-gray-300'} rounded`}
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
                      onClick={() => setShowForm(false)}
                      className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddPerformanceReview;
