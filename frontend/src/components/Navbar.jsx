import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useUserContext();

  return (
    <nav className="bg-primary text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-lg font-semibold">Job Portal</Link>

      <div className="flex items-center">
        <ThemeToggle />

        {/* Conditional Links Based on User Role */}
        <div className="ml-4 flex items-center space-x-4">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin-dashboard" className="hover:underline">Admin</Link>
              )}
              {user.role === 'member' && (
                <Link to="/member-dashboard" className="hover:underline">Member</Link>
              )}
              {user.role === 'recruiter' && (
                <Link to="/recruiter-dashboard" className="hover:underline">Recruiter</Link>
              )}
              <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/register" className="bg-accent px-4 py-2 rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;