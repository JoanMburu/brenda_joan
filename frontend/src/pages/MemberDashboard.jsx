// src/pages/MemberDashboard.jsx

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useUserContext } from '../context/UserContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const MemberDashboard = () => {
  const { user, token } = useUserContext();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showApplications, setShowApplications] = useState(true);
  const [showSavedJobs, setShowSavedJobs] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date');

  useEffect(() => {
    if (!token) return;

    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/member/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log("Applications Data:", response.data.applications);
        setApplications(response.data.applications || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        if (error.response && error.response.status === 401) {
          window.location.href = "/login";
        }
      }
    };

    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/member/saved-jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log("Saved Jobs Data:", response.data.saved_jobs);
        setSavedJobs(response.data.saved_jobs || []);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
        if (error.response && error.response.status === 401) {
          window.location.href = "/login";
        }
      }
    };

    fetchApplications();
    fetchSavedJobs();
  }, [token]);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  const handleRemoveSavedJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/member/saved-jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setSavedJobs((prevJobs) => prevJobs.filter((job) => job.job_id !== jobId));
    } catch (error) {
      console.error('Error removing saved job:', error);
    }
  };

  const filteredJobs = savedJobs.filter(job =>
    job.job_title && job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedApplications = applications.sort((a, b) => {
    if (sortOption === 'date') return new Date(b.created_at) - new Date(a.created_at);
    if (sortOption === 'status') {
      const statusA = a.status || '';
      const statusB = b.status || '';
      return statusA.localeCompare(statusB);
    }
    return 0;
  });

  return (
    <div className="flex">
      <Sidebar userRole={user.role} />
      <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen ml-64 transition duration-300 ease-in-out">
        <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-400 mb-8">
          Welcome, {user.name || "User"}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col items-center text-center">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Applications</h2>
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{applications.length}</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col items-center text-center">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Saved Jobs</h2>
            <p className="text-4xl font-extrabold text-green-600 dark:text-green-400">{savedJobs.length}</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col items-center text-center">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">New Messages</h2>
            <p className="text-4xl font-extrabold text-red-600 dark:text-red-400">3</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">My Applications</h2>
              <button 
                onClick={() => setShowApplications(!showApplications)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showApplications ? "Hide" : "Show"}
              </button>
            </div>

            <div className="flex justify-between mb-4">
              <p className="text-gray-600 dark:text-gray-400">Sort by:</p>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="rounded-md p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="date">Date</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
              {showApplications ? (
                sortedApplications.length > 0 ? (
                  sortedApplications.map((app, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 mb-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold dark:text-gray-100">
                            {app.job_title || "Job Title Unavailable"}
                          </h3>
                          <p
                            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                              app.status === 'Accepted' ? 'bg-green-200 text-green-800' :
                              app.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-red-200 text-red-800'
                            }`}
                          >
                            {app.status || 'N/A'}
                          </p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No applications found.</p>
                )
              ) : null}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Saved Jobs</h2>
              <button 
                onClick={() => setShowSavedJobs(!showSavedJobs)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showSavedJobs ? "Hide" : "Show"}
              </button>
            </div>

            <input
              type="text"
              placeholder="Search saved jobs..."
              className="w-full p-2 mb-4 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
              {showSavedJobs ? (
                filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <div key={job.id} className="p-4 bg-gray-50 dark:bg-gray-700 mb-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold dark:text-gray-100">{job.job_title}</h3>
                        </div>
                        <button
                          onClick={() => handleRemoveSavedJob(job.job_id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No saved jobs found.</p>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
