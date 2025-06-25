import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import ClassesPage from './pages/ClassesPage';
import ClassPage from './pages/ClassPage';
import UploadPage from './pages/UploadPage';
import StudentDashboard from './pages/StudentDashboard';
import MyClassesPage from './pages/MyClassesPage';
import ParticularClassPage from './pages/ParticularClassPage';
import MaterialDetailPage from './pages/MaterialDetailPage'; // You'll build this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        
        {/* Teacher Routes */}
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/class/:id" element={<ClassPage />} />
        <Route path="/class/:id/upload" element={<UploadPage />} />

        {/* Student Routes */}
        <Route path="/my-classes" element={<MyClassesPage />} />
        <Route path="/class/:id/" element={<ParticularClassPage />} />
        <Route path="/class/:id/material/:materialId" element={<MaterialDetailPage />} />

        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </Router>
  )
}

export default App;
