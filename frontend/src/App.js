// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetail from './pages/JobDetail';
import AllJobs from './pages/AllJobs';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RoleBasedRoute from './components/RoleBasedRoute';
import JobApplicationForm from './components/JobApplicationForm';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto mt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/all-jobs" element={<AllJobs />} />
            <Route path="/job/:id" element={<JobDetail />} />
            <Route path="/admin-dashboard" element={<RoleBasedRoute component={AdminDashboard} roles={['admin']} />} />
            <Route path="/member-dashboard" element={<RoleBasedRoute component={MemberDashboard} roles={['member']} />} />
            <Route path="/recruiter-dashboard" element={<RoleBasedRoute component={RecruiterDashboard} roles={['recruiter', 'employer']} />} />
            <Route path="/apply/:jobId" element={<JobApplicationForm />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
