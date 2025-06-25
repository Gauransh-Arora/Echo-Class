import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImg from '../assets/back.png';
import illustration from '../assets/Rectangle.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [selectedRole, setSelectedRole] = useState(null); // purely for button highlight

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/login/", {
        username: formData.username,
        password: formData.password,
      });

      const accessToken = res.data.access;
      localStorage.setItem("access", accessToken);
      localStorage.setItem("refresh", res.data.refresh);

      // Fetch role
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
      console.error('Error response:', err.response?.data || err.message);
    }
  };

  return (
    <div 
      className="h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute top-5 left-5 text-white text-2xl font-bold">echo class</div>
      <button 
        onClick={() => navigate('/signup')}
        className="absolute top-5 right-5 text-white border px-2 rounded"
      >
        sign up
      </button>

      <div className="flex w-3/4 max-w-4xl bg-white/10 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
        {/* Left form side */}
        <div className="flex-1 p-8 text-white">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="flex justify-center mb-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-l ${
                  selectedRole === 'student' ? 'bg-blue-600' : 'bg-white/20'
                }`}
                onClick={() => setSelectedRole('student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-r ${
                  selectedRole === 'teacher' ? 'bg-blue-600' : 'bg-white/20'
                }`}
                onClick={() => setSelectedRole('teacher')}
              >
                Teacher
              </button>
            </div>

            <div>
              <label className="block mb-1">Username</label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full p-2 rounded bg-white/20 border border-white placeholder-white"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-2 rounded bg-white/20 border border-white placeholder-white"
                required
              />
            </div>

            <div className="flex justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-1" /> Remember me
              </label>
              <a href="#" className="underline">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-sky-950 to-sky-700 rounded p-2"
            >
              Login
            </button>

            <p className="text-sm">
              Don’t have an account?{' '}
              <span 
                onClick={() => navigate('/signup')}
                className="underline cursor-pointer"
              >
                Register
              </span>
            </p>
          </form>
        </div>

        {/* Right illustration side */}
        <div className="flex-1 bg-white/80 flex flex-col justify-center items-center p-4">
          <h2 className="text-yellow-400 text-2xl font-bold mt-2 p-4">Sign in</h2>
          <img src={illustration} alt="Illustration" className="max-w-xs" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
