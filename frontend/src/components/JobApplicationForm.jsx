// src/pages/JobApplicationForm.jsx
import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const JobApplicationForm = () => {
  const { user, token } = useUserContext();
  const { jobId } = useParams(); // Assuming jobId is passed as a URL parameter
  const [formData, setFormData] = useState({
    resume: '',
    cover_letter: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/job-applications`,
        {
          job_id: jobId,
          member_id: user.id,
          resume: formData.resume,
          cover_letter: formData.cover_letter,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Application submitted successfully!");
      setError(null);

      // Redirect after success or provide feedback to user
      setTimeout(() => navigate(`/job/${jobId}`), 2000); // Redirect to job details after 2 seconds
    } catch (error) {
      console.error("Error submitting application:", error);
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to submit application. Please try again.");
      }
      setSuccessMessage(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Apply for Job</h2>
      {error && <div className="mb-4 p-2 text-red-700 bg-red-100 rounded">{error}</div>}
      {successMessage && <div className="mb-4 p-2 text-green-700 bg-green-100 rounded">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="resume" className="block mb-2 text-sm font-medium text-gray-700">
          Resume (Link or Text)
        </label>
        <input
          type="text"
          name="resume"
          id="resume"
          value={formData.resume}
          onChange={handleChange}
          placeholder="Enter your resume link or details"
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label htmlFor="cover_letter" className="block mb-2 text-sm font-medium text-gray-700">
          Cover Letter
        </label>
        <textarea
          name="cover_letter"
          id="cover_letter"
          value={formData.cover_letter}
          onChange={handleChange}
          placeholder="Write a brief cover letter"
          className="w-full p-2 mb-4 border rounded"
          rows="4"
          required
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
