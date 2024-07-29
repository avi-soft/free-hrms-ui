import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Validation rules for role name
  const validateRoleName = {
    required: "Role Name is required",
    minLength: {
      value: 2,
      message: "Role Name must be at least 2 characters",
    },
    maxLength: {
      value: 20,
      message: "Role Name must not exceed 20 characters",
    },
    validate: {
      minLength: (value) =>
        value.trim().length >= 2 ||
        "Role Name must not be empty or less than 2 characters",
      noNumbers: (value) =>
        !/\d/.test(value) || "Role Name must not contain numbers",

      noSpecialChars: (value) =>
        /^[a-zA-Z0-9 ]*$/.test(value) ||
        "Role Name must not contain special characters",
      noExtraSpaces: (value) => {
        const trimmedValue = value.trim();
        return (
          !/\s{2,}/.test(trimmedValue) ||
          "Role Name must not contain consecutive spaces"
        );
      },
    },
  };

  useEffect(() => {
    if (role) {
      setValue("role", role.role);
      setSelectedPrivileges(role.privilege || []);
    }
  }, [role, setValue]);

  const onSubmit = async (data) => {
    if (selectedPrivileges.length === 0) {
      toast.error("Please select at least one privilege.");
      return;
    }

    const formattedRoleName = data.role.trim().replace(/\s+/g, " ");

    const formData = {
      ...data,
      role: formattedRoleName,
      privilege: selectedPrivileges,
    };

    if (isEditing) {
      await dispatch(updateRole(AccessToken, role?.roleId, formData, navigate));
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

  const handlePrivilegeChange = (privilegeValue) => {
    setSelectedPrivileges((prev) =>
      prev.includes(privilegeValue)
        ? prev.filter((p) => p !== privilegeValue)
        : [...prev, privilegeValue]
    );
  };

  const handleSelectAll = (group) => {
    const allPrivileges = group
      ? privilegeGroups[group].map((priv) => priv.value)
      : Object.values(privilegeGroups)
          .flat()
          .map((priv) => priv.value);

    setSelectedPrivileges((prev) => {
      const isAllSelected = allPrivileges.every((priv) => prev.includes(priv));
      return isAllSelected
        ? prev.filter((priv) => !allPrivileges.includes(priv))
        : Array.from(new Set([...prev, ...allPrivileges]));
    });
  };

  const isGroupAllSelected = (group) => {
    const groupPrivileges = privilegeGroups[group].map((priv) => priv.value);
    return groupPrivileges.every((priv) => selectedPrivileges.includes(priv));
  };

  const isGlobalAllSelected = () => {
    const allPrivileges = Object.values(privilegeGroups)
      .flat()
      .map((priv) => priv.value);
    return allPrivileges.every((priv) => selectedPrivileges.includes(priv));
  };

  const privilegeGroups = {
    department: departmentPrivileges,
    employee: employeePrivileges,
    performance: performancePrivileges,
    emergencyContact: emergencyContactPrivileges,
    leave: leavePrivileges,
  };

  return (
    <div className="container mx-auto p-5">
      <div
        className={`mx-auto shadow-md rounded px-8 pt-6 pb-8 pl-5 pr-5 mb-4 ${
          darkMode ? "bg-slate-700" : "bg-white"
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
            className={`text-md font-bold pl-1 rounded-md mb-4 ${
              darkMode ? "primary-gradient" : "text-gray-800"
            }`}
          >
            Workflow to {isEditing ? "Update" : "Create"} a Role
          </h2>
          <ol
            className={`list-decimal ml-2 list-inside mb-6 ${
              darkMode ? " text-orange-200" : "text-gray-800"
            }`}
          >
            <li>
              {isEditing
                ? "Update the role name, if required."
                : "Fill out the role name."}
            </li>
            <li>
              Select the appropriate tab to view the privileges related to a
              specific group (e.g., Leave, Department).
            </li>
            <li>
              Check the boxes for the privileges you want to assign to the role.
            </li>
          </ol>
        </div>

        <form role="form" onSubmit={handleSubmit(onSubmit)}>
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
              {...register("role", validateRoleName)}
              className={`shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
              }`}
            />
            {errors.role && (
              <p className="text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          <div className=" mb-4 text-orange-600">
            <label className="flex items-center w-fit">
              <input
                type="checkbox"
                checked={isGlobalAllSelected()}
                onChange={() => handleSelectAll(null)}
                className="mr-2"
              />
              Select All Privileges
            </label>
            <div className="mt-4 mb-4 flex items-center gap-4">
              {Object.keys(privilegeGroups).map((group) => (
                <button
                  key={group}
                  type="button"
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
          </div>
          <div className="mb-4 text-orange-400">
            <label className="flex items-center mb-4 w-fit">
              <input
                type="checkbox"
                checked={isGroupAllSelected(activeTab)}
                onChange={() => handleSelectAll(activeTab)}
                className="mr-2"
              />
              Select All{" "}
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
              Privileges
            </label>
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
  );
};

export default CreateUpdateRole;
