import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrganisation,
  getOrganisationAttributes,
  updateOrganisation,
  uploadOrganisationLogo,
} from "../../../../../services/operations/OrganisationAPI";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import defaultImage from "../../../../../assets/Images/placeholder.jpg";
import toast from "react-hot-toast";
import {

  setShowOption,
} from "../../../../../slices/OrganisationSlice";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import OrganizationAttributes from "./OrganizationAttribute";
import { DepartmentAttributeslist } from "../../../../../services/operations/departmentAPI";

const CreateUpdateOrganisation = () => {
  const { AccessToken } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { showOption } = useSelector((state) => state.Organisation);
  const { darkMode } = useSelector((state) => state.theme);
  const [selectedImage, setSelectedImage] = useState(null); // Local state for selected image
  const [existingImage, setExistingImage] = useState(null); // Local state for existing image
  const [confirmationModal, setConfirmationModal] = useState(null);

  const { isEditing, organization } = location.state || {
    isEditing: false,
    organization: null,
  };
  const [organisationId, setOrganisationId] = useState(null);
  const [showLogoUploadDialog, setShowLogoUploadDialog] = useState(false);
  const [isAttribute, setIsAttribute] = useState(false);
  const [organizationAttributes, setOrganizationAttributes] = useState(null);

  console.log(organizationAttributes);
  

  useEffect(() => {
    if (isEditing && organization) {
      setValue("organizationName", organization.organizationName);
      setValue("organizationDescription", organization.organizationDescription);
      setExistingImage(organization.organizationImage); // Update local state for existing image
      setOrganisationId(organization.organizationId);
    } else {
      reset(); // Reset form values if not in editing mode
      setSelectedImage(null); // Reset selected image
      setExistingImage(null); // Reset existing image
    }
  }, [isEditing]);

  console.log(isEditing)
  console.log(organization)
  async function getRes() {
    const res = await dispatch(getOrganisationAttributes(AccessToken));
    console.log(res);
    
    setOrganizationAttributes(res?.data);
  }
  useEffect(()=>{
    getRes()
    setConfirmationModal({
      text1: "Do you want to add new attributes?",
      text2:
        "This action will redirect you to the Attributes creation page.",
      btn1Text: "Yes",
      btn2Text: "Skip",
      btn1Handler: () => {
        setIsAttribute(true);
        // Set showOption to true after the action
        setConfirmationModal(null);
      },
      btn2Handler: () => {
        setIsAttribute(false); // Ensure showOption is true to prevent future prompts
        setConfirmationModal(null);
      },
    });
  },[])

  const handleOrganizationSubmit = async (data) => {
    const attributesObj = organizationAttributes && organizationAttributes.reduce((acc, obj) => {
      acc[obj.attributeKey] = data[obj.attributeKey];
      return acc;
    }, {});
    data.organizationName = data.organizationName.trim();
    data.organizationDescription = data.organizationDescription.trim();
    data.attributes=attributesObj
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
      if (response?.status != 201) throw new Error(response?.data?.message);
      else {
        toast.success(response?.data?.message);
        setOrganisationId(response?.data?.data?.organizationId);
        setShowLogoUploadDialog(true);
      }
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
      if (response?.status !== 200) throw new Error(response?.data?.message);
      toast.success(response?.data?.message);
      if (!isEditing && showOption === "false") {
        dispatch(setShowOption(true));
      }
      if (isEditing) {
        return null;
      } else {
        navigate("/organization/organization-list");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipp = () => {
    navigate("/organization/organization-list");
  };

  const handleFileChange = (e) => {
    if (!e.target.files[0]) return;
    setSelectedImage(e.target.files[0]); // Update local state for selected image
  };

  return (
    <div
      className={`pb-9 h-auto mb-10 mt-5 bg-slate-100 rounded ${
        darkMode ? "bg-slate-700 text-white" : ""
      }`}
    >
      <div className="p-5 flex items-center justify-between">
        <div
          className={`md:text-xl text-slate-600 font-semibold ${
            darkMode ? "text-white" : ""
          }`}
        >
          {isEditing ? "Edit Organisation" : "Create Organisation"}
        </div>
        <div>
          <p
            className={`text-slate-950 md:text-xl left-6 font-semibold ${
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
            <form role="form" onSubmit={handleSubmit(handleOrganizationSubmit)}>
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
                      Edit Organization Logo
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
                          onClick={handleLogoUpload}
                          style={{
                            cursor: loading ? "not-allowed" : "pointer",
                          }}
                        >
                          <button
                            type="button"
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

                      noSpecialChars: (value) =>
                        /^[a-zA-Z0-9 ]*$/.test(value) ||
                        "Organisation Name must not contain special characters",
                      noExtraSpaces: (value) => {
                        const trimmedValue = value.trim();
                        return (
                          !/\s{2,}/.test(trimmedValue) ||
                          "Organisation Name must not contain consecutive spaces"
                        );
                      },
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
              {organizationAttributes &&
              organizationAttributes.map((attribute) => (
                <div className="mb-4" key={attribute.attributeId}>
                  <label
                    htmlFor={attribute?.attributeKey}
                    className={`block text-sm font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {attribute?.attributeKey}
                    <sup className="text-red-900 font-bold">*</sup>
                  </label>
                  <input
                    id={attribute?.attributeKey}
                    type="text"
                    data-testid={attribute?.attributeKey}
                    placeholder={`${attribute?.attributeKey}...`}
                    {...register(attribute?.attributeKey, {
                      required: `${attribute?.attributeKey} is required`,
                    })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  />
                  {errors[attribute?.attributeKey] && (
                <p className="text-red-500 mt-1">{errors[attribute.attributeKey].message}</p>
              )}
                </div>
              ))}
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
                    className={`block  text-lg  font-bold mb-2 ${
                      darkMode ? " text-blue-300" : "text-blue-300"
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
                        onChange={handleFileChange}
                        className="hidden"
                        ref={inputRef}
                      />
                      <button
                        type="button"
                        onClick={() => inputRef.current.click()}
                        className={`py-1 px-3 ml-2 text-sm font-medium rounded-md ${
                          darkMode
                            ? "bg-slate-400 text-black"
                            : "bg-gray-600 text-white"
                        } hover:scale-95 transition-all duration-200`}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleLogoUpload}
                    className={`w-1/2 py-2 text-sm font-medium rounded-md ${
                      darkMode
                        ? "primary-gradient text-white"
                        : " bg-yellow-500 text-white"
                    } hover:scale-95 transition-all duration-200`}
                  >
                    Upload Logo
                  </button>
                  <button
                    onClick={handleSkipp}
                    className={`w-1/2 ml-7 py-2 text-sm font-medium rounded-md ${
                      darkMode
                        ? "bg-slate-400 text-black"
                        : "bg-gray-400 text-white"
                    } hover:scale-95 transition-all duration-200`}
                  >
                    Skip
                  </button>
                </div>
              </div>
            ) : isAttribute && !isEditing ? (
              <OrganizationAttributes
                NextHandler={() => {
                  setIsAttribute(false);
                  getRes();
                }}
              />
            ): (
              <form
                role="form"
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

                        noSpecialChars: (value) =>
                          /^[a-zA-Z0-9 ]*$/.test(value) ||
                          "Organisation Name must not contain special characters",
                        noExtraSpaces: (value) => {
                          const trimmedValue = value.trim();
                          return (
                            !/\s{2,}/.test(trimmedValue) ||
                            "Organisation Name must not contain consecutive spaces"
                          );
                        },
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
                {organizationAttributes &&
              organizationAttributes.map((attribute) => (
                <div className="mb-4" key={attribute.attributeId}>
                  <label
                    htmlFor={attribute.attributeKey}
                    className={`block text-sm font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {attribute.attributeKey}
                    <sup className="text-red-900 font-bold">*</sup>
                  </label>
                  <input
                    id={attribute.attributeKey}
                    type="text"
                    data-testid={attribute.attributeKey}
                    placeholder={`${attribute.attributeKey}...`}
                    {...register(attribute.attributeKey, {
                      required: `${attribute.attributeKey} is required`,
                    })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  />
                  {errors[attribute.attributeKey] && (
                <p className="text-red-500 mt-1">{errors[attribute.attributeKey].message}</p>
              )}
                </div>
              ))}
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
      {(confirmationModal && !isEditing) && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CreateUpdateOrganisation;
