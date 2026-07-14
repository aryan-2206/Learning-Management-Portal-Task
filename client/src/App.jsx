import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useAuthStore from './store/useAuthStore';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/student/Dashboard';
import Courses from './pages/student/Courses';
import CourseDetails from './pages/student/CourseDetails';
import Player from './pages/student/Player';
import Profile from './pages/student/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="courses" element={<Courses />} />
          <Route path="course/:id" element={<CourseDetails />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/courses" element={<AdminCourses />} />
        </Route>
        <Route path="/player/:id" element={<Player />} />
      </Routes>
    </Router>
  );
}

export default App;
