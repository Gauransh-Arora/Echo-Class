import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const UploadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a PDF file to upload.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("classroom", id);
      formData.append("file", file);

      await axiosInstance.post(`classrooms/materials/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ PDF uploaded successfully! The AI processing will continue in the background.");
      setFile(null);
      navigate(`/teacherclass/${id}`);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      alert("❌ Failed to upload PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar activePage="Classes" />
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <div className="p-6 max-w-md mx-auto bg-white shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Upload PDF</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded py-2 ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                "Upload"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
