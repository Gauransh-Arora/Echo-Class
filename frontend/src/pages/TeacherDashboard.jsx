import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import ClassCard from "../components/ClassCard";

const HomePage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        alert("Not authenticated. Please log in again.");
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
      console.log("Fetched classes:", response.data);
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        alert("Not authenticated. Please log in again.");
        return;
      }
      const response = await axios.post(
        "http://127.0.0.1:8000/api/classrooms/classrooms/",
        {
          code,
          title
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("Class added successfully!");
      setShowModal(false);
      setCode("");
      setTitle("");
      fetchClasses(); // Refresh the class list
    } catch (error) {
      console.error("Error adding class:", error);
      alert("Failed to add class.");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNavbar onAddClass={() => setShowModal(true)} />
        <div className="p-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading classes...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    id={cls.id}
                    title={cls.title || `Class ${cls.id}`}
                    code={cls.code}
                  />
                ))
              ) : (
                <div className="text-center col-span-full text-gray-500">
                  No classes found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Add Class</h2>
              <form onSubmit={handleAddClass} className="space-y-4">
                <input
                  type="text"
                  placeholder="Class Code"
                  className="w-full border p-2 rounded"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Class Title"
                  className="w-full border p-2 rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setShowModal(false)}
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

export default HomePage;
