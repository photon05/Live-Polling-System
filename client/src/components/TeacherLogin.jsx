import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeacherLogin = ({ setIsTeacherLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/teacher/login', {
        email,
        password
      });

      if (res.data) {
        // Navigate to the poll page
        sessionStorage.setItem('teacher', true);
        setIsTeacherLoggedIn(true);
        setError(''); // Clear any previous errors
        navigate('/teacher/poll');
      } else {
        setError(res.data.error || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Teacher Login</h2>
        <h1 className="text-sm text-left text-gray-600 bg-gray-100 px-4 py-2 rounded mb-4 border border-gray-200 shadow-inner">
          Use Email: <span className="font-medium">photon@teacher.com</span> and
          Password: <span className="font-medium">aaaa</span>
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white p-2 rounded hover:opacity-90 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default TeacherLogin;
