import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addDepartment,
  updateDepartment,
  DepartmentAttributeslist,
} from "../../../../../services/operations/departmentAPI";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { EmployeeSearch } from "../../../../../services/operations/employeeAPI";
import {
  setLoading,
  setOrganization,
} from "../../../../../slices/OrganisationSlice";
import { getOrganisation } from "../../../../../services/operations/OrganisationAPI";
import toast from "react-hot-toast";
import DepartmentAttributes from "./DepartmentAttributes";
import ConfirmationModal from "../../../../common/ConfirmationModal";

const CreateUpdateDepartment = () => {
  const { AccessToken } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [showCheckbox, setShowCheckbox] = useState(false);
  const { loading } = useSelector((state) => state.department);
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

  console.log("editing departent dtat is", department);

  const [isAttribute, setIsAttribute] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [departmentAttribute, setDepartmentAttributes] = useState([]);
  const validateDepartment = {
    required: "Department Name is required",
    minLength: {
      value: 3,
      message: "Department Name must be at least 3 characters",
    },
    validate: {
      minLength: (value) =>
        value.trim().length >= 3 ||
        "Department Name must not be empty or less than 3 characters",
      noNumbers: (value) =>
        !/\d/.test(value) || "Department Name must not contain numbers",

      noSpecialChars: (value) =>
        /^[a-zA-Z0-9 ]*$/.test(value) ||
        "Department Name must not contain special characters",
      noExtraSpaces: (value) => {
        const trimmedValue = value.trim();
        return (
          !/\s{2,}/.test(trimmedValue) ||
          "Department Name must not contain consecutive spaces"
        );
      },
    },
  };

  console.log(isEditing);
  useEffect(() => {
    const fetchOrganizationList = async () => {
      try {
        dispatch(setLoading(true));
        const res = await dispatch(getOrganisation(AccessToken));
        dispatch(setOrganization(res?.data));
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

      // Set manager if exists
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
      }

      // Set the values for department attributes
      if (departmentAttribute && department.attributes) {
        departmentAttribute.forEach((attribute) => {
          const attributeValue = department.attributes[attribute.attributeKey];
          if (attributeValue) {
            setValue(attribute.attributeKey, attributeValue);
          }
        });
      }
    } else {
      reset(); // Clear form fields if not editing
      setSelectedManager(null);
      setSelectedOrganization("");
      setShowCheckbox(false);
      setSearchResults([]);
    }
  }, [isEditing, department, departmentAttribute, setValue, reset]);

  async function getRes() {
    const res = await dispatch(DepartmentAttributeslist(AccessToken));
    setDepartmentAttributes(res?.data);
  }

  useEffect(() => {
    setValue("organization", selectedOrganization);
    getRes();
  }, [selectedOrganization, setValue]);

  const onSubmit = async (data) => {
    if (!selectedManager) {
      toast.error("Please select a valid Manager.");
      return;
    }
    const trimmedDepartmentName = data.department?.trim() || "";
    const trimmedDescription = data.description?.trim() || "";
    const attributesObj =
      departmentAttribute &&
      departmentAttribute.reduce((acc, obj) => {
        acc[obj.attributeKey] = data[obj.attributeKey];
        return acc;
      }, {});
    const formData = {
      department: trimmedDepartmentName,
      description: trimmedDescription,
      managerId: selectedManager?.userId || null,
      organizationId: selectedOrganization,
      AccessToken,
      attributes: attributesObj,
    };

    try {
      if (isEditing) {
        await dispatch(
          updateDepartment(AccessToken, formData, department.departmentId)
        );
        navigate("/department/department-list", {
          state: {
            updatedDepartment: true,
            organizationId: selectedOrganization,
          },
        });
      } else {
        await dispatch(addDepartment(formData));
        navigate("/department/department-list", {
          state: {
            updatedDepartment: false,
            organizationId: selectedOrganization,
          },
        });
      }
    } catch (error) {
      console.error("Error during department submission:", error);
      toast.error("An error occurred. Please try again.");
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
    setConfirmationModal({
      text1: "Do you want to add new attributes?",
      text2: "This action will redirect you to the Attributes creation page.",
      btn1Text: "Yes",
      btn2Text: "Skip",
      btn1Handler: () => {
        setIsAttribute(true);
        // Set showOption to true after the action
        setConfirmationModal(null);
      },
      btn2Handler: () => {
        setIsAttribute(false); // Ensure showOption is true to prevent future prompts
        setConfirmationModal(null);
      },
    });
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
          data-testid="heading-1"
          className={`text-xl font-semibold ${
            darkMode ? "text-white" : "text-slate-600"
          }`}
        >
          {isEditing ? "Edit Department" : "Create Department"}
        </div>
        <div>
          <p
            data-testid="heading-2"
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
        {AllOrganizations && AllOrganizations.length === 0 ? (
          <div className="p-5 mt-32 flex flex-col items-center justify-center">
            <div
              className={`text-xl font-semibold ${
                darkMode ? " text-orange-400" : "text-slate-600"
              }`}
            >
              No Organizations Available
            </div>
            <p
              className={`text-center mt-4 ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            >
              You need to create an organization before adding a department.
            </p>
            <div className="flex justify-center">
              <Link
                to={`/organization/organization-create-update`}
                className={`  text-sm md:text-base underline font-medium  
                rounded-md py-2 px-5 ${
                  darkMode ? " text-blue-400" : "text-blue-700"
                }`}
              >
                Create Organization
              </Link>
            </div>
          </div>
        ) : isAttribute && !isEditing ? (
          <DepartmentAttributes
            NextHandler={() => {
              setIsAttribute(false);
              getRes();
            }}
          />
        ) : (
          <form
            role="form"
            onSubmit={handleSubmit(onSubmit)}
            className={`max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 ${
              darkMode ? "bg-slate-600" : "bg-white"
            }`}
          >
            {!isEditing && (
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
                  onChange={(e) => {
                    setSelectedOrganization(e.target.value);
                  }}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <option value="">Select Organization</option>
                  {AllOrganizations &&
                    AllOrganizations.map((org) => (
                      <option
                        key={org?.organizationId}
                        value={org?.organizationId}
                      >
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
            )}
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
                data-testid="departmentName"
                placeholder="Department Name..."
                {...register("department", validateDepartment)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white text-gray-700"
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
                data-testid="deptDescError"
                placeholder="Department Description..."
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 5,
                    message: "Description must be at least 5 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Description must be less than 50 characters",
                  },
                })}
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white text-gray-700"
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
                type="text"
                id="employeeSearch"
                placeholder="Search employee for adding as manager.."
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white text-gray-700"
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
            {departmentAttribute &&
              departmentAttribute.map((attribute) => (
                <div className="mb-4" key={attribute.attributeId}>
                  <label
                    htmlFor={attribute.attributeKey}
                    className={`block text-sm font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {attribute.attributeKey}
                    <sup className="text-red-900 font-bold">*</sup>
                  </label>
                  <input
                    id={attribute.attributeKey}
                    type="text"
                    data-testid={attribute.attributeKey}
                    placeholder={`${attribute.attributeKey}...`}
                    {...register(attribute.attributeKey, {
                      required: `${attribute.attributeKey} is required`,
                    })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  />
                  {errors[attribute.attributeKey] && (
                    <p className="text-red-500 mt-1">
                      {errors[attribute.attributeKey].message}
                    </p>
                  )}
                </div>
              ))}
            <button
              type="submit"
              className={`text-center w-full text-sm md:text-base font-medium rounded-md py-2 px-5 ${
                loading ? "bg-slate-900" : "bg-blue-700"
              } ${
                darkMode ? "text-white" : "text-white"
              } hover:scale-95 transition-all duration-200`}
            >
              {isEditing ? "Update Department" : "Create Department"}
            </button>
          </form>
        )}
      </div>
      {confirmationModal && !isEditing && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
  );
};

export default CreateUpdateDepartment;
