import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrganisation,
  getOrganisationAttributes,
  RemoveOrganisationLogo,
  updateOrganisation,
} from "../../../../../services/operations/OrganisationAPI";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import defaultImage from "../../../../../assets/Images/placeholder.jpg";
import toast from "react-hot-toast";
import { setShowOption } from "../../../../../slices/OrganisationSlice";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { FaTimesCircle } from "react-icons/fa";
import { setStep } from "../../../../../slices/employeeSlice";
import OrganizationAttributes from "./OrganizationAttribute";

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [fileError, setFileError] = useState(""); // State for file validation errors

  const { isEditing, organization } = location.state || {
    isEditing: false,
    organization: null,
  };
  const [organisationId, setOrganisationId] = useState(null);
  const [showLogoUploadDialog, setShowLogoUploadDialog] = useState(false);
  const [isAttribute, setIsAttribute] = useState(false);
  const [organizationAttributes, setOrganizationAttributes] = useState(null);
  const [renderFlag,setRenderFlag]=useState(false)

  useEffect(() => {
    console.log("executed"); 
getRes()
  }, [dispatch, AccessToken,navigate]);

  useEffect(() => {
    dispatch(setStep(1));
  }, [dispatch]);

  useEffect(() => {
    if (isEditing && organization) {
      setValue("organizationName", organization.organizationName);
      setValue("organizationDescription", organization.organizationDescription);
      setExistingImage(organization.organizationImage); // Set existing image
      setOrganisationId(organization.organizationId);

      // Set the values for organization attributes
      if (organizationAttributes && organization.attributes) {
        organizationAttributes.forEach((attribute) => {
          const attributeValue =
            organization.attributes[attribute.attributeKey];
          if (attributeValue) {
            setValue(attribute.attributeKey, attributeValue);
          }
        });
      }
    } else {
      console.log("inside else");
      
      reset();
      setSelectedImage(null);
      setExistingImage(null);
      setFileError("") 
    }
  }, [isEditing, organization, organizationAttributes,renderFlag]);

  console.log(renderFlag);
  

  async function getRes() {
    console.log("called");
    
    const res = await dispatch(getOrganisationAttributes(AccessToken));
    console.log(res);
    setOrganizationAttributes(res?.data);
    setRenderFlag(!renderFlag)
    return res?.data
  }


  const handleOrganizationSubmit = async (data) => {
    // Check for file errors before proceeding
    if (fileError) {
      toast.error(fileError);
      return;
    }

    const formData = new FormData();

    // Create an object with all the organization data (excluding the logo)
    const organizationData = {
      organizationName: data.organizationName.trim(),
      organizationDescription: data.organizationDescription.trim(),
      attributes: organizationAttributes.reduce((acc, obj) => {
        acc[obj.attributeKey] = data[obj.attributeKey];
        return acc;
      }, {}),
    };

    // Append the organization data to the FormData object
    formData.append("organizationData", JSON.stringify(organizationData));

    // Append the logo image if one is selected
    if (selectedImage) {
      formData.append("file", selectedImage);
    }

    try {
      let response;
      if (isEditing) {
        response = await dispatch(
          updateOrganisation(
            AccessToken,
            formData,
            navigate,
            organization.organizationId
          )
        );
      } else {
        response = await dispatch(addOrganisation(AccessToken, formData));
      }

      if (response?.status !== 201) throw new Error(response?.data?.message);
      else {
        toast.success(response?.data?.message);
        setOrganisationId(response?.data?.data?.organizationId);
        if (!isEditing && showOption === "false") {
          dispatch(setShowOption(true));
        }
        navigate("/organization/organization-list");
      }
    } catch (error) {
      console.error("Error submitting organisation details:", error);
    }
  };

  const handleFileChange = (e) => {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
  
    // Validate file type and size
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setFileError("Only JPEG and PNG images are allowed.");
      setSelectedImage(file);  // Ensure this is null if invalid
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setFileError("File size must not exceed 5MB.");
      setSelectedImage(file);  // Ensure this is null if invalid
      return;
    }
  
    setFileError(""); // Clear error if file is valid
    setSelectedImage(file); // Update local state for selected image
  };
  

  const handleRemoveImage = async () => {
    if (isEditing && existingImage) {
      try {
        // Logic for removing image from server, if necessary
        setExistingImage(null);
        setSelectedImage(null);
        setFileError("");
      } catch (error) {
        console.error("Error removing image:", error);
      }
    } else {
      // Clear selected image in creation mode
      setSelectedImage(null);
      setFileError("");
    }
    
    // Reset the file input so the same file can be selected again
    inputRef.current.value = null;
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
          {isEditing ? "Edit Organization" : "Create Organization"}
        </div>
        <div>
          <p
            className={`text-slate-950 md:text-xl left-6 font-semibold ${
              darkMode ? "text-white" : ""
            }`}
          >
            Home / Dashboard /{" "}
            <span className="text-yellow-700">
              {isEditing ? "Edit Organization" : "Create Organization"}
            </span>
          </p>
        </div>
      </div>
      <div className={`container mx-auto mt-8`}>
      <button
    onClick={() => setIsAttribute(true)}  // Change the state to show the SubOrganizationAttribute
    className={`w-[220px] py-2 text-md font-medium rounded-md mb-4
      ${darkMode ? "primary-gradient text-white" : "bg-blue-700 text-white"} 
      hover:scale-95 transition-all duration-200 ${fileError ? "cursor-not-allowed" : ""}`}
  >
    Add Attributes
  </button>


   { isAttribute ? (
  <OrganizationAttributes
    NextHandler={() => {
      setIsAttribute(false);
      getRes();
    }}
  />
)  :
        <div className={`max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 ${darkMode ? "bg-slate-600" : "bg-white"}`}>
          <form role="form" onSubmit={handleSubmit(handleOrganizationSubmit)}>
            {/* Logo Section */}
            <div className="mb-4">
              <div className="flex items-center">
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : existingImage || defaultImage
                  }
                  alt="Organization Logo"
                  className="aspect-square rounded-full object-cover h-20"
                />
                <div className="w-[80%] flex gap-4 ml-5 flex-col">
                  <p
                    className={`font-normal text-lg ${
                      darkMode ? "text-white" : "text-zinc-800"
                    }`}
                  >
                    {isEditing
                      ? "Edit Organization Logo"
                      : "Add Organization Logo"}
                  </p>
                  <div className="flex items-center gap-4">
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
                          ? "bg-slate-400 text-black"
                          : "bg-gray-900 text-white"
                      } py-1 px-5`}
                      disabled={loading}
                    >
                      Select
                    </button>
                    {selectedImage || existingImage ? (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                          darkMode
                            ? "bg-red-600 text-white"
                            : "bg-red-500 text-white"
                        } py-1 px-5`}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  {fileError && (
                    <p className="text-red-500 mt-1">{fileError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Organization Name */}
            <div className="mb-4">
              <label
                htmlFor="organizationName"
                className={`block text-gray-700 text-sm font-bold mb-2 ${
                  darkMode ? "text-white" : ""
                }`}
              >
                Organization Name
                  
              </label>
              <input
                id="organizationName"
                type="text"
                placeholder="Organization Name..."
                {...register("organizationName", {
                  required: "Organization Name is required",
                  minLength: {
                    value: 3,
                    message: "Organization Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 50,
                    message:
                      "Organization Name should not exceed 50 characters",
                  },
                  validate: {
                    noNumbers: (value) =>
                      !/\d/.test(value) ||
                      "Organization Name must not contain numbers",
                    noSpecialChars: (value) =>
                      /^[a-zA-Z\s]+$/.test(value) ||
                      "Organization Name must not contain special characters",
                    noEmptyAfterTrim: (value) => {
                      const trimmedValue = value.trim();
                      return (
                        trimmedValue !== "" ||
                        "Organization Name can't be empty or just spaces."
                      );
                    },
                    noExtraSpaces: (value) => {
                      const trimmedValue = value.trim();
                      return (
                        !/\s{2,}/.test(trimmedValue) ||
                        "Organization Name must not contain consecutive spaces"
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

            {/* Organization Description */}
            <div className="mb-4">
              <label
                htmlFor="organizationDescription"
                className={`block text-gray-700 text-sm font-bold mb-2 ${
                  darkMode ? "text-white" : ""
                }`}
              >
                Organization Description
                <sup className="text-red-900 font-bold">*</sup>
              </label>
              <textarea
                id="organizationDescription"
                placeholder="Organization Description..."
                {...register("organizationDescription", {
                  required: "Description is required",
                  minLength: {
                    value: 5,
                    message: "Description must be at least 5 characters",
                  },
                  maxLength: {
                    value: 200,
                    message: "Description should not exceed 200 characters.",
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

            {/* Dynamic Organization Attributes */}
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
                  </label>
                  <input
                    id={attribute.attributeKey}
                    type="text"
                    data-testid={attribute.attributeKey}
                    placeholder={`${attribute.attributeKey}...`}
                    {...register(attribute.attributeKey)}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  />
                  {errors[attribute.attributeKey] && (
                    <p className="text-red-500 mt-1">
                      {errors[attribute.attributeKey].message}
                    </p>
                  )}
                </div>
              ))}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2 text-sm font-medium rounded-md mb-4 ${
                darkMode
                  ? "primary-gradient text-white"
                  : "bg-blue-700 text-white"
              } hover:scale-95 transition-all duration-200 ${
                fileError ? "cursor-not-allowed" : ""
              }`}
              disabled={fileError}
            >
              {isEditing ? "Update Organization" : "Submit Organization"}
            </button>
          </form>
        </div>
}
      </div>


    </div>
  );
};

export default CreateUpdateOrganisation;
