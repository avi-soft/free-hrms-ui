import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addDepartment,
  updateDepartment,
} from "../../../../../services/operations/departmentAPI";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { EmployeeSearch } from "../../../../../services/operations/employeeAPI";
import {
  setLoading,
  setOrganization,
} from "../../../../../slices/OrganisationSlice";
import { getOrganisation } from "../../../../../services/operations/OrganisationAPI";

const CreateUpdateDepartment = () => {
  const { AccessToken } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [showCheckbox, setShowCheckbox] = useState(false);
  const { loading } = useSelector((state) => state.Organisation);
  const { AllOrganizations } = useSelector((state) => state.Organisation);
  const [noSearch, setNoSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useSelector((state) => state.theme);
  const debounceTimeoutRef = useRef(null);

  const { isEditing, department } = location.state || {
    isEditing: false,
    department: null,
  };

  const validateDepartment = {
    required: "Department Name is required",
    minLength: {
      value: 3,
      message: "Department Name must be at least 3 characters",
    },
    validate: {
      noNumbers: (value) =>
        !/\d/.test(value) || "Department Name must not contain numbers",
      minLength: (value) =>
        value.trim().length >= 3 ||
        "Department Name must not be empty or less than 3 characters",
      noSpecialChars: (value) =>
        /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value) ||
        "Department Name must contain only letters and a single space between words",
    },
  };
  
  // Replace the existing register validation rules for the department field with this updated version
  
  


  console.log(AllOrganizations)
  useEffect(() => {
    const fetchOrganizationList = async () => {
      try {
        dispatch(setLoading(true));
        const res = await dispatch(getOrganisation(AccessToken));
        dispatch(setOrganization(res?.data))
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching organizations", error);
        dispatch(setLoading(false));
      }
    };

    fetchOrganizationList();
  }, [dispatch, AccessToken]);

  useEffect(() => {
    if (isEditing && department) {
      setValue("department", department.department);
      setValue("description", department.description);
      setSelectedOrganization(department.organizationId);
      if (department?.managerId) {
        setSelectedManager({
          userId: department.managerId,
          firstName: department.managerFirstName,
          lastName: department.managerLastName,
        });
        setShowCheckbox(true);
        setSearchResults([
          {
            userId: department.managerId,
            firstName: department.managerFirstName,
            lastName: department.managerLastName,
          },
        ]);
      } else {
        setSelectedManager(null);
        setShowCheckbox(false);
        setSearchResults([]);
      }
    } else {
      setSelectedManager(null);
      setShowCheckbox(false);
      setSearchResults([]);
    }
  }, [isEditing, department, setValue]);

  useEffect(() => {
    setValue("organization", selectedOrganization);
  }, [selectedOrganization, setValue]);

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      managerId: selectedManager?.userId || null,
      organizationId: selectedOrganization,
    };

    formData.navigate = navigate;
    formData.AccessToken = AccessToken;

    if (isEditing) {
      await dispatch(
        updateDepartment(AccessToken, formData, department.departmentId)
      );
    } else {
      await dispatch(addDepartment(formData));
    }
  };

  const handleSearch = async (searchTerm) => {
    try {
      const response = await dispatch(EmployeeSearch(AccessToken, searchTerm));
      const data = response?.data;

      if (Array.isArray(data) && data.length > 0) {
        setSearchResults(data);
        setShowCheckbox(true);
        setNoSearch(false);
      } else {
        setSearchResults([]);
        setShowCheckbox(false);
        setNoSearch(true);
      }
    } catch (error) {
      console.error("Error searching employees:", error);
    }
  };

  const debounceSearch = useCallback((searchTerm) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      handleSearch(searchTerm);
    }, 400);
  }, []);

  const handleInputChange = (e) => {
    setSelectedManager(null);
    debounceSearch(e.target.value);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectManager = (manager) => {
    if (selectedManager?.userId === manager.userId) {
      setSelectedManager(null);
    } else {
      setSelectedManager(manager);
    }
  };

  return (
    <div
      className={`pb-9 h-auto mb-10 mt-5 rounded ${
        darkMode ? "bg-slate-700 text-white" : "bg-slate-100"
      }`}
    >
      <div className="p-5 flex items-center justify-between">
        <div
          className={`text-xl font-semibold ${
            darkMode ? "text-white" : "text-slate-600"
          }`}
        >
          {isEditing ? "Edit Department" : "Create Department"}
        </div>
        <div>
          <p
            className={`text-xl font-semibold ${
              darkMode ? "text-white" : "text-slate-950"
            }`}
          >
            Home / Dashboard /{" "}
            <span className="text-yellow-700">
              {isEditing ? "Edit Department" : "Create Department"}
            </span>
          </p>
        </div>
      </div>
      <div className="container mx-auto mt-8">
        {AllOrganizations.length === 0 ? (
          <div className="p-5 mt-32 flex flex-col items-center justify-center">
            <div
              className={`text-xl font-semibold ${
                darkMode ? " text-orange-400" : "text-slate-600"
              }`}
            >
              No Organizations Available
            </div>
            <p className={`text-center mt-4 ${darkMode ? "text-white" : "text-gray-700"}`}>
              You need to create an organization before adding a department.
            </p>
            <div className="flex justify-center">
            <Link
               to={`/organization/organization-create-update`}
              className={`  text-sm md:text-base underline font-medium  
                rounded-md py-2 px-5 ${
                darkMode
                  ? " text-blue-400"
                  : "text-blue-700"
              }`}
            > 
              Create Organization
            </Link>
            </div>

          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 ${
              darkMode ? "bg-slate-600" : "bg-white"
            }`}
          >
            <div className="mb-4">
              <label
                htmlFor="organization"
                className={`block text-sm font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Select Organization
                <sup className="text-red-900 font-bold">*</sup>
              </label>
              <select
                id="organization"
                {...register("organization", {
                  required: "Organization is required",
                })}
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white text-gray-700"
                }`}
              >
                <option value="">Select Organization</option>
                {AllOrganizations.map((org) => (
                  <option key={org?.organizationId} value={org?.organizationId}>
                    {org?.organizationName}
                  </option>
                ))}
              </select>
              {errors.organization && (
                <p className="text-red-500 mt-1">
                  {errors.organization.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="department"
                className={`block text-sm font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Department Name<sup className="text-red-900 font-bold">*</sup>
              </label>
              <input
                id="department"
                type="text"
                placeholder="Department Name..."
                {...register("department", validateDepartment)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white text-gray-700"
                }`}
              />
              {errors.department && (
                <p className="text-red-500 mt-1">{errors.department.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className={`block text-sm font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Department Description
                <sup className="text-red-900 font-bold">*</sup>
              </label>
              <input
                id="description"
                type="text"
                placeholder="Department Description..."
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 5,
                    message: "Description must be at least 5 characters",
                  },
                })}
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white text-gray-700"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="employeeSearch"
                className={`block text-sm font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Add Manager<sup className="text-red-900 font-bold">*</sup>
              </label>
              <input
                data-testid="employeeSearch"
                required
                type="text"
                id="employeeSearch"
                placeholder="Search employee for adding as manager.."
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white text-gray-700"
                }`}
                defaultValue={
                  isEditing && department?.managerFirstName
                    ? `${department.managerFirstName} ${department.managerLastName}`
                    : ""
                }
              />
            </div>
            {showCheckbox && searchResults?.length > 0 ? (
              <div className="mb-4">
                {searchResults.slice(0, 1).map((result) => (
                  <div key={result.userId} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`employee_${result.userId}`}
                      name="selectedEmployee"
                      required
                      value={result?.userId}
                      checked={selectedManager?.userId === result.userId}
                      onChange={() => handleSelectManager(result)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`employee_${result.userId}`}
                      className={`text-sm font-semibold ${
                        darkMode ? "text-white" : "text-gray-700"
                      }`}
                      data-testid={`search-result-item-label-${result.userId}`}
                    >
                      {result.firstName} {result.lastName}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              noSearch && (
                <div className="mb-4">
                  <p className="text-red-500 text-sm font-semibold">
                    No employees found with the given search term.
                  </p>
                </div>
              )
            )}
            {selectedManager && (
              <div className="mb-4">
                <div className="flex items-center">
                  <p className="text-sm font-semibold mr-2">
                    Selected Manager: {selectedManager.firstName}{" "}
                    {selectedManager.lastName}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedManager(null)}
                    className="text-red-500 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
            <button
              type="submit"
              className={`text-center w-full text-sm md:text-base font-medium rounded-md py-2 px-5 ${
                loading ? "bg-slate-900" : "bg-blue-700"
              } ${darkMode ? "text-white" : "text-white"} hover:scale-95 transition-all duration-200`}
            >
              {isEditing ? "Update Department" : "Create Department"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateUpdateDepartment;
