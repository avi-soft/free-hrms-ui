import React, { useState } from "react";
import * as Icons from "react-icons/vsc";
import { useSelector } from "react-redux";
import { matchPath, NavLink, useLocation } from "react-router-dom";

export default function SidebarLink({ link ,setIsOpen}) {
  const Icon = Icons[link.icon];
  const location = useLocation();
  const darkMode = useSelector((state) => state.theme?.darkMode) || false;
  const [showChildren, setShowChildren] = useState(false);

  const toggleChildren = () => {
    setShowChildren(!showChildren);
  };

  const matchRoute = (route) => {
    return matchPath(route, location.pathname);
  };

  return (
    <div>
      <div
        className={`flex items-center cursor-pointer rounded ml-2 p-2 ${
          darkMode ? "hover:bg-slate-800" : "hover:bg-slate-50 hover:text-black"
        } `}
        onClick={toggleChildren}
      >
        <div className="flex items-center  gap-x-2">
          <div
            className={`text-xl mt-3 ${
              darkMode ? "text-white" : "text-black"
            } `}
          >
            {link.icon}
          </div>
          <span
            className={`text-lg ${
              darkMode ? "text-white" : "text-gray-600"
            } font-medium mt-3 ${darkMode ? "font-bold" : ""} `}
          >
            {link.label}
          </span>
        </div>
        {link.children && (
          <Icons.VscChevronRight
            data-testid="chevron-icon"
            className={`ml-auto text-xl mt-3 ${
              darkMode ? "text-white" : "text-black"
            } ${showChildren ? "transform rotate-90" : ""}`}
          />
        )}
      </div>
      {showChildren && link.children && (
        <div className=" ml-8 rounded-full">
          {link.children.map((childLink) => (
            <NavLink
              key={childLink.key}
              to={childLink.url}
              className={`flex items-center rounded-md gap-x-2 ${
                darkMode
                  ? "hover:bg-slate-800 hover:text-white text-white"
                  : "hover:bg-slate-200 "
              }`}
              onClick={()=>setIsOpen(false)}
            >
              <span
                className={`absolute left-0 top-0 h-full w-[0.2rem] bg-black ${
                  matchRoute(childLink.url) ? " opacity-100" : " opacity-0"
                }`}
              ></span>
              <div
                className={`${
                  matchRoute(childLink.url)
                    ? `font-semibold ${
                        darkMode ? " text-orange-400" : "text-blue-800"
                      }`
                    : ""
                }`}
              >
                {childLink.icon}
              </div>
              <span
                className={`block py-2 font-light text-base ${
                  darkMode ? "" : ""
                } hover:text-white ${
                  matchRoute(childLink.url)
                    ? `font-semibold ${
                        darkMode ? " text-orange-400" : "text-blue-800"
                      }`
                    : ""
                }`}
              >
                {childLink.label}
              </span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
