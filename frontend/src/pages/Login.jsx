// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useUserContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { access_token, id, role, name } = response.data;

      const userData = { id, role, access_token, name };

      login(userData);

      if (role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else if (role === 'member') {
        navigate('/member-dashboard', { replace: true });
      } else if (role === 'employer') {
        navigate('/recruiter-dashboard', { replace: true });
      } else {
        console.error("Unexpected role; navigation not defined:", role);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert('Failed to login');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 border rounded">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        autoComplete="email"
        required
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
