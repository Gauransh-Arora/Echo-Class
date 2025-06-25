import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const ClassPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    fetchClass();
  }, []);

  const fetchClass = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        alert("You are not logged in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/classrooms/classrooms/${id}/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setClassData(response.data);
    } catch (error) {
      console.error("Error fetching class:", error);
      alert("Failed to load class data");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar activePage="Classes" />
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <div className="p-6">
          <div className="flex space-x-8 items-center mb-4">
            <button
              className="text-lg font-medium text-gray-700 hover:text-black border-b-2 border-yellow-400"
              onClick={() => navigate(`/teacherclass/${id}/upload`)}
            >
              Upload
            </button>
            <button
              className="text-lg font-medium text-gray-700 hover:text-black"
              onClick={() => navigate(`/teacherclass/${id}/students`)}
            >
              Students
            </button>
            <button
              className="text-lg font-medium text-gray-700 hover:text-black"
              onClick={() => navigate(`/teacherclass/${id}/grade`)}
            >
              Grade
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
            <div className="w-full h-64 border-8 border-yellow-400 rounded-lg mb-6"></div>

            <div className="flex space-x-4 mb-4">
              <div className="bg-yellow-400 text-white font-bold rounded-lg px-6 py-3">
                Code : {classData ? classData.code : "Loading..."}
              </div>
              <div className="bg-yellow-400 text-white font-bold rounded-lg px-6 py-3 cursor-pointer">
                Announcements
              </div>
            </div>

            {/* Upload PDF button */}
            <button
              onClick={() => navigate(`/teacherclass/${id}/upload`)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-6 py-3 transition"
            >
              Upload PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
