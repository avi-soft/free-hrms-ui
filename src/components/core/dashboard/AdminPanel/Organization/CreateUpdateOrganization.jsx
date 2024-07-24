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

  const validateOrganization = {
    required: "Organization Name is required",
    minLength: {
      value: 3,
      message: "Organization Name must be at least 3 characters",
    },
    maxLength: {
      value: 20,
      message: "Organization Name must not exceed 20 characters",
    },
    pattern: {
      value: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
      message:
        "Organization Name must contain only letters and a single space between words",
    },
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
                  {...register("organizationName", validateOrganization)}
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
                </label>
                <textarea
                  id="organizationDescription"
                  placeholder="Organisation Description..."
                  {...register("organizationDescription")}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                  }`}
                />
              </div>
              <div className="flex items-center justify-center mt-6">
                <button
                  type="submit"
                  className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-yellow-600 transition-colors"
                >
                  {isEditing ? "Update Organisation" : "Create Organisation"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div
            className={`max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 ${
              darkMode ? "bg-slate-600" : "bg-white"
            }`}
          >
            <form onSubmit={handleSubmit(handleOrganizationSubmit)}>
              <div className="mb-4">
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
                  {...register("organizationName", validateOrganization)}
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
                </label>
                <textarea
                  id="organizationDescription"
                  placeholder="Organisation Description..."
                  {...register("organizationDescription")}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                  }`}
                />
              </div>
              <div className="flex items-center justify-center mt-6">
                <button
                  type="submit"
                  className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-yellow-600 transition-colors"
                >
                  {isEditing ? "Update Organisation" : "Create Organisation"}
                </button>
              </div>
            </form>
          </div>
        )}
        {showLogoUploadDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
              className={`bg-white p-6 rounded shadow-md ${
                darkMode ? "bg-gray-800 text-white" : ""
              }`}
            >
              <h2 className="text-lg font-semibold mb-4">
                Upload Organisation Logo
              </h2>
              <div className="flex flex-col items-center">
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : existingImage || defaultImage
                  }
                  alt="Organisation Logo"
                  className="aspect-square rounded-full object-cover h-20 mb-4"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={handleFileChange}
                  className="mb-4"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleLogoUpload}
                    className={`py-2 px-4 rounded ${
                      loading ? "bg-gray-400" : "bg-yellow-500 text-black"
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                  <button
                    onClick={() => setShowLogoUploadDialog(false)}
                    className="py-2 px-4 rounded bg-gray-300 text-black"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUpdateOrganisation;
