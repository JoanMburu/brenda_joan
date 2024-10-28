// src/pages/AllJobs.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';

const AllJobs = () => {
  const { token } = useUserContext();
  const [jobDetails, setJobDetails] = useState([]); // Array to store jobs with employer names
  const [searchTerm, setSearchTerm] = useState('');

  // Comment out the unused `jobs` variable to prevent the warning
  // eslint-disable-next-line no-unused-vars
  // const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log('API Response:', response.data);

        if (Array.isArray(response.data)) {
          // setJobs(response.data); // Remove if you don't need `jobs`
          await fetchEmployerNames(response.data);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    const fetchEmployerNames = async (jobsData) => {
      const jobsWithEmployers = await Promise.all(
        jobsData.map(async (job) => {
          if (job.employer_id) {
            try {
              const employerResponse = await axios.get(
                `http://localhost:5000/api/employers/${job.employer_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  withCredentials: true,
                }
              );

              return { ...job, employer_name: employerResponse.data.name };
            } catch (error) {
              console.error(`Error fetching employer for job ${job.id}:`, error);
              return { ...job, employer_name: 'Unknown Employer' };
            }
          }
          return { ...job, employer_name: 'Unknown Employer' };
        })
      );
      setJobDetails(jobsWithEmployers);
    };

    fetchJobs();
  }, [token]);

  const filteredJobs = jobDetails.filter((job) =>
    job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Jobs</h1>

      <div className="mb-6">
        <input
          type="text"
          id="job-search"
          name="job-search"
          placeholder="Search jobs..."
          className="w-full p-3 rounded border border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title || 'Job Title'}</h2>
              {/* <p className="text-gray-600 mb-4">
                <strong>Employer:</strong> {job.employer_name || 'Unknown Employer'}
              </p> */}
              <p className="text-gray-600 mb-4">
                <strong>Location:</strong> {job.location || 'Remote'}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Type:</strong> {job.job_type || 'Full-Time'}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Salary:</strong> {job.salary || 'N/A'}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Posted:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
              </p>

              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center">No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default AllJobs;
