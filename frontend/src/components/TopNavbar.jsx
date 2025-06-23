import React from 'react';

const TopNavbar = ({ onAddClass }) => {
  return (
    <div className="w-full bg-white border-b flex justify-between items-center px-6 py-3">
      <div></div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={onAddClass}
      >
        + Add Class
      </button>
    </div>
  );
};

export default TopNavbar;
