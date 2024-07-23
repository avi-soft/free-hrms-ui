import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addOrganisation, updateOrganisation } from "../../../../../services/operations/OrganisationAPI";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import defaultImage from "../../../../../assets/Images/placeholder.jpg";
import toast from "react-hot-toast";
import { setSelectedImage, setExistingImage } from "../../../../../slices/OrganisationSlice";

const CreateUpdateOrganisation = () => {
  const { AccessToken } = useSelector((state) => state.auth);
  const { register, handleSubmit, setValue, formState: { errors }, setError, clearErrors } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useSelector((state) => state.theme);
  const selectedImage = useSelector((state) => state.Organisation.selectedImage);
  const existingImage = useSelector((state) => state.Organisation.existingImage);
  const inputRef = useRef(null);

  const { isEditing, organisation } = location.state || {
    isEditing: false,
    organisation: null,
  };

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isEditing && organisation) {
      setValue("organisation", organisation.name);
      setValue("description", organisation.description);
      setDescription(organisation.description);
      dispatch(setExistingImage(organisation.logo));
    }
  }, [isEditing, organisation, setValue, dispatch]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("organisation", data.organisation);
    formData.append("description", data.description);
    if (selectedImage) {
      formData.append("logo", selectedImage);
    }

    formData.append("navigate", navigate);
    formData.append("AccessToken", AccessToken);
    if (isEditing) {
      await dispatch(updateOrganisation(AccessToken, formData, organisation.organisationId));
    } else {
      await dispatch(addOrganisation(formData));
    }
  };

  const handleFileChange = (e) => {
    if (!e.target.files[0]) return;
    dispatch(setSelectedImage(e.target.files[0]));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setValue("description", e.target.value);
    if (e.target.value.trim().length < 5) {
      setError("description", {
        type: "minLength",
        message: "Description must be at least 5 characters",
      });
    } else {
      clearErrors("description");
    }
  };

  return (
    <div className={`pb-9 h-auto mb-10 mt-5 bg-slate-100 rounded ${darkMode ? "bg-slate-700 text-white" : ""}`}>
      <div className="p-5 flex items-center justify-between">
        <div className={`text-xl text-slate-600 font-semibold ${darkMode ? "text-white" : ""}`}>
          {isEditing ? "Edit Organisation" : "Create Organisation"}
        </div>
        <div>
          <p className={`text-slate-950 text-xl left-6 font-semibold ${darkMode ? "text-white" : ""}`}>
            Home / Dashboard / <span className="text-yellow-700">{isEditing ? "Edit Organisation" : "Create Organisation"}</span>
          </p>
        </div>
      </div>
      <div className={`container mx-auto mt-8`}>
        <form onSubmit={handleSubmit(onSubmit)} className={`max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 ${darkMode ? "bg-slate-600" : "bg-white"}`}>
          <div className={`mb-4`}>
            <label htmlFor="organisation" className={`block text-gray-700 text-sm font-bold mb-2 ${darkMode ? "text-white" : ""}`}>
              Organisation Name<sup className="text-red-900 font-bold">*</sup>
            </label>
            <input
              id="organisation"
              type="text"
              placeholder="Organisation Name..."
              {...register("organisation", {
                required: "Organisation Name is required",
                minLength: {
                  value: 3,
                  message: "Organisation Name must be at least 3 characters",
                },
                validate: (value) => value.trim().length >= 3 || "Organisation Name must not be empty or less than 3 characters",
              })}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
            />
            {errors.organisation && (
              <p className="text-red-500 mt-1">{errors.organisation.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className={`block text-gray-700 text-sm font-bold mb-2 ${darkMode ? "text-white" : ""}`}>
              Organisation Description<sup className="text-red-900 font-bold">*</sup>
            </label>
            <textarea
              id="description"
              placeholder="Organisation Description..."
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 5,
                  message: "Description must be at least 5 characters",
                },
                validate: (value) => value.trim().length >= 5 || "Description must not be empty or less than 5 characters",
              })}
              value={description}
              onChange={handleDescriptionChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
              rows={3} 
            />
            {errors.description && (
              <p className="text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="logo" className={`block text-gray-700 text-sm font-bold mb-2 ${darkMode ? "text-white" : ""}`}>
              Organisation Logo
            </label>
            <div className="flex items-center">
              <img
                src={selectedImage ? URL.createObjectURL(selectedImage) : existingImage || defaultImage}
                alt="Organisation Logo"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={inputRef}
                />
                <button
                  type="button"
                  onClick={() => inputRef.current.click()}
                  className={`py-1 px-3 text-sm font-medium rounded-md ${darkMode ? "bg-slate-400 text-black" : "bg-gray-900 text-white"} hover:scale-95 transition-all duration-200`}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-2 text-sm font-medium rounded-md ${darkMode ? "primary-gradient text-white" : "bg-blue-700 text-white"} hover:scale-95 transition-all duration-200`}
          >
            {isEditing ? "Update Organisation" : "Create Organisation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUpdateOrganisation;
