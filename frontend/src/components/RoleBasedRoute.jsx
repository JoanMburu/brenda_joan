// src/components/RoleBasedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const RoleBasedRoute = ({ component: Component, roles }) => {
  const { user } = useUserContext();

  // Redirect to login if user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowed roles array
  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
};

export default RoleBasedRoute;
