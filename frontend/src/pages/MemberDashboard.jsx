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
  const [sortOption, setSortOption] = useState('date'); // default sort option

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

  // Redirect if user or token is not available
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Filter savedJobs, ensuring each job has a title before calling toLowerCase
  const filteredJobs = savedJobs.filter(job =>
    job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort applications, with additional check for undefined status
  const sortedApplications = applications.sort((a, b) => {
    if (sortOption === 'date') return new Date(b.date) - new Date(a.date);
    if (sortOption === 'status') {
      const statusA = a.status || ''; // Default to empty string if undefined
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
          Welcome, {user.name}!
        </h1>

        {/* Summary Cards */}
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
            <p className="text-4xl font-extrabold text-red-600 dark:text-red-400">3</p> {/* Placeholder count */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Applications Section */}
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

            {/* Sorting Options */}
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
                          <h3 className="text-lg font-semibold dark:text-gray-100">{app.job_title || app.job?.title || 'N/A'}</h3>
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
                      <div className="h-1 mt-3 bg-gray-200 rounded">
                        <div
                          className={`h-full rounded ${app.status === 'Accepted' ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: `${app.status === 'Accepted' ? 100 : app.status === 'Pending' ? 50 : 25}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No applications found.</p>
                )
              ) : null}
            </div>
          </div>
          
          {/* Saved Jobs Section */}
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

            {/* Search and Filter */}
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
                  filteredJobs.map((job, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 mb-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold dark:text-gray-100">{job.title || job.job_title || 'N/A'}</h3>
                        </div>
                        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
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
