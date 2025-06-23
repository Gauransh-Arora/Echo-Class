import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/TeacherDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<div className="text-center text-black">Welcome to EchoClass Dashboard!</div>} />
        <Route path="/teacher-dashboard" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
