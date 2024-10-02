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
import { setStep } from "../../../../../slices/employeeSlice";

const CreateUpdateSubOrganization = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.profile);
  const { AccessToken } = useSelector((state) => state.auth);
  const [branchAttribute, setBranchAttributes] = useState([]);
  const [isAttribute, setIsAttribute] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const { AllOrganizations } = useSelector((state) => state.Organisation);
  const { loading } = useSelector((state) => state.subOrganization);
  const hasCreateBranchAttributePrivilege =
    user?.roles?.[0]?.privilege?.includes("ADD_BRANCH_ATTRIBUTE");
  const hasGetBranchAttributePrivilege = user?.roles?.[0]?.privilege?.includes(
    "GET_BRANCH_ATTRIBUTE"
  );
  const hasGetAllOrganizationsPrivilege = user?.roles?.[0]?.privilege?.includes(
    "GET_ALL_ORGANIZATIONS"
  );

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
  console.log(AllOrganizations);
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
    const EditedFormData = {
      branchName: trimmedSubOrganizationName,
      AccessToken,
      attributes: attributesObj,
    };

    try {
      if (isEditing) {
        await dispatch(
          updateSubOrganisation(
            AccessToken,
            EditedFormData,
            subOrganization.branchId
          )
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
    if (hasGetBranchAttributePrivilege) {
      const res = await dispatch(getSubOrganisationAttributes(AccessToken));
      setBranchAttributes(res?.data.branchAttributes);
      return res?.data.branchAttributes;
    }
  }

  const fetchOrganizationList = async () => {
    try {
      if (hasGetAllOrganizationsPrivilege) {
        dispatch(setLoading(true));
        const res = await dispatch(getOrganisation(AccessToken));
        dispatch(setOrganization(res?.data?.content));
        dispatch(setLoading(false));
      }
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
    dispatch(setStep(1));
  }, [dispatch]);

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
        <button
          disabled={!hasCreateBranchAttributePrivilege}
          onClick={() => setIsAttribute(true)} // Change the state to show the SubOrganizationAttribute
          className={`w-[220px] py-2 ml-2 text-md font-medium rounded-md mb-4
      ${darkMode ? "primary-gradient text-white" : "bg-blue-700 text-white"} 
      hover:scale-95 transition-all duration-200   ${
        !hasCreateBranchAttributePrivilege
          ? "opacity-50 cursor-not-allowed"
          : ""
      } `}
        >
          Manage Attributes
        </button>
        {isAttribute ? (
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
                </label>
                <select
                  disabled={
                    AllOrganizations?.length == 0 ||
                    AllOrganizations == undefined
                  }
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
                  }
                  ${
                    AllOrganizations?.length == 0 ||
                    AllOrganizations == undefined
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                  `}
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
            <div className="flex justify-between gap-3">
              <button
                type="submit"
                className={`flex-1 text-center text-sm md:text-base font-medium rounded-md px-2 py-2 mb-4 ${
                  loading ? "bg-slate-900" : "bg-blue-700"
                } ${
                  darkMode ? "text-white" : "text-white"
                } hover:scale-95 transition-all duration-200`}
              >
                {isEditing
                  ? "Update Sub Organization"
                  : "Create Sub Organization"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/suborganization/suborganization-list")
                }
                className="flex-1 text-center text-sm md:text-base font-medium rounded-md py-2 mb-4 bg-gray-400 text-white hover:bg-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* {confirmationModal && !isEditing && (
        <ConfirmationModal modalData={confirmationModal} />
      )} */}
    </div>
  );
};

export default CreateUpdateSubOrganization;
