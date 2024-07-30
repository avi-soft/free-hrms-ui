import React from "react";

import { Outlet } from "react-router-dom";
import NavBar from "../components/common/Navbar";
import Sidebar from "../components/core/dashboard/Sidebar";
import { useSelector } from "react-redux";

function Dashboard() {
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <div className={`  ${darkMode ? " bg-slate-600" : " bg-slate-200"} `}>
      <div className=" relative">
        <NavBar backgroundColor={1} />
      </div>
      <div className="flex pt-[50px]">
        <div className="max-lg:hidden relative w-[15%]">
          <Sidebar />
        </div>
        <div className=" p-5 max-lg:pt-[80px] w-[85%] max-sm:w-[100%] pt-[40px] relative mx-auto">
          <div className={` mx-auto w-11/1 `}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
