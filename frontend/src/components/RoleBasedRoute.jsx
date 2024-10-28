// src/components/RoleBasedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const RoleBasedRoute = ({ component: Component, role }) => {
  const { user } = useUserContext();

  // If user is not available (e.g., not logged in), redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Ensure `user.role` is defined before checking the role
  if (!user.role || user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Render the component if the role matches
  return <Component />;
};

export default RoleBasedRoute;
