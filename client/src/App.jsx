import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TeacherLogin from './components/TeacherLogin';
import TeacherPage from './pages/teacherPage';
import StudentPage from './pages/studentPage';

export default function App() {
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = !!sessionStorage.getItem('teacher');
    setIsTeacherLoggedIn(isLoggedIn);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/teacher" element={<TeacherLogin setIsTeacherLoggedIn={setIsTeacherLoggedIn} />} />
        <Route
          path="/teacher/poll"
          element={isTeacherLoggedIn ? <TeacherPage /> : <TeacherLogin setIsTeacherLoggedIn={setIsTeacherLoggedIn} />}
        />
        <Route path="/student" element={<StudentPage />} />
      </Routes>
    </BrowserRouter>
  );
}
