import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../services/operations/authAPI";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    console.log("pressed");
    console.log(data.password);
    console.log(data.email);
    if (!data.password || !data.email) {
      return;
    }

    try {
      data.navigate = navigate;
      await dispatch(login(data));
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
                  Email Address<sup className="text-red-600  ml-1">*</sup>
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
                    Password<sup className="text-red-600  ml-1">*</sup>
                  </p>
                  <div className="relative">
                    <input
                      data-testid="password-input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      {...register("password", {
                        required: true,
                        validate: validatePassword,
                      })}
                      className={`rounded-[0.5rem] w-full p-[12px] pr-[36px] border-b-[1px] ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-black"
                      }`}
                      placeholder="Enter Password"
                    />
                    <span
                      className="relative -top-8 left-80 ml-[20px] inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {errors.password && (
                      <p role="alert" className="text-red-400 mt-2">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-end mt-2">
                    <Link
                      data-testid="forgot-password-link"
                      to="/forgot-password"
                    >
                      <p
                        className={`text-xs font-medium mt-1 max-w-max ml-auto italic hover:underline ${
                          darkMode ? "text-white" : "text-black"
                        }`}
                      >
                        Forgot Password?
                      </p>
                    </Link>
                  </div>
                </label>
              </div>

              <button
                data-testid="submit-button"
                type="submit"
                className={`w-full rounded-[8px] font-medium px-[12px] py-[8px] mt-3 transition-all duration-500 ${
                  darkMode
                    ? "primary-gradient text-white hover:bg-yellow-700"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFormTemplate;
