import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          alert("Please log in first.");
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/classrooms/classrooms/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setClasses(response.data);
      } catch (error) {
        console.error("Failed to fetch classes:", error.response?.data || error.message);
        alert("Failed to load classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-200 flex flex-col">
        <div className="text-3xl font-bold text-white p-4 bg-blue-400">
          echo class
        </div>
        <nav className="flex-1 p-4 space-y-4 text-white">
          <Link to="/student-dashboard" className="bg-blue-300 rounded p-2 block">
            Dashboard
          </Link>
          <Link to="/my-classes" className="bg-blue-300 rounded p-2 block">
            My Classes
          </Link>
          <div className="hover:bg-blue-300 rounded p-2 cursor-pointer">Settings</div>
          <div className="hover:bg-blue-300 rounded p-2 cursor-pointer">History</div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        <div className="flex items-center justify-end bg-blue-300 p-2 space-x-4">
          <span role="img" aria-label="flag" className="text-xl">🇺🇸</span>
          <span className="text-xl">☰</span>
          <span className="text-xl">⚙️</span>
          <span className="text-xl">🔔</span>
          <div className="w-8 h-8 rounded-full bg-gray-400"></div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">My Classes</h2>
          {loading ? (
            <p>Loading classes...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <Link
                    key={cls.id}
                    to={`/class/${cls.id}`}
                    className="bg-yellow-300 p-4 rounded shadow hover:bg-yellow-400 transition"
                  >
                    <p className="text-lg font-semibold">{cls.code}</p>
                    <p className="text-sm text-gray-700">Class ID: {cls.id}</p>
                    <p className="text-sm text-gray-700">Teacher ID: {cls.teacher}</p>
                  </Link>
                ))
              ) : (
                <p>No classes joined yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyClassesPage;
