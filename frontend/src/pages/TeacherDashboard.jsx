import {Link} from 'react-router-dom'; // In your sidebar
import React from "react";

const TeacherDashboard = () => {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-200 flex flex-col">
        <div className="text-3xl font-bold text-white p-4 bg-blue-400">
          echo class
        </div>
        <nav className="flex-1 p-4 space-y-4 text-white">
          <Link to="/teacher-dashboard" className="bg-blue-300 rounded p-2 block">
            Dashboard
          </Link>
          <Link to="/classes" className="bg-blue-300 rounded p-2 block">
            Classes
          </Link>
          <div className="hover:bg-blue-300 rounded p-2 cursor-pointer">
            Certificate
          </div>
          <div className="hover:bg-blue-300 rounded p-2 cursor-pointer">
            Settings
          </div>
          <div className="hover:bg-blue-300 rounded p-2 cursor-pointer">
            History
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Top Bar */}
        <div className="flex items-center justify-end bg-blue-300 p-2 space-x-4">
          <span role="img" aria-label="flag" className="text-xl">
            🇺🇸
          </span>
          <span className="text-xl">☰</span>
          <span className="text-xl">⚙️</span>
          <span className="text-xl">🔔</span>
          <div className="w-8 h-8 rounded-full bg-gray-400"></div>
        </div>

        {/* Dashboard Widgets */}
        <div className="p-6 space-y-6">
          {/* Search + Related */}
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="font-semibold mb-2">Find best courses</p>
            <input
              type="text"
              placeholder="Search courses"
              className="w-full p-2 rounded bg-white"
            />
            <p className="font-semibold mt-4 mb-2">Related courses</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="w-8 h-8 bg-blue-900 rounded-full"></div>
              <div className="w-8 h-8 bg-blue-900 rounded-full"></div>
              <div className="w-8 h-8 bg-blue-900 rounded-full"></div>
              <div className="w-8 h-8 bg-black rounded-full"></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-yellow-300 p-4 rounded text-center">
              <p>Uploaded videos</p>
              <p className="text-3xl font-bold">96</p>
            </div>
            <div className="bg-yellow-300 p-4 rounded text-center">
              <p>Classes</p>
              <p className="text-3xl font-bold">196</p>
            </div>
            <div className="bg-yellow-300 p-4 rounded text-center">
              <p>Courses completed</p>
              <p className="text-3xl font-bold">42</p>
            </div>
            <div className="bg-yellow-300 p-4 rounded text-center">
              <p>Courses pending</p>
              <p className="text-3xl font-bold">5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
