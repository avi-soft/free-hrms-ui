import React, { useState, useEffect, useRef, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { AddEmployeeAttributes, DeleteEmployeeAttribute, EditEmployeeAttributes, GetEmployeeAttributes } from "../../../../../services/operations/employeeAPI";
import { useNavigate } from "react-router-dom";
import { setStep } from "../../../../../slices/employeeSlice";

const EmployeeAttributes = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const { attributes } = useSelector((state) => state.employee); // Fetch existing attributes from Redux state
  const dispatch = useDispatch();
  const [newAttribute, setNewAttribute] = useState("");
  const [editAttributeId, setEditAttributeId] = useState(null);
  const [editAttributeValue, setEditAttributeValue] = useState("");
  const { register, handleSubmit, reset ,control} = useForm();
  const [localAttributes, setLocalAttributes] = useState(null);
  const { AccessToken } = useSelector((state) => state.auth);
  const navigate=useNavigate();

  async function getAttributes() {
    const attributes=await dispatch(GetEmployeeAttributes(AccessToken));
    console.log(attributes?.data);
    setLocalAttributes(attributes?.data); // Sync with Redux state

  }

  useEffect(  () => {

    getAttributes();
  }, [attributes]);
 
  console.log(localAttributes)


  const handleEditAttribute = (id, value) => {
    setEditAttributeId(id);
    setEditAttributeValue(value);
  };



  const handleDeleteAttribute = async (id) => {
    try {
      console.log("id is",id)
      const response=await dispatch(DeleteEmployeeAttribute(id,AccessToken));
      console.log(response);
      if(response?.data?.isSuccess) {
        toast.success(response?.data?.message);
        getAttributes();
     }
    } catch (error) {
      console.log("error is",error)
    }

  };
  const formatAndTrim = (value) => {
    return value.trim().replace(/\s+/g, ' ');
  };

  const handleSubmitForm = async(data) => {
    const formattedAttributeKey = formatAndTrim(data.attributeKey);

    try {
      const response = await dispatch(AddEmployeeAttributes({ attributeKey: formattedAttributeKey }, AccessToken));
      console.log(response);
      if(response?.data?.isSuccess) {
        toast.success(response?.data?.message);
        getAttributes();
        reset()

     }
    } catch (error) {
      console.log("error is",error)
    }
  };

  const handleSaveEdit = async (editedAttributeValue,id) => {
    const formattedAttributeValue = formatAndTrim(editAttributeValue);
    try{
        const response =await dispatch(EditEmployeeAttributes({attributeKey:formattedAttributeValue},id,AccessToken));
        console.log(response);
        if(response?.data?.isSuccess) {
           toast.success(response?.data?.message);
           getAttributes();
           navigate("/employee/employee-attributes")
        }
      setEditAttributeId(null);
      setEditAttributeValue("");
    }catch{

    }
  };

  const saveAllButton=async ()=> {
    const response=await dispatch(setStep(2))
    console.log("heeelo",response);
    navigate('/employee/employee-create-update')

  }

  return (
    <div className={`pb-9 h-auto mb-10 mt-5 rounded ${darkMode ? "bg-slate-700 text-white" : "bg-slate-100"}`}>
      <div className="p-5 flex items-center justify-between">
        <div
          className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-600"}`}
        >
          Employee Attributes
        </div>
      </div>
      <div className="container mx-auto mt-8">
        <form role="form" onSubmit={handleSubmit(handleSubmitForm)} className={`max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 ${darkMode ? "bg-slate-600" : "bg-white"}`}>
        <div className="mb-4">
            <label htmlFor="attributeKey" className={`block text-sm font-bold mb-2 ${darkMode ? "text-white" : "text-gray-700"}`}>
              Add New Attribute
            </label>
            <div className="flex flex-col gap-2">
              <Controller
                name="attributeKey"
                control={control}
                defaultValue=""
                rules={{
                  required: "Attribute name is required",
                  validate: value => value.trim() !== "" || "Attribute name cannot be empty"
                }}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      id="attributeKey"
                      type="text"
                      placeholder="New Attribute Name..."
                      className={`flex-1 shadow appearance-none border rounded py-2 px-3 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white text-gray-700"}`}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)} // Trim spaces
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-md mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
              <button
                type="submit"
                // onClick={handleAddAttribute}
                className={`flex-none h-full text-sm md:text-base font-medium rounded-md py-2 px-5 ${darkMode ? "bg-blue-500" : "bg-blue-700"} ${darkMode ? "text-white" : "text-white"} hover:scale-95 transition-all duration-200`}
              >
                Add Attribute
              </button>
              
            </div>
          </div>

          <div className="mb-4">
            {localAttributes?.length > 0 ? (
              localAttributes.map((attr) => (
                <div key={attr.attributeId} className="flex items-center mb-2">
                  {editAttributeId === attr.attributeId ? (
                    <>
                      <input
                        type="text"
                        value={editAttributeValue}
                        onChange={(e) => setEditAttributeValue(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white text-gray-700"}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(editAttributeValue,attr.attributeId)}
                        className="text-green-500 text-sm ml-2"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}>
                        {attr?.attributeKey}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleEditAttribute(attr.attributeId, attr.attributeKey)}
                        className="text-blue-500 text-sm ml-2"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAttribute(attr?.attributeId)}
                        className="text-red-500 text-sm ml-2"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className={`text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>No attributes available</p>
            )}
          </div>

          <button
           type="button" 
            onClick={saveAllButton}
            className={`w-full text-sm md:text-base font-medium rounded-md py-2 px-5 ${darkMode ? "bg-blue-500" : "bg-blue-700"} ${darkMode ? "text-white" : "text-white"} hover:scale-95 transition-all duration-200`}
          >
            Save All Attributes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeAttributes;
