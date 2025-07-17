import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleNavigate = () => {
    if (selectedRole === 'teacher') {
      navigate('/teacher/poll'); 
    } else if (selectedRole === 'student') {
      navigate('/student');
    }
  };

  return (
    <div className="landingPage min-h-screen flex items-center justify-center bg-[#F2F2F2] p-4">
      <div className="flex flex-col items-center text-center space-y-6 w-full max-w-3xl">
        <h1 className="text-4xl font-semibold text-[#373737]">
          Welcome to the <span className="text-[#4F0DCE] font-bold">Live Polling System...</span>
        </h1>

        <p className="text-2xl text-[#6E6E6E]">Please select your role to get started:</p>

        <div className="flex w-full gap-6">
          <div
            onClick={() => setSelectedRole('teacher')}
            className={`w-full h-32 cursor-pointer border-2 p-4 rounded-lg shadow-md flex flex-col justify-center transition-colors duration-200 ${
              selectedRole === 'teacher'
                ? 'border-[#4F0DCE] bg-[#EDE9FE]'
                : 'border-gray-300 hover:border-[#4F0DCE]'
            }`}
          >
            <h2 className="text-xl font-semibold text-left">I am a Teacher</h2>
            <p className="text-sm text-left text-[#6E6E6E] mt-1">Create and manage live polls in your classroom.</p>
          </div>

          <div
            onClick={() => setSelectedRole('student')}
            className={`w-full h-32 cursor-pointer border-2 p-4 rounded-lg shadow-md flex flex-col justify-center text-xl font-medium transition-colors duration-200 ${
              selectedRole === 'student'
                ? 'border-[#4F0DCE] bg-[#EDE9FE]'
                : 'border-gray-300 hover:border-[#4F0DCE]'
            }`}
          >
            <h2 className="text-xl font-semibold text-left">I am a Student</h2>
            <p className="text-sm text-left text-[#6E6E6E] mt-1">Join live polls and submit your answers in real-time.</p>
          </div>
        </div>

        <button
          onClick={handleNavigate}
          disabled={!selectedRole}
          className={`mt-6 px-6 py-3 text-lg w-1/4 rounded-4xl font-semibold transition duration-300 ${
            selectedRole
              ? 'bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white hover:brightness-110'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
