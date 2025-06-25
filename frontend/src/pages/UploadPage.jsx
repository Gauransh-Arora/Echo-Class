import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { useParams } from "react-router-dom";

const UploadPage = () => {
  const { id } = useParams();  // classroom ID from URL
  const [file, setFile] = useState(null);

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
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        alert("You are not logged in. Please log in first.");
        return;
      }

      const formData = new FormData();
      formData.append("classroom", id);
      formData.append("file", file);

      await axios.post(
        "http://127.0.0.1:8000/api/classrooms/materials/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );

      alert("PDF uploaded successfully");
      // Optional: redirect or clear file
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      alert("Failed to upload PDF");
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
              className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
            >
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
