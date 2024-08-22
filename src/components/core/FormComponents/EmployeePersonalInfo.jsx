import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import UploadEmployeeImage from "../dashboard/AdminPanel/Employee/UploadEmployeeImage";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../../../slices/employeeSlice";
import {
  addEmployeePersonalDetails,
  UpdateEmployeePersonalDetails,
  AddEmployeeSkill,
  DeleteEmployeeSkill,
  GetEmployeeSkills,
  AddEmployeeDesignation,
  DeleteEmployeeDesignation,
  GetEmployeeDesignations,
  EditEmployeeSkill,
  EditEmployeeDesignation,
  GetEmployeeAttributes,
} from "../../../services/operations/employeeAPI";
import { FaPlus, FaEdit, FaArrowRight, FaTrash, FaSave } from "react-icons/fa";
import { Departmentlist } from "../../../services/operations/departmentAPI";

const EmployeePersonalInfo = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    reset,
    getValues,
  } = useForm();
  const {
    fields: skillsFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });
  const {
    fields: designationFields,
    append: appendDesignation,
    remove: removeDesignation,
  } = useFieldArray({
    control,
    name: "designations",
  });

  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [selectedDesignations, setSelectedDesignations] = useState(new Set());

  const [editSkillId, setEditSkillId] = useState(null);
  const [editSkillValue, setEditSkillValue] = useState("");
  const [editDesignationId, setEditDesignationId] = useState(null);
  const [editDesignationValue, setEditDesignationValue] = useState("");

  const { loading } = useSelector((state) => state.auth);
  const { AccessToken } = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.theme?.darkMode) || false;
  const dispatch = useDispatch();
  const [departments, setDepartments] = useState([]);
  const [localAttributes, setLocalAttributes] = useState([]);
  const { employees } = useSelector((state) => state.employee);
  const isEditing = useSelector((state) => state.editing.isEditing);
  const preEditedEmployeeDetails = useSelector(
    (state) => state.editing.preEditedEmployeeDetails
  );
  const orgId = useSelector((state) => state?.employee?.currentOrganizationId);

  const onSubmit = (data) => {
    const employeeId = employees[0];
    if (isEditing) {
      dispatch(
        UpdateEmployeePersonalDetails(
          preEditedEmployeeDetails.employeeId,
          data,
          AccessToken
        )
      );
    } else {
      dispatch(addEmployeePersonalDetails(employeeId, data, AccessToken));
    }
  };

  async function getAttributes() {
    try {
      const response = await dispatch(GetEmployeeAttributes(AccessToken));
      setLocalAttributes(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch attributes:", error);
    }
  }

  async function getSkills() {
    try {
      const response = await dispatch(GetEmployeeSkills(AccessToken));
      if (response?.data) {
        response.data.forEach((skill) =>
          appendSkill({ skill: skill.skill, id: skill.skillId })
        );
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  }

  async function getDesignations() {
    try {
      const response = await dispatch(GetEmployeeDesignations(AccessToken));
      if (response?.data) {
        response.data.forEach((designation) =>
          appendDesignation({
            designation: designation.designation,
            id: designation.designationId,
          })
        );
      }
    } catch (error) {
      console.error("Failed to fetch designations:", error);
    }
  }

  useEffect(() => {
    getAttributes();
    getSkills();
    getDesignations();
  }, [AccessToken, dispatch]);

  const fetchDepartments = async () => {
    try {
      const response = await dispatch(Departmentlist(AccessToken, orgId));
      setDepartments(response?.data);
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [dispatch, AccessToken]);

  useEffect(() => {
    if (isEditing && preEditedEmployeeDetails) {
      for (const [key, value] of Object.entries(preEditedEmployeeDetails)) {
        if (key === "skills" || key === "designations") {
          reset({
            ...preEditedEmployeeDetails,
            skills: value.skills || [],
            designations: value.designations || [],
          });
        } else {
          setValue(key, value);
        }
      }
    }
  }, [isEditing, preEditedEmployeeDetails, setValue, reset]);

  const handleAddSkill = async () => {
    const newSkill = getValues("newSkill");
    if (newSkill) {
      try {
        const response = await dispatch(
          AddEmployeeSkill({ skill: newSkill }, AccessToken)
        );
        appendSkill({ skill: newSkill, id: response.data.skillId });
        setValue("newSkill", ""); // Clear input field
      } catch (error) {
        console.error("Failed to add skill:", error);
      }
    }
  };

  const handleEditSkill = async () => {
    if (editSkillId) {
      try {
        const response = await dispatch(
          EditEmployeeSkill({ skill: editSkillValue }, editSkillId, AccessToken)
        );
        const updatedSkill = response.data;
        const index = skillsFields.findIndex((field) => field.id === editSkillId);
        if (index !== -1) {
          skillsFields[index] = { ...skillsFields[index], skill: updatedSkill.skill };
        }
        setEditSkillId(null);
        setEditSkillValue("");
      } catch (error) {
        console.error("Failed to edit skill:", error);
      }
    }
  };

  const handleRemoveSkill = async (index, skillId) => {
    try {
      await dispatch(DeleteEmployeeSkill(skillId, AccessToken));
      removeSkill(index);
      setSelectedSkills((prev) => {
        const newSet = new Set(prev);
        newSet.delete(skillId);
        return newSet;
      });
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  const handleAddDesignation = async () => {
    const newDesignation = getValues("newDesignation");
    if (newDesignation) {
      try {
        const response = await dispatch(
          AddEmployeeDesignation({ designation: newDesignation }, AccessToken)
        );
        appendDesignation({
          designation: newDesignation,
          id: response.data.designationId,
        });
        setValue("newDesignation", ""); // Clear input field
      } catch (error) {
        console.error("Failed to add designation:", error);
      }
    }
  };

  const handleEditDesignation = async () => {
    if (editDesignationId) {
      try {
        const response = await dispatch(
          EditEmployeeDesignation({ designation: editDesignationValue }, editDesignationId, AccessToken)
        );
        const updatedDesignation = response.data;
        const index = designationFields.findIndex((field) => field.id === editDesignationId);
        if (index !== -1) {
          designationFields[index] = { ...designationFields[index], designation: updatedDesignation.designation };
        }
        setEditDesignationId(null);
        setEditDesignationValue("");
      } catch (error) {
        console.error("Failed to edit designation:", error);
      }
    }
  };

  const handleRemoveDesignation = async (index, designationId) => {
    try {
      await dispatch(DeleteEmployeeDesignation(designationId, AccessToken));
      removeDesignation(index);
      setSelectedDesignations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(designationId);
        return newSet;
      });
    } catch (error) {
      console.error("Failed to delete designation:", error);
    }
  };

  const toggleSelection = (id, type) => {
    if (type === "skill") {
      setSelectedSkills((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    } else if (type === "designation") {
      setSelectedDesignations((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
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
            {localAttributes.map((attr) => {
              const attributeName = attr.attributeKey.replace(/ /g, "");
              return (
                <div key={attr.attributeId} className="mt-4">
                  <label
                    htmlFor={attributeName}
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {attributeName.charAt(0).toUpperCase() +
                      attributeName.slice(1).replace(/([A-Z])/g, " $1")}
                    <sup className="text-red-900">*</sup>
                  </label>
                  <input
                    id={attributeName}
                    type="text"
                    {...register(attributeName, { required: true })}
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
            <div className="flex flex-col flex-1">
              <label
                htmlFor="skills"
                className={`block text-sm font-semibold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Skills
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="skill-input"
                  type="text"
                  {...register("newSkill")}
                  className={`border rounded px-3 py-2 ${
                    darkMode
                      ? "border-slate-300 bg-gray-500 text-white"
                      : "border-slate-300 bg-white text-black"
                  }`}
                  placeholder="Enter a skill"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-yellow-500 text-black py-1 px-4 rounded"
                >
                  Add Skill
                </button>
              </div>
              <div className="mt-4">
                {skillsFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    {editSkillId === field.id ? (
                      <>
                        <input
                          type="text"
                          value={editSkillValue}
                          onChange={(e) => setEditSkillValue(e.target.value)}
                          className={`border rounded px-3 py-2 ${
                            darkMode
                              ? "border-slate-300  text-white"
                              : "border-slate-300  text-black"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleEditSkill}
                          className="bg-green-500 text-white py-1 px-4 rounded ml-2"
                        >
                          <FaSave />
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          checked={selectedSkills.has(field.id)}
                          onChange={() => toggleSelection(field.id, "skill")}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={field.skill}
                          readOnly
                          className={`border rounded px-3 py-2 ${
                            darkMode
                              ? "border-slate-300 bg-gray-500 text-white"
                              : "border-slate-300 bg-white text-black"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditSkillId(field.id);
                            setEditSkillValue(field.skill);
                          }}
                          className="text-blue-500 ml-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index, field.id)}
                          className="text-red-500 ml-2"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Designations Section */}
            <div className="flex flex-col flex-1">
              <label
                htmlFor="designations"
                className={`block text-sm font-semibold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Designations
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="designation-input"
                  type="text"
                  {...register("newDesignation")}
                  className={`border rounded px-3 py-2 ${
                    darkMode
                      ? "border-slate-300 bg-gray-500 text-white"
                      : "border-slate-300 bg-white text-black"
                  }`}
                  placeholder="Enter a designation"
                />
                <button
                  type="button"
                  onClick={handleAddDesignation}
                  className="bg-yellow-500 text-black py-1 px-4 rounded"
                >
                  Add Designation
                </button>
              </div>
              <div className="mt-4">
                {designationFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 mb-2 border p-2 rounded"
                  >
                    {editDesignationId === field.id ? (
                      <>
                        <input
                          type="text"
                          value={editDesignationValue}
                          onChange={(e) => setEditDesignationValue(e.target.value)}
                          className={`border rounded px-3 py-2 ${
                            darkMode
                              ? "border-slate-300 bg-gray-500 text-white"
                              : "border-slate-300 bg-white text-black"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleEditDesignation}
                          className="bg-green-500 text-white py-1 px-4 rounded ml-2"
                        >
                          <FaSave />
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          checked={selectedDesignations.has(field.id)}
                          onChange={() => toggleSelection(field.id, "designation")}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={field.designation}
                          readOnly
                          className={`border rounded px-3 py-2 ${
                            darkMode
                              ? "border-slate-300 bg-gray-500 text-white"
                              : "border-slate-300 bg-white text-black"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditDesignationId(field.id);
                            setEditDesignationValue(field.designation);
                          }}
                          className="text-blue-500 ml-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDesignation(index, field.id)}
                          className="text-red-500 ml-2"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-x-3 mt-5">
            <button
              data-testid="edit-button"
              type="submit"
              className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                darkMode
                  ? "bg-yellow-500 text-black"
                  : "bg-yellow-500 text-black"
              } py-1 px-5 flex items-center`}
            >
              {isEditing ? (
                <>
                  <FaEdit className="mr-2" />
                  Update
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" />
                  Add
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col items-center justify-center px-72 w-full">
        <button
          onClick={() => dispatch(setStep(3))}
          className={`text-center w-full text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200
                  bg-yellow-500 text-black py-1 px-5 flex items-center justify-center`}
        >
          {isEditing ? "Update Additional Details" : "Next Step"}
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default EmployeePersonalInfo;
