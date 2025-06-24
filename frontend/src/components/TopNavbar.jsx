import React from "react";

const TopNavbar = () => {
  return (
    <div className="bg-indigo-300 flex items-center justify-between p-4">
      <div></div>
      <div className="flex space-x-4 items-center">
        <span role="img" aria-label="flag">
          🇺🇸
        </span>
        <span>🔲</span>
        <span>⚙️</span>
        <span>🔔</span>
        <img
          src="https://via.placeholder.com/32"
          alt="Profile"
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default TopNavbar;
