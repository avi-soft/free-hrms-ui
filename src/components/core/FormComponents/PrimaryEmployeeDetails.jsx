import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { addEmployee } from "../../../services/operations/employeeAPI";
import { getRole } from "../../../services/operations/roleAPI";
import Spinner from "../../common/Spinner";
import { setOrganization } from "../../../slices/OrganisationSlice";
import { getOrganisation } from "../../../services/operations/OrganisationAPI";
import ConfirmationModal from "../../common/ConfirmationModal";
import {
  addEmployees,
  setCurrentOrganizationId,
  setStep,
} from "../../../slices/employeeSlice";

const PrimaryEmployeeDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { AccessToken } = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.theme?.darkMode) || false;
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { AllOrganizations } = useSelector((state) => state.Organisation);
  const [confirmationModal, setConfirmationModal] = useState(null);

  console.log(AllOrganizations);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getOrganisation(AccessToken));
      console.log(res);
      if(res?.status == true) {
        const res = await dispatch(getOrganisation(AccessToken));
        console.log(res);
        dispatch(setOrganization(res?.data?.content));
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error("Error fetching organizations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchOrganizations();
  }, [AllOrganizations]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getRole(AccessToken));
      setRoles(res?.data || []);
    } catch (error) {
      console.error("Error fetching roles", error);
    } finally {
      setLoading(false);
    }
  };



  const onSubmit = async (data) => {
    data.navigate = navigate;
    data.AccessToken = AccessToken;
    try {
      const response = await dispatch(addEmployee(data));
      console.log(response);
      if (response?.data?.success == true) {
        dispatch(addEmployees(response?.data?.newUser?.employeeId));
        dispatch(setCurrentOrganizationId(data?.organization));
        setConfirmationModal({
          text1: "Employee added successfully!",
          text2:
            "Do you want to continue with default attributes or proceed with adding new ones?",
          btn1Text: "Add New Attributes",
          btn2Text: "Skip",
          btn1Handler: async () => {
            navigate("/employee/employee-attributes");
          },
          btn2Handler: () => {
            setConfirmationModal(null), dispatch(setStep(2));
          },
        });
      }
    } catch (error) {
      console.error("Error adding employee", error);
    }
  };

  return (
    <div
      className={`flex flex-col items-center ${
        darkMode ? "text-white" : "text-black"
      }`}
    >
      {loading ? (
        <Spinner />
      ) : AllOrganizations?.length === 0 ? (
        <div className="p-5 mt-32 flex flex-col items-center justify-center">
          <div
            className={`text-xl font-semibold ${
              darkMode ? "text-orange-400" : "text-slate-600"
            }`}
          >
            No Organizations Available
          </div>
          <p
            className={`text-center mt-4 ${
              darkMode ? "text-white" : "text-gray-700"
            }`}
          >
            You need to create an organization before adding an employee.
          </p>
          <div className="flex justify-center">
            <Link
              to={`/organization/organization-create-update`}
              className={`text-sm md:text-base underline font-medium rounded-md py-2 px-5 ${
                darkMode ? "text-blue-400" : "text-blue-700"
              }`}
            >
              Create Organization
            </Link>
          </div>
        </div>
      ) : (
        <form
          data-testid="create-employee-form"
          className={`p-5 w-[60%] mt-5 ${
            darkMode ? "bg-slate-600" : "bg-slate-200"
          } shadow-lg rounded`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mt-4">
            <label
              htmlFor="organization"
              className={`block text-sm font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Select Organization<sup className="text-red-900">*</sup>
            </label>
            <select
              id="organization"
              {...register("organization", {
                required: "Organization is required",
              })}
              className={`border ${
                darkMode ? "bg-gray-500 text-white" : ""
              } rounded px-3 py-2 mt-2 w-full`}
              data-testid="organization-select"
            >
              <option value="">Select Organization</option>
              {AllOrganizations?.map((org) => (
                <option key={org?.organizationId} value={org?.organizationId}>
                  {org?.organizationName}
                </option>
              ))}
            </select>
            {errors.organization && (
              <p className="text-red-500 mt-1">{errors.organization.message}</p>
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="email"
              className={`block text-sm font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Email Address<sup className="text-red-900">*</sup>
            </label>
            <input
              id="email"
              required
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
                validate: (value) => {
                  const domain = value.split("@")[1];
                  if (/\d/.test(domain)) {
                    return "Domain must not contain any numbers";
                  }
                  return true;
                },
              })}
              className={`border ${
                darkMode ? "bg-gray-500 text-white" : ""
              } rounded px-3 py-2 mt-2 w-full`}
              placeholder="Enter Your Email Address"
              data-testid="email-input"
            />
            {errors.email && (
              <p className="text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="password"
              className={`block text-sm font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Password<sup className="text-red-900">*</sup>
            </label>
            <input
              id="password"
              required
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message:
                    "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
                },
              })}
              type="password"
              className={`border ${
                darkMode ? "bg-gray-500 text-white" : ""
              } rounded px-3 py-2 mt-2 w-full`}
              placeholder="Enter Your Password"
              data-testid="password-input"
            />
            {errors.password && (
              <p className="text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="role"
              className={`block text-sm font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Role<sup className="text-red-900">*</sup>
            </label>
            <select
              id="role"
              {...register("role", { required: "Role is required" })}
              className={`border ${
                darkMode ? "bg-gray-500 text-white" : ""
              } rounded px-3 py-2 mt-2 w-full max-h-40 overflow-y-auto`}
              data-testid="role-select"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.roleId} value={role.role}>
                  {role.role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          <div className="flex items-center gap-x-3 mt-5">
            <button
              type="submit"
              data-testid="submit-button"
              className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                darkMode
                  ? "bg-yellow-500 text-black"
                  : "bg-yellow-500 text-black"
              } py-1 px-5 flex items-center`}
            >
              <FaPlus className="mr-2" /> Add
            </button>
          </div>
        </form>
      )}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default PrimaryEmployeeDetails;
