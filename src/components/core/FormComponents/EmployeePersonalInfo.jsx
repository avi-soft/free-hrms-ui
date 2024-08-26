import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import UploadEmployeeImage from "../dashboard/AdminPanel/Employee/UploadEmployeeImage";
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
import toast from "react-hot-toast";
import { setDepartments } from "../../../slices/departmentSlice";

const EmployeePersonalInfo = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const [editSkillId, setEditSkillId] = useState(null);
  const [editSkillValue, setEditSkillValue] = useState("");
  const [skills, setSkills] = useState([]);
  const [designations,setDesignations]=useState([])
  const [editDesignationId, setEditDesignationId] = useState(null);
  const [editDesignationValue, setEditDesignationValue] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { AccessToken } = useSelector((state) => state.auth);
  const [localAttributes, setLocalAttributes] = useState([]);
  const { AllDepartments } = useSelector((state) => state.department);

  const darkMode = useSelector((state) => state.theme?.darkMode) || false;
  const {
    employees,
    currentOrganizationId: orgId,
  } = useSelector((state) => state.employee);
  const isEditing = useSelector((state) => state.editing.isEditing);
  const preEditedEmployeeDetails = useSelector(
    (state) => state.editing.preEditedEmployeeDetails
  );

  console.log(skills);
  console.log(designations);
  console.log(AllDepartments);
  

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
  



  async function getDepartments() {
    const response=await dispatch(Departmentlist(AccessToken,orgId));
    console.log(response);
    if(response?.status==200) {
      dispatch(setDepartments(response?.data?.content));
    }
  }
  async function getAttributes() {
    try {
      const response = await dispatch(GetEmployeeAttributes(AccessToken));
      setLocalAttributes(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch attributes:", error);
    }
  }

  async function getDesignations() {
    try {
      const response = await dispatch(GetEmployeeDesignations(AccessToken));
      if (response?.status == 200) {
        setDesignations(response?.data);
      }
    } catch (error) {}
  }

  async function getSkills() {
    try {
      const response = await dispatch(GetEmployeeSkills(AccessToken));
      console.log(response);

      if (response?.status == 200) {
        setSkills(response?.data);
      }
    } catch (error) {}
  }


  useEffect(() => {
    getAttributes();
    getDesignations();
    getSkills();
    getDepartments();

  }, [AccessToken, dispatch]);

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
        console.log(response);
        if(response?.data?.success==true) {
          toast.success(response?.data?.message);
          getSkills();
          setValue("newSkill", ""); 
        }

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
        if(response?.data?.success==true) {
          toast.success(response?.data?.message);
          setEditSkillId(null);
          setEditSkillValue("");
          getSkills();
        }

      } catch (error) {
        console.error("Failed to edit skill:", error);
      }
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
     const response= await dispatch(DeleteEmployeeSkill(skillId, AccessToken));
     if(response?.data?.success==true) {
      getSkills();
      toast.success(response?.data?.message)
     }
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
        console.log(response);
        if(response?.data?.success==true) {
          getDesignations();
          toast.success(response?.data?.message);
          setValue("newDesignation", "");
        }       // Clear input field


      } catch (error) {
        console.error("Failed to add designation:", error);
      }
    }
  };

  const handleEditDesignation = async () => {
    if (editDesignationId) {
      try {
        const response = await dispatch(
          EditEmployeeDesignation(
            { designation: editDesignationValue },
            editDesignationId,
            AccessToken
          )
        );
        console.log(response);
        if(response?.data.success==true) {
          toast.success(response?.data?.message);
          getDesignations();
        }
        setEditDesignationId(null);
        setEditDesignationValue("");
      } catch (error) {
        console.error("Failed to edit designation:", error);
      }
    }
  };

  const handleRemoveDesignation = async (designationId) => {
    try {
      const response=await dispatch(DeleteEmployeeDesignation(designationId, AccessToken));
      console.log(response);
      if(response?.data.success==true) {
        getDesignations();
        toast.success(response?.data?.message)

      }
    } catch (error) {
      console.error("Failed to delete designation:", error);
    }
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
                {skills.map((skill, index) => (
                  <div key={skill?.skillId} className="flex items-center gap-2 mb-2">
                    {editSkillId === skill?.skillId ? (
                      <>
                        <input
                          type="text"
                          value={editSkillValue}
                          onChange={(e) => setEditSkillValue(e.target.value)}
                          className={`border rounded px-3 py-2 ${
                            darkMode
                              ? "border-slate-300 bg-gray-500  text-white"
                              : "border-slate-300  bg-white  text-black"
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
                          // Add toggle selection logic if needed
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={skill?.skill}
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
                            setEditSkillId(skill?.skillId);
                            setEditSkillValue(skill.skill);
                          }}
                          className="bg-yellow-500 text-black py-1 px-4 rounded ml-2"
                        >
                          <FaEdit />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill?.skillId)}
                      className="bg-red-500 text-white py-1 px-4 rounded ml-2"
                    >
                      <FaTrash />
                    </button>
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
                {designations.map((designation, index) => (
                  <div
                    key={designation?.designationId}
                    className="flex items-center gap-2 mb-2"
                  >
                    {editDesignationId === designation?.designationId ? (
                      <>
                        <input
                          type="text"
                          value={editDesignationValue}
                          onChange={(e) =>
                            setEditDesignationValue(e.target.value)
                          }
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
                          // Add toggle selection logic if needed
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={designation.designation}
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
                            setEditDesignationId(designation?.designationId);
                            setEditDesignationValue(designation.designation);
                          }}
                          className="bg-yellow-500 text-black py-1 px-4 rounded ml-2"
                        >
                          <FaEdit />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveDesignation(designation?.designationId)}

                      className="bg-red-500 text-white py-1 px-4 rounded ml-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => dispatch(setStep(1))}
              className="bg-yellow-500 text-black py-1 px-4 rounded flex items-center"
            >
              <FaArrowRight className="mr-2" /> Next
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white py-1 px-4 rounded flex items-center"
            >
              <FaSave className="mr-2" /> Save
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
