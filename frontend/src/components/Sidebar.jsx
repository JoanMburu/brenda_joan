import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const Sidebar = () => {
  const { user } = useUserContext();

  return (
    <div className="w-64 h-screen bg-primary text-white fixed">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <nav className="mt-8">
          <Link to="/" className="block py-2 hover:bg-blue-700">Home</Link>

          {/* Conditional Links Based on User Role */}
          {user?.role === 'admin' && (
            <Link to="/admin-dashboard" className="block py-2 hover:bg-blue-700">Admin Dashboard</Link>
          )}
          {user?.role === 'member' && (
            <Link to="/member-dashboard" className="block py-2 hover:bg-blue-700">Member Dashboard</Link>
          )}
          {user?.role === 'recruiter' && (
            <Link to="/recruiter-dashboard" className="block py-2 hover:bg-blue-700">Recruiter Dashboard</Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;