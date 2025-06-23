import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');  // purely for UI and form data
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/users/register/', {
        username,
        password,
        role: selectedRole,
      });
      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <div className="flex justify-center mb-4">
          <button 
            type="button"
            className={`px-4 py-2 rounded-l ${
              selectedRole === 'student' ? 'bg-blue-600' : 'bg-gray-700'
            }`} 
            onClick={() => setSelectedRole('student')}
          >
            Student
          </button>
          <button 
            type="button"
            className={`px-4 py-2 rounded-r ${
              selectedRole === 'teacher' ? 'bg-blue-600' : 'bg-gray-700'
            }`} 
            onClick={() => setSelectedRole('teacher')}
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
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-2 rounded bg-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
