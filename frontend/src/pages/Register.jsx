// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [userType, setUserType] = useState('member'); // Default to member registration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    company_name: '',
    about: '',
  });
  const navigate = useNavigate();

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      company_name: '',
      about: '',
    }); // Reset form data on user type change
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = userType === 'employer' 
      ? 'http://localhost:5000/api/employers/register' 
      : 'http://localhost:5000/api/members/register';

    const requestData = userType === 'employer'
      ? { 
          company_name: formData.company_name, 
          email: formData.email, 
          phone: formData.phone, 
          password: formData.password, 
          about: formData.about 
        }
      : { 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone, 
          password: formData.password 
        };

    try {
      await axios.post(endpoint, requestData);
      alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} registration successful`);
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Failed to register');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 border rounded">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      
      {/* User Type Selection */}
      <label className="block mb-2 font-semibold">Register as:</label>
      <select value={userType} onChange={handleUserTypeChange} className="w-full p-2 mb-4 border rounded">
        <option value="member">Member</option>
        <option value="employer">Employer</option>
      </select>

      {/* Conditional Fields Based on User Type */}
      {userType === 'employer' ? (
        <>
          <input type="text" name="company_name" placeholder="Company Name" required onChange={handleChange} className="w-full p-2 mb-4 border rounded" />
          <input type="text" name="about" placeholder="About Company" required onChange={handleChange} className="w-full p-2 mb-4 border rounded" />
        </>
      ) : (
        <>
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="w-full p-2 mb-4 border rounded" />
        </>
      )}
      
      <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full p-2 mb-4 border rounded" />
      <input type="text" name="phone" placeholder="Phone" required onChange={handleChange} className="w-full p-2 mb-4 border rounded" />
      <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="w-full p-2 mb-4 border rounded" />

      <button type="submit" className="w-full bg-primary text-white py-2 rounded">Register</button>
    </form>
  );
};

export default Register;
