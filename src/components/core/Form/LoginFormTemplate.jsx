import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../services/operations/authAPI";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ConfirmationModal from "../../common/ConfirmationModal";
import {
  setShowOption,
  toggleShowOption,
} from "../../../slices/OrganisationSlice";

const LoginFormTemplate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useSelector((state) => state.theme);
  const { showOption } = useSelector((state) => state.Organisation);
  const user = useSelector((state) => state.profile.user);

  console.log(showOption);

  const [showPassword, setShowPassword] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  console.log(confirmationModal);

  const onSubmit = async (data) => {
    if (!data.password || !data.email) {
      return;
    }

    try {
      data.navigate = navigate;
      const response = await dispatch(login(data));
      if (response?.status == 200) {
        console.log("999");
        console.log(response?.data?.loginUser?.roles[0]?.role);
        if (response?.data?.loginUser?.roles[0]?.role == "Manager") {
          console.log("hi");
          if (showOption == "true") {
            console.log("true");
          } else {
            console.log("false");

            dispatch(setShowOption(false));
          }

          console.log("hi2");
          if (showOption == "false") {
            console.log("12");
            console.log("13");
            setConfirmationModal({
              text1: "Do you want to create a new Organization?",
              text2:
                "This action will redirect you to the organization creation page.",
              btn1Text: "Yes",
              btn2Text: "Skip",
              btn1Handler: () => {
                navigate("/organization/organization-create-update");
                // Set showOption to true after the action
                setConfirmationModal(null);
              },
              btn2Handler: () => {
                navigate("/"); // Ensure showOption is true to prevent future prompts
                setConfirmationModal(null);
                dispatch(setShowOption(true));
              },
            });
          } else {
            console.log("else");
            navigate("/");
          }
        }
      }
    } catch (error) {
      setError("password", {
        type: "server",
        message: "Failed to login. Please check your credentials.",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-]+\.)*[a-zA-Z]{2,})$/;

  const validatePassword = (value) => {
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/\d/.test(value)) {
      return "Password must contain at least one digit.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>).';
    }
    if (value.length < 8 || value.length > 20) {
      return "Password must be between 8 and 20 characters.";
    }
    return true;
  };

  return (
    <div
      className={`w-full h-screen rounded-md flex flex-col justify-center items-center  ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-center">
        <img
          height={100}
          width={100}
          src="https://avisoft.io/banner-images/about-new.svg"
          alt="Logo"
        />
      </div>
      <div className="m-2">
        <h1 className="font-bold" data-testid="main-heading">
          Sign-In Portal
        </h1>
      </div>
      <div className="w-full flex justify-center items-center">
        <div
          className={`w-full rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
          } sm:max-w-md xl:p-0`}
        >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
              className="text-xl font-bold leading-tight tracking-tight md:text-2xl"
              data-testid="login-heading"
            >
              Sign in to your account
            </h1>
            <form role="form" onSubmit={handleSubmit(onSubmit)} action="#">
              <div className="mt-3 mb-3"></div>
              <label data-testid="email-label" className="w-full">
                <p className="text-[0.875rem] mb-1 leading-[1.375rem]">
                  Email Address<sup className="text-red-600 ml-1">*</sup>
                </p>
                <input
                  name="Email"
                  id="Email"
                  {...register("email", {
                    required: true,
                    pattern: emailPattern,
                  })}
                  className={`rounded-[0.5rem] w-full p-[12px] border-b-[1px] ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-black"
                  }`}
                  data-testid="email-input"
                  placeholder="Enter Email Address"
                />
              </label>
              {errors.email && errors.email.type === "pattern" && (
                <p className="text-red-400 mt-2" role="alert">
                  Please enter a valid email address.
                </p>
              )}
              <div className="mt-5">
                <label data-testid="password-label" className="w-full">
                  <p className="text-[0.875rem] mb-1 leading-[1.375rem]">
                    Password<sup className="text-red-600 ml-1">*</sup>
                  </p>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="Password"
                      required
                      name="Password"
                      {...register("password", {
                      })}
                      className={`rounded-[0.5rem] w-full p-[12px] border-b-[1px] ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-black"
                      }`}
                      placeholder="Enter Password"
                      data-testid="password-input"
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      role="button"
                      data-testid="toggle-password-visibility"
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </label>
                {errors.password && errors.password.type === "validate" && (
                  <p className="text-red-400 mt-2" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex justify-between my-4">
                <Link
                  to="/reset-password"
                  className="text-sm font-medium text-blue-500 hover:underline"
                  data-testid="forgot-password-link"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
                data-testid="login-button"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default LoginFormTemplate;
