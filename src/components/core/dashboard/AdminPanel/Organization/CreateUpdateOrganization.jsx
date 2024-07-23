import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrganisation,
  updateOrganisation,
  uploadOrganisationLogo,
} from "../../../../../services/operations/OrganisationAPI";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import defaultImage from "../../../../../assets/Images/placeholder.jpg";
import toast from "react-hot-toast";
import {
  setSelectedImage,
  setExistingImage,
} from "../../../../../slices/OrganisationSlice";

const CreateUpdateOrganisation = () => {
  const { AccessToken } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useSelector((state) => state.theme);
  const selectedImage = useSelector(
    (state) => state.Organisation.selectedImage
  );
  const existingImage = useSelector(
    (state) => state.Organisation.existingImage
  );
  const inputRef = useRef(null);

  const { isEditing, organization } = location.state || {
    isEditing: false,
    organization: null,
  };

  console.log(organization);

  const [description, setDescription] = useState("");
  const [organisationId, setOrganisationId] = useState(null);
  console.log(organisationId);

  useEffect(() => {
    if (isEditing && organization) {
      setValue("organizationName", organization.organizationName);
      setValue("organizationDescription", organization.organizationDescription);
      dispatch(setExistingImage(organization.organizationImage));
      setOrganisationId(organization.organizationId);
    }
  }, [isEditing, organization, setValue, dispatch]);

  const handleOrganizationSubmit = async (data) => {
    try {
      console.log(data);
      let response;
      if (isEditing) {
        response = await dispatch(
          updateOrganisation(AccessToken, data, organization.organizationId)
        );
      } else {
        response = await dispatch(addOrganisation(AccessToken, data));
      }
      console.log(response);
      setOrganisationId(response?.data?.data?.organizationId);
    } catch (error) {
      console.error("Error submitting organisation details:", error);
    }
  };

  const handleLogoUpload = async () => {
    if (!selectedImage || !organisationId) return;

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      await dispatch(
        uploadOrganisationLogo(AccessToken, navigate, organisationId, formData)
      );
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
  };

  const handleFileChange = (e) => {
    if (!e.target.files[0]) return;
    dispatch(setSelectedImage(e.target.files[0]));
  };

  return (
    <div
      className={`pb-9 h-auto mb-10 mt-5 bg-slate-100 rounded ${
        darkMode ? "bg-slate-700 text-white" : ""
      }`}
    >
      <div className="p-5 flex items-center justify-between">
        <div
          className={`text-xl text-slate-600 font-semibold ${
            darkMode ? "text-white" : ""
          }`}
        >
          {isEditing ? "Edit Organisation" : "Create Organisation"}
        </div>
        <div>
          <p
            className={`text-slate-950 text-xl left-6 font-semibold ${
              darkMode ? "text-white" : ""
            }`}
          >
            Home / Dashboard /{" "}
            <span className="text-yellow-700">
              {isEditing ? "Edit Organisation" : "Create Organisation"}
            </span>
          </p>
        </div>
      </div>
      <div className={`container mx-auto mt-8`}>
        <form
          onSubmit={handleSubmit(handleOrganizationSubmit)}
          className={`max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 ${
            darkMode ? "bg-slate-600" : "bg-white"
          }`}
        >
          <div className={`mb-4`}>
            <label
              htmlFor="organizationName"
              className={`block text-gray-700 text-sm font-bold mb-2 ${
                darkMode ? "text-white" : ""
              }`}
            >
              Organisation Name<sup className="text-red-900 font-bold">*</sup>
            </label>
            <input
              id="organisation"
              type="text"
              placeholder="Organisation Name..."
              {...register("organizationName", {
                required: "Organisation Name is required",
                minLength: {
                  value: 3,
                  message: "Organisation Name must be at least 3 characters",
                },
                validate: (value) =>
                  value.trim().length >= 3 ||
                  "Organisation Name must not be empty or less than 3 characters",
              })}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
              }`}
            />
            {errors.organisation && (
              <p className="text-red-500 mt-1">{errors.organisation.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="organizationDescription"
              className={`block text-gray-700 text-sm font-bold mb-2 ${
                darkMode ? "text-white" : ""
              }`}
            >
              Organisation Description
              <sup className="text-red-900 font-bold">*</sup>
            </label>
            <textarea
              id="organizationDescription"
              htmlFor="organizationDescription"
              placeholder="Organisation Description..."
              {...register("organizationDescription", {
                required: "Description is required",
                minLength: {
                  value: 5,
                  message: "Description must be at least 5 characters",
                },
                validate: (value) =>
                  value.trim().length >= 5 ||
                  "Description must not be empty or less than 5 characters",
              })}
              value={description}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
              }`}
              rows={3} // Set initial rows to 3
            />
            {errors.description && (
              <p className="text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 text-sm font-medium rounded-md mb-4 ${
              darkMode
                ? "primary-gradient text-white"
                : "bg-blue-700 text-white"
            } hover:scale-95 transition-all duration-200`}
          >
            {isEditing ? "Update Organisation" : "Submit Organisation"}
          </button>
        </form>

        {organisationId && (
          <div
            className={`max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 ${
              darkMode ? "bg-slate-600" : "bg-white"
            }`}
          >
            <div className="mb-4">
              <label
                htmlFor="large_size"
                className={`block text-gray-700 text-sm font-bold mb-2 ${
                  darkMode ? "text-white" : ""
                }`}
              >
                Add Organization Logo
              </label>
              <input
                className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="large_size"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <button
              onClick={handleLogoUpload}
              className={`w-full py-2 text-sm font-medium rounded-md ${
                darkMode
                  ? "primary-gradient text-white"
                  : "bg-green-700 text-white"
              } hover:scale-95 transition-all duration-200`}
            >
              Upload Logo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUpdateOrganisation;
