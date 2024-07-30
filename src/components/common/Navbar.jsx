import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Moon from "../../assets/Images/Moon.svg";
import Sun from "../../assets/Images/Sun.svg";
import EmployeeInfo from "../../pages/EmployeeInfo";
import { toggleDarkMode } from "../../slices/themeSlice";
import LogBtn from "../core/Navbar/LogBtn";
import ProfileDropDown from "../core/Navbar/ProfileDropDown";
import { AiOutlineMenu } from "react-icons/ai";
import Sidebar from "../core/dashboard/Sidebar";
import useOnClickOutside from "../../Hooks/useOnClickOutside";
import { RxCross1 } from "react-icons/rx";

const NavBar = () => {
  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  const onSubmit = async (data) => {
    console.log("Searching for:", data.searchQuery);
    try {
      navigate(`/employee-info/${data.searchQuery}`);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleOpenClick = () => {
    setIsOpen(!isOpen);
  };
  useOnClickOutside(ref, () => setIsOpen(false));


  return (
    <div
      className={`fixed w-full rounded z-[9999] border-b-[1px] shadow-lg ${
        darkMode ? "bg-gray-800 border-b-gray-200" : "bg-white"
      } top-0 `}
    >
      <div className="flex h-30 items-center justify-between flex-wrap">
        <div
          className={`m-2  pl-3 ipad:hidden text-2xl ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          <AiOutlineMenu onClick={handleOpenClick} />
          {isOpen && (
            <div ref={ref} className="relative -top-10 w-[15%] z-50">
              <Sidebar setIsOpen={setIsOpen} />
              <span className="absolute left-0 " onClick={handleOpenClick}>
                <RxCross1 />
              </span>
            </div>
          )}
        </div>

        <div className="m-2 max-xs:mx-0">
          <Link to="/">
            <img src="https://avisoft.io/logo.svg" alt="Logo" />
          </Link>
        </div>
        {AccessToken && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="ml-10 flex items-center max-md:order-3 max-md:mb-3 max-md:mx-auto"
          >
            <div className="flex items-center border-[2px] rounded-md">
              <span className="text-gray-500 size-10 p-3">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search Employee.."
                className={`px-4 py-2 pl-0 rounded-lg border border-gray-300 focus:outline-none border-none  ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white"
                }`}
                {...register("searchQuery")}
              />
            </div>
            <button
              type="submit"
              className={`p-2 ml-1  rounded hover:cursor-pointer text-white ${
                darkMode ? "primary-gradient" : "bg-blue-700"
              }`}
            >
              Search
            </button>
          </form>
        )}

        <div className="flex justify-between items-center gap-2">
          <button
            onClick={handleThemeToggle}
            className="mt-1"
            data-testid="themeToggle"
          >
            {darkMode ? (
              <img
                className="active-theme"
                src={Sun}
                height={30}
                width={30}
                alt="Sun"
              />
            ) : (
              <img
                className="active-theme"
                src={Moon}
                height={30}
                width={30}
                alt="Moon"
              />
            )}
          </button>
          <div className="mr-5">
            {AccessToken && (
              <div data-testid="profile-dropdown">
                <ProfileDropDown />
              </div>
            )}
          </div>
        </div>
      </div>
      {userData && <EmployeeInfo userData={userData} />}
    </div>
  );
};

export default NavBar;
