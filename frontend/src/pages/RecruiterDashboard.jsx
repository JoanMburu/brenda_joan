// src/pages/RecruiterDashboard.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import { useUserContext } from '../context/UserContext';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';

const RecruiterDashboard = () => {
  const { user } = useUserContext();

  if (!user || user.role !== 'employer') {
    return <Navigate to="/login" replace />;
  }

  const cardVariants = {
    hover: { scale: 1.05 },
  };

  return (
    <div className="flex">
      <Sidebar userRole={user.role} />
      <div className="p-8 bg-gray-100 dark:bg-darkBackground min-h-screen ml-64">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-darkText mb-6">Recruiter Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div className="p-6 bg-white dark:bg-darkCard shadow rounded" variants={cardVariants} whileHover="hover">
            <h2 className="text-xl font-semibold mb-4 dark:text-darkText">Active Job Postings</h2>
            <p className="text-2xl font-bold">8</p>
          </motion.div>
          <motion.div className="p-6 bg-white dark:bg-darkCard shadow rounded" variants={cardVariants} whileHover="hover">
            <h2 className="text-xl font-semibold mb-4 dark:text-darkText">Total Applications</h2>
            <p className="text-2xl font-bold">150</p>
          </motion.div>
          <motion.div className="p-6 bg-white dark:bg-darkCard shadow rounded" variants={cardVariants} whileHover="hover">
            <h2 className="text-xl font-semibold mb-4 dark:text-darkText">Interviews Scheduled</h2>
            <p className="text-2xl font-bold">5</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
