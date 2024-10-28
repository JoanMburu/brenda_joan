import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <button
      className="bg-gray-800 text-white px-4 py-2 rounded"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default ThemeToggle;