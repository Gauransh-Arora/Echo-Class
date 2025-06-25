import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ activePage }) => {
  const navItems = [
    { name: "Dashboard", path: "/teacher-dashboard" },
    { name: "Classes", path: "/classes" },
    { name: "Certificate", path: "/certificate" },
    { name: "Settings", path: "/settings" },
    { name: "History", path: "/history" },
  ];

  return (
    <div className="w-64 bg-blue-100 min-h-screen p-4">
      <div className="text-2xl font-bold mb-8 text-white">echo class</div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={`p-2 rounded ${
              activePage === item.name ? "bg-blue-300" : ""
            }`}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
