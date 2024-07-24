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
  setShowOption,
} from "../../../../../slices/OrganisationSlice";

const CreateUpdateOrganisation = () => {
  const { AccessToken } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { showOption } = useSelector((state) => state.Organisation);
  const { darkMode } = useSelector((state) => state.theme);
  const selectedImage = useSelector(
    (state) => state.Organisation.selectedImage
  );
  const existingImage = useSelector(
    (state) => state.Organisation.existingImage
  );

  const { isEditing, organization } = location.state || {
    isEditing: false,
    organization: null,
  };

  const [organisationId, setOrganisationId] = useState(null);
  const [showLogoUploadDialog, setShowLogoUploadDialog] = useState(false);

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
      let response;
      if (isEditing) {
        response = await dispatch(
          updateOrganisation(
            AccessToken,
            data,
            navigate,
            organization.organizationId
          )
        );
      } else {
        response = await dispatch(addOrganisation(AccessToken, data));
      }
      setOrganisationId(response?.data?.data?.organizationId);
      if (isEditing) {
      }
      if (response?.status != 201) return null;
      setShowLogoUploadDialog(true);
    } catch (error) {
      console.error("Error submitting organisation details:", error);
    }
  };

  const handleLogoUpload = async () => {
    if (!selectedImage || !organisationId) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      setLoading(true);
      const response = await dispatch(
        uploadOrganisationLogo(AccessToken, navigate, organisationId, formData)
      );
      setShowLogoUploadDialog(false);
      if (response?.status != 200) throw new Error(response?.data?.message);
      else {
        if (isEditing) {
          toast.success(response?.data?.message);

          return null;
        }
        if (showOption == "false") {
          dispatch(setShowOption(true));
        }
        navigate("/organization/organization-list");
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      setLoading(false);
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
        {isEditing ? (
          <div
            className={`max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 ${
              darkMode ? "bg-slate-600" : "bg-white"
            }`}
          >
            <form onSubmit={handleSubmit(handleOrganizationSubmit)}>
              <div className="mb-4">
                <div className="flex items-center">
                  <img
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : existingImage || defaultImage
                    }
                    alt="Organisation Logo"
                    className="aspect-square rounded-full object-cover h-20"
                  />
                  <div className="w-[80%] flex gap-4 ml-5 flex-col">
                    <p
                      className={`font-normal text-lg ${
                        darkMode ? "text-white" : "text-zinc-800"
                      }`}
                    >
                      Add Organization Logo
                    </p>
                    <div className="flex items-center gap-4">
                      {!loading && (
                        <div>
                          <input
                            data-testid="file-input"
                            className="hidden"
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            required
                            onChange={handleFileChange}
                          />
                          <button
                            type="button"
                            onClick={() => inputRef.current.click()}
                            className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                              darkMode
                                ? " bg-slate-400 text-black"
                                : "bg-gray-900 text-white"
                            } py-1 px-5`}
                            disabled={loading}
                          >
                            Select
                          </button>
                        </div>
                      )}
                      <div
                        className={`text-center
                           text-sm md:text-base font-medium 
                           rounded-md leading-6 hover:scale-95 
                           transition-all duration-200 ${
                             darkMode
                               ? "bg-yellow-400 text-black"
                               : "bg-yellow-500 text-black"
                           } `}
                      >
                        <div
                          className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                            darkMode
                              ? "bg-yellow-400 text-black"
                              : "bg-yellow-500 text-black"
                          } py-1 px-5`}
                          onClick={handleSubmit(handleLogoUpload)}
                          style={{
                            cursor: loading ? "not-allowed" : "pointer",
                          }}
                        >
                          <button
                            className="flex place-items-center gap-2"
                            disabled={loading}
                          >
                            {loading ? (
                              <>Uploading...</>
                            ) : (
                              <>
                                <FiUpload className="mr-2" />
                                {isEditing ? "Update" : "Upload"}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="ml-4">
                    <input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      ref={inputRef}
                    />
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => inputRef.current.click()}
                        className={`py-1 px-3 text-sm font-medium rounded-md ${
                          darkMode
                            ? "bg-slate-400 text-black"
                            : "bg-gray-900 text-white"
                        } hover:scale-95 transition-all duration-200`}
                      >
                        Select
                      </button>
                      <button
                        onClick={handleLogoUpload}
                        className={` py-2 text-sm font-medium rounded-md ${
                          darkMode
                            ? "primary-gradient text-white"
                            : "bg-green-700 text-white"
                        } hover:scale-95 transition-all duration-200`}
                      >
                        Update Logo
                      </button>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className={`mb-4`}>
                <label
                  htmlFor="organizationName"
                  className={`block text-gray-700 text-sm font-bold mb-2 ${
                    darkMode ? "text-white" : ""
                  }`}
                >
                  Organisation Name
                  <sup className="text-red-900 font-bold">*</sup>
                </label>
                <input
                  id="organization"
                  type="text"
                  placeholder="Organisation Name..."
                  {...register("organizationName", 
                    {
                    required: "Organisation Name is required",
                    minLength: {
                      value: 3,
                      message:
                        "Organisation Name must be at least 3 characters",
                    },
                    validate: {
                      noNumbers: (value) =>
                        !/\d/.test(value) ||
                        "Organisation Name must not contain numbers",
                      minLength: (value) =>
                        value.trim().length >= 3 ||
                        "Organisation Name must not be empty or less than 3 characters",
                    },
                  })}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                  }`}
                />
                {errors.organizationName && (
                  <p className="text-red-500 mt-1">
                    {errors.organizationName.message}
                  </p>
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
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                  }`}
                  rows={3}
                />
                {errors.organizationDescription && (
                  <p className="text-red-500 mt-1">
                    {errors.organizationDescription.message}
                  </p>
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
          </div>
        ) : (
          <div>
            {showLogoUploadDialog ? (
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
                  <div className="flex items-center">
                    <img
                      src={
                        selectedImage
                          ? URL.createObjectURL(selectedImage)
                          : existingImage || defaultImage
                      }
                      alt="Organisation Logo"
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <input
                        id="logo"
                        type="file"
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                        className="hidden"
                        ref={inputRef}
                      />
                      <button
                        type="button"
                        onClick={() => inputRef.current.click()}
                        className={`py-1 px-3 text-sm font-medium rounded-md ${
                          darkMode
                            ? "bg-slate-400 text-black"
                            : "bg-gray-900 text-white"
                        } hover:scale-95 transition-all duration-200`}
                      >
                        Select
                      </button>
                    </div>
                  </div>
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
            ) : (
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
                    Organisation Name
                    <sup className="text-red-900 font-bold">*</sup>
                  </label>
                  <input
                    id="organization"
                    type="text"
                    placeholder="Organisation Name..."
                    {...register("organizationName", {
                      required: "Organisation Name is required",
                      minLength: {
                        value: 3,
                        message:
                          "Organisation Name must be at least 3 characters",
                      },
                      validate: {
                        noNumbers: (value) =>
                          !/\d/.test(value) ||
                          "Organisation Name must not contain numbers",
                        minLength: (value) =>
                          value.trim().length >= 3 ||
                          "Organisation Name must not be empty or less than 3 characters",
                        },
                        noSpecialChars: (value) =>
                          /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value) ||
                          "Organisation Name must contain only letters and a single space between words",
                    })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                    }`}
                  />
                  {errors.organizationName && (
                    <p className="text-red-500 mt-1">
                      {errors.organizationName.message}
                    </p>
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
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                    }`}
                    rows={3}
                  />
                  {errors.organizationDescription && (
                    <p className="text-red-500 mt-1">
                      {errors.organizationDescription.message}
                    </p>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUpdateOrganisation;
