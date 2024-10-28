// src/pages/AdminDashboard.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import { useUserContext } from '../context/UserContext';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useUserContext();

  // Redirect to login if user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const cardVariants = {
    hover: { scale: 1.05 },
  };

  return (
    <div className="flex">
      <Sidebar userRole={user.role} />
      <div className="p-8 bg-gray-100 dark:bg-darkBackground min-h-screen ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-darkText">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="p-6 bg-white dark:bg-darkCard shadow rounded"
            variants={cardVariants}
            whileHover="hover"
          >
            <h2 className="text-xl font-semibold mb-4 dark:text-darkText">Total Members</h2>
            <p className="text-2xl font-bold">120</p>
          </motion.div>
          <motion.div
            className="p-6 bg-white dark:bg-darkCard shadow rounded"
            variants={cardVariants}
            whileHover="hover"
          >
            <h2 className="text-xl font-semibold mb-4 dark:text-darkText">Jobs Posted</h2>
            <p className="text-2xl font-bold">45</p>
          </motion.div>
          <motion.div
            className="p-6 bg-white dark:bg-darkCard shadow rounded"
            variants={cardVariants}
            whileHover="hover"
          >
            <h2 className="text-xl font-semibold mb-4 dark:text-darkText">Applications</h2>
            <p className="text-2xl font-bold">200</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
