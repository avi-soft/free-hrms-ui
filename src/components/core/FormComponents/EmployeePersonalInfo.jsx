import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import UploadEmployeeImage from "../dashboard/AdminPanel/Employee/UploadEmployeeImage";
import { setStep } from "../../../slices/employeeSlice";
import {
  addEmployeePersonalDetails,
  UpdateEmployeePersonalDetails,
  GetEmployeeAttributes,
} from "../../../services/operations/employeeAPI";
import { FaArrowRight, FaSave } from "react-icons/fa";
import { Departmentlist } from "../../../services/operations/departmentAPI";
import toast from "react-hot-toast";
import { setDepartments } from "../../../slices/departmentSlice";
import SkillsDesignationModal from "../dashboard/AdminPanel/Employee/SkillsDesignationModal";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const EmployeePersonalInfo = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    mode: "onBlur",
  });

  const [skillsDesignationModal, setSkillsDesignationModal] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { AccessToken } = useSelector((state) => state.auth);
  const [localAttributes, setLocalAttributes] = useState([]);
  const { AllDepartments } = useSelector((state) => state.department);
  const navigate=useNavigate()

  const darkMode = useSelector((state) => state.theme?.darkMode) || false;
  const { employees, currentOrganizationId: orgId } = useSelector(
    (state) => state.employee
  );
  const isEditing = useSelector((state) => state.editing.isEditing);
  const preEditedEmployeeDetails = useSelector(
    (state) => state.editing.preEditedEmployeeDetails
  );

  console.log(AllDepartments);
  console.log(employees);

  const onSubmit = (data) => {
    console.log("Form Data:", data);

    const trimmedData = {};
    // Trim all fields
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        trimmedData[key] = data[key]?.trim ? data[key].trim() : data[key];
      }
    }

    // Create attributes object by matching keys from localAttributes with trimmedData
    const attributesObj = localAttributes.reduce((acc, obj) => {
      const attributeName = obj.attributeKey; // Don't modify the key
      if (trimmedData[attributeName]) {
        acc[attributeName] = trimmedData[attributeName]; // Use the original key
      }
      return acc;
    }, {});

    const submissionData = {
      ...trimmedData,
      skillList: selectedSkills,
      designationList: selectedDesignations,
      attributes: attributesObj, // Include the attributes here
    };

    console.log("Submission Data:", submissionData);

    if (isEditing) {
      dispatch(
        UpdateEmployeePersonalDetails(
          preEditedEmployeeDetails.employeeId,
          submissionData, // Pass the correct submission data
          AccessToken
        )
      );
    } else {
      dispatch(
        addEmployeePersonalDetails(employees, submissionData, AccessToken)
      );
    }
  };

  async function getDepartments() {
    const response = await dispatch(Departmentlist(AccessToken, orgId));
    console.log(response);
    if (response?.status == 200) {
      dispatch(setDepartments(response?.data?.content));
    }
  }
  async function getAttributes() {
    try {
      const response = await dispatch(GetEmployeeAttributes(AccessToken));
      console.log(response?.data);
      setLocalAttributes(response?.data || []);
      return response?.data;
    } catch (error) {
      console.error("Failed to fetch attributes:", error);
    }
  }

  useEffect(() => {
    getAttributes();
    if (!isEditing) {
      getDepartments();
    }
  }, [AccessToken, dispatch]);

  const getLocalAttributesValue = async () => {
    const attributes = await getAttributes();
    const attributesObj =
      attributes &&
      attributes.reduce((acc, obj) => {
        const attributeName = obj.attributeKey.replace(/ /g, "");
        acc[attributeName] =
          preEditedEmployeeDetails.attributes[obj.attributeKey];
        return acc;
      }, {});
    return attributesObj;
  };

  useEffect(() => {
    if (isEditing && preEditedEmployeeDetails) {
      setSelectedDesignations(
        preEditedEmployeeDetails.designations.map((item) => item.designation)
      );
      setSelectedSkills(
        preEditedEmployeeDetails.skills.map((item) => item.skill)
      );

      getLocalAttributesValue().then((data) => {
        for (const [key, value] of Object.entries(preEditedEmployeeDetails)) {
          if (key === "skills" || key === "designations") {
            reset({
              ...preEditedEmployeeDetails,
              ...data,
              skills: value.skills || [],
              designations: value.designations || [],
            });
          } else if (key === "attributes") {
            Object.keys(value).forEach((attributeKey) => {
              setValue(attributeKey, value[attributeKey]);
            });
          } else {
            setValue(key, value);
          }
        }
      });
    }
  }, [isEditing, preEditedEmployeeDetails, setValue, reset]);

  const handleSkillSelection = (setSelectedSkills, skillId, skillName) => {
    console.log(skillName);

    setSelectedSkills((prevSkills) => {
      const existingSkill = prevSkills.find((skill) => skill === skillName);
      if (existingSkill) {
        return prevSkills.filter((skill) => skill !== skillName);
      } else {
        return [...prevSkills, skillName];
      }
    });
  };
  const handleDesignationSelection = (
    setSelectedDesignations,
    designationId,
    designationName
  ) => {
    setSelectedDesignations((prevDesignations) => {
      const existingDesignation = prevDesignations.find(
        (designation) => designation === designationName
      );
      if (existingDesignation) {
        return prevDesignations.filter(
          (designation) => designation !== designationName
        );
      } else {
        return [...prevDesignations, designationName];
      }
    });
  };

  const handleModal = (type) => {
    setSkillsDesignationModal({
      type,
      register,
      getValues,
      setValue,
      AccessToken,
      handleSkillSelection,
      handleDesignationSelection,
      selectedSkills,
      selectedDesignations,
      btn1Text: "Add",
      btn2Text: "Cancel",
      btn1Handler: (data) => {
        type === "skill"
          ? setSelectedSkills(data)
          : setSelectedDesignations(data);
        setSkillsDesignationModal(null);
      },
      btn2Handler: () => setSkillsDesignationModal(null),
    });
  };

  const toggleSelection = (id, type) => {
    if (type === "skill") {
      // Handle skill selection logic if needed
    } else if (type === "designation") {
      // Handle designation selection logic if needed
    }
  };

  return (
    <div className="h-fit">
      {/* UPLOAD IMAGE DIV */}
      <div>
        <UploadEmployeeImage />
      </div>
      {/* PERSONAL DETAILS DIV */}
      <div>
        <div className="ml-6 mt-4">
          <button
            // disabled={!hasCreateBranchAttributePrivilege}
            onClick={() =>  navigate("/employee/employee-attributes")} // Change the state to show the SubOrganizationAttribute
            className={`w-[220px] py-2 text-md font-medium rounded-md mb-4
      ${darkMode ? "primary-gradient text-white" : "bg-blue-700 text-white"} 
      hover:scale-95 transition-all duration-200   `}
          >
            Manage Attributes
          </button>
        </div>

        <h2
          className={`text-lg text-center font-semibold ${
            darkMode ? "text-slate-50" : "text-slate-600"
          }`}
        >
          {isEditing ? "Edit Personal Info" : "Personal Info"}
        </h2>

        <form
          data-testid="create-employee-form"
          className="p-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-2 gap-4">
            <label>
              <p
                className={`text-[0.875rem] ${
                  darkMode ? "text-white" : "text-slate-900"
                } mb-1 leading-[1.375rem] font-semibold`}
              >
                First Name<sup className="text-red-900">*</sup>
              </p>
              <input
                className={`rounded-[0.5rem] w-full p-[12px] border-b-[1px] ${
                  darkMode
                    ? "bg-gray-500 border-slate-800 text-white"
                    : "bg-white border-slate-300 text-black"
                }`}
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/, // Allow only letters and spaces
                    message: "First name should contain only letters",
                  },
                  validate: (value) =>
                    value.trim() !== "" || "First name cannot be empty",
                })}
                placeholder="Enter Your First Name"
                data-testid="first-name-input"
              />
              {errors.firstName && (
                <p className="text-red-500 mt-1">{errors.firstName.message}</p>
              )}
            </label>

            <div className="h-4 sm:hidden"></div>
            <label>
              <p
                className={`text-[0.875rem] ${
                  darkMode ? "text-white" : "text-slate-900"
                } mb-1 leading-[1.375rem] font-semibold`}
              >
                Last Name<sup className="text-red-900">*</sup>
              </p>
              <input
                className={`rounded-[0.5rem] w-full p-[12px] border-b-[1px] ${
                  darkMode
                    ? "bg-gray-500 border-slate-800 text-white"
                    : "bg-white border-slate-300 text-black"
                }`}
                type="text"
                {...register("lastName", {
                  required: "Last name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/, // Allow only letters and spaces
                    message: "Last name should contain only letters",
                  },
                  validate: (value) =>
                    value.trim() !== "" || "Last name cannot be empty",
                })}
                placeholder="Enter Your Last Name"
                data-testid="last-name-input"
              />
              {errors.lastName && (
                <p className="text-red-500 mt-1">{errors.lastName.message}</p>
              )}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mt-4">
              <label
                htmlFor="employeeCode"
                className={`block text-sm font-semibold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Employee Code<sup className="text-red-900">*</sup>
              </label>
              <input
                id="employeeCode"
                {...register("employeeCode", {
                  required: "Employee code is required",
                  pattern: {
                    value: /^[A-Za-z0-9]+$/, // Allow only letters and numbers
                    message:
                      "Employee code should contain only letters and numbers",
                  },
                  validate: (value) =>
                    value.trim() !== "" || "Employee code cannot be empty",
                })}
                type="text"
                className={`border rounded px-3 py-2 mt-2 w-full ${
                  darkMode
                    ? "border-slate-300 bg-gray-500 text-white"
                    : "border-slate-300 bg-white text-black"
                }`}
                placeholder="Enter Employee Code"
                data-testid="employee-code-input"
              />
              {errors.employeeCode && (
                <p className="text-red-500 mt-1">
                  {errors.employeeCode.message}
                </p>
              )}
            </div>
              <div className="mt-4">
                <label
                  htmlFor="departmentId"
                  className={`block text-sm font-semibold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Department<sup className="text-red-900">*</sup>
                </label>
                <select
                  required
                  id="departmentId"
                  {...register("departmentId")}
                  disabled={AllDepartments?.length == 0}
                  className={`border rounded px-3 py-2 mt-2 w-full ${
                    darkMode
                      ? "border-slate-300 bg-gray-500 text-white"
                      : "border-slate-300 bg-white text-black"
                  }`}
                  data-testid="department-select"
                >
                  <option value="" disabled selected>
                    Select Department
                  </option>
                  {AllDepartments.map((department) => (
                    <option
                      key={department?.departmentId}
                      value={department?.departmentId}
                    >
                      {department?.department}
                    </option>
                  ))}
                </select>
              </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {localAttributes.map((attr) => {
              const attributeName = attr.attributeKey.replace(/ /g, "");
              return (
                <div key={attr.attributeId} className="mt-4">
                  <label
                    htmlFor={attr?.attributeKey}
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {attributeName.charAt(0).toUpperCase() +
                      attributeName.slice(1).replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    id={attr?.attributeKey}
                    type="text"
                    {...register(attr?.attributeKey)}
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                    placeholder={`Enter Your ${attributeName}`}
                    data-testid={`${attributeName}-input`}
                  />
                  {errors[attributeName] && (
                    <p className="text-red-500 mt-1">
                      {errors[attributeName]?.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Skills and Designations Section */}
          <div className="flex gap-6 mt-6">
            {/* Skills Section */}
            <div className="flex flex-col flex-1  w-1/2 flex-wrap">
              <label
                htmlFor="skills"
                className={`block text-sm font-semibold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Skills
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleModal("skill")}
                  className="bg-yellow-500 text-black py-1 px-4 rounded"
                >
                  Add Skill
                </button>
              </div>
              <div className="mt-4 flex gap-3 flex-wrap">
                {selectedSkills.map((skill, index) => (
                  <div
                    key={skill?.skillId}
                    className="flex items-center gap-2 mb-2 flex-wrap"
                  >
                    <span className="border rounded-full pl-3 pr-2  flex items-center">
                      <p className="mb-1">{skill}</p>
                      <span className="rounded-full border ml-3">
                        <RxCross2
                          onClick={() =>
                            handleSkillSelection(
                              setSelectedSkills,
                              skill?.skillId,
                              skill
                            )
                          }
                        />
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Designations Section */}
            <div className="flex flex-col flex-1  w-1/2">
              <label
                htmlFor="designations"
                className={`block text-sm font-semibold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Designations
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleModal("designation")}
                  className="bg-yellow-500 text-black py-1 px-4 rounded"
                >
                  Add Designation
                </button>
              </div>
              <div className="mt-4 flex gap-3 flex-wrap">
                {selectedDesignations.map((designation, index) => (
                  <div
                    key={designation?.designationId}
                    className="flex items-center gap-2 mb-2 flex-wrap"
                  >
                    <span className="border rounded-full pl-3 pr-2  flex items-center">
                      <p className="mb-1">{designation}</p>
                      <span className="rounded-full border ml-3">
                        <RxCross2
                          onClick={() =>
                            handleDesignationSelection(
                              setSelectedDesignations,
                              designation?.designationId,
                              designation
                            )
                          }
                        />
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-green-500 text-white py-1 px-4 rounded flex items-center"
            >
              <FaSave className="mr-2" /> Save All Changes
            </button>
            <button
              onClick={() => dispatch(setStep(3))}
              className={`text-center  text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200
                  bg-yellow-500 text-black py-1 px-5 flex items-center justify-center`}
            >
              {isEditing ? "Update Additional Details" : "Next Step"}
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </form>
      </div>

      {skillsDesignationModal && (
        <SkillsDesignationModal modalData={skillsDesignationModal} />
      )}
    </div>
  );
};

export default EmployeePersonalInfo;
