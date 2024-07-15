import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../services/operations/authAPI";

const LoginFormTemplate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useSelector((state) => state.theme);

  const onSubmit = async (data) => {
    if (!data.password) {
      return;
    }
    data.navigate = navigate;
    dispatch(login(data));
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
            <form
              data-testid="login-form"
              onSubmit={handleSubmit(onSubmit)}
              action="#"
            >
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
                    pattern:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
              {errors.email && (
                <p className="text-red-400 mt-2">Please enter a valid email.</p>
              )}
              <div className="mt-5">
                <label data-testid="password-label" className="w-full">
                  <p className="text-[0.875rem] mb-1 leading-[1.375rem]">
                    Password<sup className="text-red-600  ml-1">*</sup>
                  </p>
                  <div className="relative">
                    <input
                      data-testid="password-input"
                      type="password"
                      name="password"
                      id="password"
                      {...register("password", {
                        required: true,
                        minLength: 5,
                        maxLength: 20,
                      })}
                      className={`rounded-[0.5rem] w-full p-[12px] pr-[36px] border-b-[1px] ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-black"
                      }`}
                      placeholder="Enter Password"
                    />
                    {errors.password && (
                      <p className="text-red-400 mt-2">
                        Password must contain at least one uppercase letter, one
                        lowercase letter, one number, and one special character.
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
