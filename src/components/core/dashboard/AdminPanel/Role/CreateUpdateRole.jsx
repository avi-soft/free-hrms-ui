import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  leavePrivileges,
  departmentPrivileges,
  performancePrivileges,
  emergencyContactPrivileges,
  employeePrivileges,
} from "../../../../../constants/Roles";
import {
  addRole,
  updateRole,
} from "../../../../../services/operations/roleAPI";
import { useLocation, useNavigate } from "react-router-dom";

const CreateUpdateRole = () => {
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);
  const [activeTab, setActiveTab] = useState("department");
  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isEditing, role } = location.state || {
    isEditing: false,
    role: null,
  };

  console.log(role);
  console.log(selectedPrivileges);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const privilegeGroups = {
    department: departmentPrivileges,
    employee: employeePrivileges,
    performance: performancePrivileges,
    emergencyContact: emergencyContactPrivileges,
    leave: leavePrivileges,
  };

  useEffect(() => {
    if (role) {
      setValue("role", role.role);
      setSelectedPrivileges(role.privileges || []);
    }
  }, [role, setValue]);

  const handlePrivilegeChange = (privilegeValue) => {
    setSelectedPrivileges((prev) =>
      prev.includes(privilegeValue)
        ? prev.filter((p) => p !== privilegeValue)
        : [...prev, privilegeValue]
    );
  };

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      privileges: selectedPrivileges,
    };
    console.log(formData);
    if (isEditing) {
      await dispatch(updateRole(AccessToken, formData, navigate));
    } else {
      await dispatch(addRole(AccessToken, formData, navigate));
    }
    setSelectedPrivileges([]);
  };

  const renderPrivileges = (privileges) => {
    return privileges.map((privilege) => (
      <div key={privilege.value} className="flex items-center mb-2">
        <input
          type="checkbox"
          id={`privilege_${privilege.value}`}
          value={privilege.value}
          checked={selectedPrivileges.includes(privilege.value)}
          onChange={() => handlePrivilegeChange(privilege.value)}
          className="mr-2"
        />
        <label
          htmlFor={`privilege_${privilege.value}`}
          className={`text-base font-semibold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {privilege.description}
        </label>
      </div>
    ));
  };

  return (
    <div
      className={`pb-9 mb-10 mt-5 bg-slate-100 rounded ${
        darkMode ? "bg-slate-700 text-white" : ""
      }`}
    >
      <div className="p-5 flex items-center justify-between">
        <div
          className={`text-xl text-slate-600 font-semibold ${
            darkMode ? "text-white" : ""
          }`}
        >
          {isEditing ? "Update Role" : "Create Role"}
        </div>
        <div>
          <p
            className={`text-slate-950 text-xl left-6 font-semibold ${
              darkMode ? "text-white" : ""
            }`}
          >
            Home / Dashboard /{" "}
            <span className="text-yellow-700">
              {isEditing ? "Update Role" : "Create Role"}
            </span>
          </p>
        </div>
      </div>

      <div className="p-5 pb-0">
        <h2
          className={`text-lg font-semibold pl-1 rounded-md mb-4 ${
            darkMode ? "primary-gradient" : "text-gray-800"
          }`}
        >
          Workflow to {isEditing ? "Update" : "Create"} a Role
        </h2>
        <ol
          className={`list-decimal list-inside mb-6 ${
            darkMode ? " text-orange-200" : "text-gray-800"
          }`}
        >
          <li>
            Select the appropriate tab to view the privileges related to a
            specific group (e.g., Leave, Department).
          </li>
          <li>
            Check the boxes for the privileges you want to assign to the role.
          </li>
          <li>
            Fill out the role name and submit the form to{" "}
            {isEditing ? "update" : "create"} the role.
          </li>
        </ol>
      </div>

      <div className="container mx-auto p-5">
        <div
          className={`mx-auto shadow-md rounded px-8 pt-6 pb-8 pl-5 pr-5 mb-4 ${
            darkMode ? "bg-slate-600" : "bg-white"
          }`}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="roleName"
                className={`block text-gray-700 text-sm font-bold mt-2 mb-2 ${
                  darkMode ? "text-white" : ""
                }`}
              >
                Role Name<sup className="text-red-900 font-bold">*</sup>
              </label>
              <input
                id="role"
                type="text"
                placeholder="Enter role name..."
                {...register("role", {
                  required: "Role Name is required",
                  minLength: {
                    value: 2,
                    message: "Role Name must be at least 2 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Role Name must contain only letters",
                  },
                })}
                className={`shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                }`}
              />
              {errors.role && (
                <p className="text-red-500 mt-1">{errors.role.message}</p>
              )}
            </div>

            <div className="mb-4">
              <div className="flex space-x-4 mb-4">
                {Object.keys(privilegeGroups).map((group) => (
                  <button
                    key={group}
                    onClick={() => setActiveTab(group)}
                    className={`px-4 py-2 rounded ${
                      activeTab === group
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <span className="text-md">
                      {group.charAt(0).toUpperCase() + group.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
              <div className="">
                {renderPrivileges(privilegeGroups[activeTab])}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className={`text-center w-1/4 text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                  darkMode
                    ? "primary-gradient text-white"
                    : "bg-blue-700 text-white"
                } py-1 px-5`}
              >
                {isEditing ? "Update Role" : "Create Role"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUpdateRole;