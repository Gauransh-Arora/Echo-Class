import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import ClassesPage from './pages/ClassesPage';
import ClassPage from './pages/ClassPage';
import UploadPage from './pages/UploadPage'; // You'll build this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/class/:id" element={<ClassPage />} />
        <Route path="/class/:id/upload" element={<UploadPage />} />

        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </Router>
  )
}

export default App;
