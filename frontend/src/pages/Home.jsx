// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Job Portal</h1>
          <p className="text-lg mb-8">Your gateway to finding your dream job or hiring top talent!</p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-accent px-6 py-3 rounded text-white font-semibold hover:bg-accent-dark">
              Get Started
            </Link>
            <Link to="/login" className="bg-white text-primary px-6 py-3 rounded font-semibold hover:bg-gray-100">
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-md rounded text-center">
            <h3 className="text-xl font-semibold mb-4">Browse Jobs</h3>
            <p>Explore thousands of job listings from top companies worldwide. Filter by job type, and more to find the perfect match.</p>
            <Link to="/all-jobs" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
              Browse Jobs
            </Link>
          </div>
          <div className="p-6 bg-white shadow-md rounded text-center">
            <h3 className="text-xl font-semibold mb-4">Post Job Openings</h3>
            <p>Recruiters can post jobs easily, manage applicants, and connect with potential hires seamlessly.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded text-center">
            <h3 className="text-xl font-semibold mb-4">Track Applications</h3>
            <p>Keep track of your job applications in one place and get updates on their progress.</p>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
          <p className="mb-8">We are dedicated to bridging the gap between employers and job seekers by providing a seamless and efficient job application process.</p>
          <div className="flex flex-wrap justify-center space-x-4">
            <div className="p-4 max-w-xs bg-white rounded shadow-md">
              <h3 className="text-xl font-semibold mb-2">Trusted Employers</h3>
              <p>We partner with reputable companies and provide verified job listings.</p>
            </div>
            <div className="p-4 max-w-xs bg-white rounded shadow-md">
              <h3 className="text-xl font-semibold mb-2">User-Friendly</h3>
              <p>An intuitive platform that makes job searching and hiring simple and enjoyable.</p>
            </div>
            <div className="p-4 max-w-xs bg-white rounded shadow-md">
              <h3 className="text-xl font-semibold mb-2">Secure</h3>
              <p>Your data is safe with us, ensuring a reliable and secure job search experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-primary text-white py-6">
        <div className="container mx-auto text-center">
          <p className="mb-4">Already have an account?</p>
          <Link to="/login" className="text-accent font-semibold underline hover:text-accent-dark">
            Log In
          </Link>
          <p className="mt-4 text-sm">© 2023 Job Portal. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
