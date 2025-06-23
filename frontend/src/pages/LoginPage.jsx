import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(null); // purely cosmetic
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/login/", {
        username,
        password,
      });

      const accessToken = res.data.access;
      localStorage.setItem("access", accessToken);
      localStorage.setItem("refresh", res.data.refresh);

      console.log(username, password, selectedRole);

      // Now fetch role
      const meRes = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userRole = meRes.data.role;
      alert(`Logged in as ${userRole}`);

      if (userRole === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/student-dashboard");
      }

    } catch (err) {
      alert("Login failed");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l ${
              selectedRole === "student" ? "bg-blue-600" : "bg-gray-700"
            }`}
            onClick={() => setSelectedRole("student")}
          >
            Student
          </button>
          <button
            className={`px-4 py-2 rounded-r ${
              selectedRole === "teacher" ? "bg-blue-600" : "bg-gray-700"
            }`}
            onClick={() => setSelectedRole("teacher")}
          >
            Teacher
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 rounded bg-gray-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded bg-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
