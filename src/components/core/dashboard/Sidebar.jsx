import React from "react";
import { useSelector } from "react-redux";
import MenuItems from "../../../constants/menu";
import SidebarLink from "./SidebarLink";

function Sidebar() {
  const { darkMode } = useSelector((state) => state.theme);
  const menuItems = MenuItems();
  const slicedMenuItems = menuItems.slice(1);

  return (
    <div className="relative">
      <div className="fixed left-0">
        <div
          className={`flex min-w-[250px] h-screen flex-col border-r-[3px] ${
            darkMode
              ? "border-r-gray-700 bg-slate-700"
              : "border-r-richblack-700 bg-white"
          } py-10 shadow-xl transition-all duration-300`}
        >
          <div className="flex flex-col justify-center">
            <div
              className={`text-lg w-80% text-center border-b-[2px] m-3 ${
                darkMode
                  ? "text-white border-gray-600"
                  : "text-black border-richblack-700"
              }`}
            >
              {menuItems[0]?.label}
            </div>
            {slicedMenuItems.map((link) => (
              <SidebarLink key={link.key} link={link} darkMode={darkMode} />
            ))}
          </div>
          <div
            className={`mx-auto my-6 h-[1px] w-10/12 ${
              darkMode ? "bg-gray-600" : "bg-richblack-600"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
