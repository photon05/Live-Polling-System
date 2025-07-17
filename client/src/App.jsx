import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Removed TeacherLogin Route */}
        <Route path="/teacher/poll" element={<TeacherPage />} />
        <Route path="/student" element={<StudentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
