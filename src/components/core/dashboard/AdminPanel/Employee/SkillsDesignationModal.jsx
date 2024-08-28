import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../../common/IconBtn";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import {
  AddEmployeeDesignation,
  AddEmployeeSkill,
  DeleteEmployeeDesignation,
  DeleteEmployeeSkill,
  EditEmployeeDesignation,
  EditEmployeeSkill,
  GetEmployeeDesignations,
  GetEmployeeSkills,
} from "../../../../../services/operations/employeeAPI";
import toast from "react-hot-toast";
const SkillsDesignationModal = ({ modalData }) => {
  const dispatch = useDispatch();
  const [skills, setSkills] = useState([]);
  const [editSkillId, setEditSkillId] = useState(null);
  const [editSkillValue, setEditSkillValue] = useState("");
  const [designations, setDesignations] = useState([]);
  const [editDesignationId, setEditDesignationId] = useState(null);
  const [editDesignationValue, setEditDesignationValue] = useState("");
  const {
    type,
    register,
    getValues,
    setValue,
    AccessToken,
    handleSkillSelection,
    handleDesignationSelection,
    selectedSkills: checkedSkills,
    selectedDesignations:checkedDesignations
  } = modalData;
  const [selectedSkills, setSelectedSkills] = useState(checkedSkills);
  const [selectedDesignations, setSelectedDesignations] = useState(checkedDesignations);
  async function getSkills() {
    try {
      const response = await dispatch(GetEmployeeSkills(AccessToken));
      console.log(response);

      if (response?.status == 200) {
        setSkills(response?.data.content);
      }
    } catch (error) {}
  }
  async function getDesignations() {
    try {
      const response = await dispatch(GetEmployeeDesignations(AccessToken));
      if (response?.status == 200) {
        setDesignations(response?.data.content);
      }
    } catch (error) {}
  }

  const handleEditSkill = async () => {
    if (editSkillId) {
      try {
        const response = await dispatch(
          EditEmployeeSkill({ skill: editSkillValue }, editSkillId, AccessToken)
        );
        if (response?.data?.success == true) {
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
      const response = await dispatch(
        DeleteEmployeeSkill(skillId, AccessToken)
      );
      if (response?.data?.success == true) {
        getSkills();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error("Failed to delete skill:", error);
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
        if (response?.data.success == true) {
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
      const response = await dispatch(
        DeleteEmployeeDesignation(designationId, AccessToken)
      );
      console.log(response);
      if (response?.data.success == true) {
        getDesignations();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error("Failed to delete designation:", error);
    }
  };


  useEffect(() => {
    if(type==="skill")
    getSkills();
  else
    getDesignations();
  }, [dispatch, AccessToken]);
  console.log(modalData);
  console.log(selectedSkills);
  const { darkMode } = useSelector((state) => state.theme);

  const handleAddSkill = async () => {
    const newSkill = getValues("newSkill");
    if (newSkill) {
      try {
        const response = await dispatch(
          AddEmployeeSkill({ skill: newSkill }, AccessToken)
        );
        console.log(response);
        if (response?.data?.success == true) {
          toast.success(response?.data?.message);
          getSkills();
          setValue("newSkill", "");
        }
      } catch (error) {
        console.error("Failed to add skill:", error);
      }
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
        if (response?.data?.success == true) {
          getDesignations();
          toast.success(response?.data?.message);
          setValue("newDesignation", "");
        } // Clear input field
      } catch (error) {
        console.error("Failed to add designation:", error);
      }
    }
  };
  return (
    <div
      className={`fixed inset-0 z-[1000] grid place-items-center overflow-auto ${
        darkMode ? "bg-gray-800 bg-opacity-80" : "bg-slate-300 bg-opacity-10"
      } backdrop-blur-sm`}
    >
      <div
        className={`w-fit max-w-[1024px] p-7 ${
          darkMode
            ? "text-white border-gray-600 bg-gray-700"
            : "text-black border-black bg-gray-300"
        } rounded-lg`}
      >
        <div className="flex items-center gap-2">
          <input
            id="skill-input"
            type="text"
            {...register(type==="skill"?"newSkill":"newDesignation")}
            className={`border rounded px-3 py-2 w-1/2 ${
              darkMode
                ? "border-slate-300 bg-gray-500 text-white"
                : "border-slate-300 bg-white text-black"
            }`}
            placeholder={type==="skills"?"Enter a skill":"Enter a designation"}
          />
          <button
            type="button"
            onClick={()=>type==="skill"?handleAddSkill():handleAddDesignation()}
            className="bg-yellow-500 text-black py-2 px-4 rounded w-fit"
          >
           {type==="skill" ?"Add Skill":"Add Designation"}
          </button>
        </div>
        <div className="flex flex-wrap gap-y-12 gap-x-28 mt-8">
          {type === "skill" &&
            skills.map((skill, index) => (
              <div
                key={skill?.skillId}
                className="flex items-center gap-2 mb-2"
              >
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
                      checked={selectedSkills.includes(skill.skill)}
                      onChange={() =>
                        handleSkillSelection(
                          setSelectedSkills,
                          skill?.skillId,
                          skill.skill
                        )
                      }
                      className="mr-2"
                    />

                    <p>{skill?.skill}</p>
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
          {type === "designation" &&
            designations.map((designation, index) => (
              <div
                key={designation?.designationId}
                className="flex items-center gap-2 mb-2"
              >
                {editDesignationId === designation?.designationId ? (
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
                      checked={selectedDesignations.includes(
                        designation.designation
                      )}
                      onChange={() =>
                        handleDesignationSelection(
                          setSelectedDesignations,
                          designation?.designationId,
                          designation.designation
                        )
                      }
                      className="mr-2"
                    />
                    <p>{designation.designation}</p>
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
                  onClick={() =>
                    handleRemoveDesignation(designation?.designationId)
                  }
                  className="bg-red-500 text-white py-1 px-4 rounded ml-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
        </div>

        <div className=" flex gap-2 items-center justify-center mt-8">
          <IconBtn
            onclick={() => modalData?.btn1Handler(type==="skill"?selectedSkills:selectedDesignations)}
            text={modalData?.btn1Text}
          />
          <IconBtn
            onclick={modalData?.btn2Handler}
            color={0}
            text={modalData?.btn2Text}
          />
        </div>
      </div>
    </div>
  );
};

export default SkillsDesignationModal;
