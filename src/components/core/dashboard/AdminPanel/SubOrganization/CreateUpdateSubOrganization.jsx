import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSubOrganisation,
  getSubOrganisationAttributes,
  updateSubOrganisation,
} from "../../../../../services/operations/subOrganisationAPI";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import SubOrganizationAttribute from "./SubOrganizationAttribute";
import { getOrganisation } from "../../../../../services/operations/OrganisationAPI";
import { setOrganization } from "../../../../../slices/OrganisationSlice";
import { setLoading } from "../../../../../slices/departmentSlice";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateUpdateSubOrganization = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const { AccessToken } = useSelector((state) => state.auth);
  const [branchAttribute, setBranchAttributes] = useState([]);
  const [isAttribute, setIsAttribute] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const { AllOrganizations } = useSelector((state) => state.Organisation);
  const { loading } = useSelector((state) => state.subOrganization);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const { isEditing, subOrganization, organizationId } = location.state || {
    isEditing: false,
    department: null,
  };
  const getLocalSubOrganizationAttributesValue = async () => {
    const attributes = await getSubOrganizationAttributes();
    const attributesObj =
      attributes &&
      attributes.reduce((acc, obj) => {
        acc[obj.attributeKey] = subOrganization.attributes[obj.attributeKey];
        return acc;
      }, {});
    return attributesObj;
  };
  console.log(subOrganization);
  useEffect(() => {
    if (isEditing && subOrganization) {
      setValue("branchName", subOrganization.branchName);
      getLocalSubOrganizationAttributesValue().then((data) => {
        console.log(data);
        reset({ ...data });
      });
      setSelectedOrganization(organizationId);
    }
  }, [isEditing, subOrganization, setValue, reset]);

  const onSubmit = async (data) => {
    const trimmedSubOrganizationName = data.branchName?.trim() || "";

    const attributesObj =
      branchAttribute &&
      branchAttribute.reduce((acc, obj) => {
        acc[obj.attributeKey] = data[obj.attributeKey];
        return acc;
      }, {});
    const formData = {
      branchName: trimmedSubOrganizationName,
      organizationId: selectedOrganization,
      AccessToken,
      attributes: attributesObj,
    };

    try {
      if (isEditing) {
        await dispatch(
          updateSubOrganisation(AccessToken, formData, subOrganization.branchId)
        );
        navigate("/suborganization/subOrganization-list", {
          state: {
            updatedSuborganization: true,
            organizationId: selectedOrganization,
          },
        });
      } else {
        await dispatch(addSubOrganisation(AccessToken, formData));
        navigate("/suborganization/subOrganization-list", {
          state: {
            updatedSuborganization: false,
            organizationId: selectedOrganization,
          },
        });
      }
    } catch (error) {
      console.error("Error during department submission:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const validateSubOrganization = {
    required: "SubOrganization Name is required",
    minLength: {
      value: 3,
      message: "SubOrganization Name must be at least 3 characters",
    },
    validate: {
      minLength: (value) =>
        value.trim().length >= 3 ||
        "SubOrganization Name must not be empty or less than 3 characters",
      noNumbers: (value) =>
        !/\d/.test(value) || "SubOrganization Name must not contain numbers",

      noSpecialChars: (value) =>
        /^[a-zA-Z0-9 ]*$/.test(value) ||
        "SubOrganization Name must not contain special characters",
      noExtraSpaces: (value) => {
        const trimmedValue = value.trim();
        return (
          !/\s{2,}/.test(trimmedValue) ||
          "SubOrganization Name must not contain consecutive spaces"
        );
      },
    },
  };

  async function getSubOrganizationAttributes() {
    const res = await dispatch(getSubOrganisationAttributes(AccessToken));
    setBranchAttributes(res?.data.branchAttributes);
    return res?.data.branchAttributes;
  }

  const fetchOrganizationList = async () => {
    try {
      dispatch(setLoading(true));
      const res = await dispatch(getOrganisation(AccessToken));
      dispatch(setOrganization(res?.data));
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching organizations", error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getSubOrganizationAttributes();
    fetchOrganizationList();
  }, [dispatch, AccessToken]);

  useEffect(() => {
    setConfirmationModal({
      text1: "Do you want to add new attributes?",
      text2: "This action will redirect you to the Attributes creation page.",
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
  }, []);

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
          {isEditing ? "Edit Sub Organization" : "Create Sub Organization"}
        </div>
        <div>
          <p
            className={`text-slate-950 md:text-xl left-6 font-semibold ${
              darkMode ? "text-white" : ""
            }`}
          >
            Home / Dashboard /{" "}
            <span className="text-yellow-700">
              {isEditing ? "Edit Sub Organization" : "Create Sub Organization"}
            </span>
          </p>
        </div>
      </div>
      <div className={`container mx-auto mt-8`}>
        {AllOrganizations && AllOrganizations.length === 0 ? (
          <div className="p-5 mt-32 flex flex-col items-center justify-center">
            <div
              className={`text-xl font-semibold ${
                darkMode ? " text-orange-400" : "text-slate-600"
              }`}
            >
              No Organizations Available
            </div>
            <p
              className={`text-center mt-4 ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            >
              You need to create an organization before adding a department.
            </p>
            <div className="flex justify-center">
              <Link
                to={`/organization/organization-create-update`}
                className={`  text-sm md:text-base underline font-medium  
                rounded-md py-2 px-5 ${
                  darkMode ? " text-blue-400" : "text-blue-700"
                }`}
              >
                Create Organization
              </Link>
            </div>
          </div>
        ) : isAttribute ? (
          <SubOrganizationAttribute
            NextHandler={() => {
              setIsAttribute(false);
              getSubOrganizationAttributes();
            }}
          />
        ) : (
          <form
            role="form"
            onSubmit={handleSubmit(onSubmit)}
            className={`max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 ${
              darkMode ? "bg-slate-600" : "bg-white"
            }`}
          >
            {!isEditing && (
              <div className="mb-4">
                <label
                  htmlFor="organization"
                  className={`block text-sm font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  Select Organization
                  <sup className="text-red-900 font-bold">*</sup>
                </label>
                <select
                  id="organization"
                  {...register("organization")}
                  value={selectedOrganization}
                  onChange={(e) => {
                    setSelectedOrganization(e.target.value);
                  }}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <option value="">Select Organization</option>
                  {AllOrganizations &&
                    AllOrganizations.map((org) => (
                      <option
                        key={org?.organizationId}
                        value={org?.organizationId}
                      >
                        {org?.organizationName}
                      </option>
                    ))}
                </select>
                {errors.organization && (
                  <p className="text-red-500 mt-1">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="SubOrganization"
                className={`block text-sm font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
              >
                SubOrganization Name
                <sup className="text-red-900 font-bold">*</sup>
              </label>
              <input
                id="SubOrganization"
                type="text"
                data-testid="SubOrganization Name"
                placeholder="SubOrganization Name..."
                {...register("branchName", validateSubOrganization)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              />
              {errors.branchName && (
                <p className="text-red-500 mt-1">{errors.branchName.message}</p>
              )}
            </div>

            {branchAttribute &&
              branchAttribute.map((attribute) => (
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
                    <p className="text-red-500 mt-1">
                      {errors[attribute.attributeKey].message}
                    </p>
                  )}
                </div>
              ))}
            <button
              type="submit"
              className={`text-center w-full text-sm md:text-base font-medium rounded-md py-2 px-5 ${
                loading ? "bg-slate-900" : "bg-blue-700"
              } ${
                darkMode ? "text-white" : "text-white"
              } hover:scale-95 transition-all duration-200`}
            >
              {isEditing
                ? "Update Sub Organization"
                : "Create Sub Organization"}
            </button>
          </form>
        )}
      </div>

      {confirmationModal && !isEditing && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
  );
};

export default CreateUpdateSubOrganization;
