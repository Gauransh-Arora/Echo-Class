import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // 🆕
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import ClassCard from "../components/ClassCard";


const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();  // 🆕

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        alert("You are not logged in. Please log in first.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://127.0.0.1:8000/api/classrooms/classrooms/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      alert("Failed to load classes");
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        alert("You are not logged in. Please log in first.");
        navigate("/login");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/classrooms/classrooms/",
        { code },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert("Class added successfully");
      setShowModal(false);
      setCode("");
      fetchClasses();
    } catch (error) {
      console.error("Error adding class:", error.response?.data || error.message);
      alert("Failed to add class");
    }
  };

  const handleCardClick = (id) => {
    navigate(`/class/${id}`);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar activePage="Classes" />
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <div className="p-6 flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add Class
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <div
                key={cls.id}
                onClick={() => handleCardClick(cls.id)}
                className="cursor-pointer"
              >
                <ClassCard code={cls.code} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No classes found
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                Add Class
              </h2>
              <form onSubmit={handleAddClass} className="space-y-4">
                <input
                  type="text"
                  placeholder="Class Code"
                  className="w-full border p-2 rounded"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesPage;
