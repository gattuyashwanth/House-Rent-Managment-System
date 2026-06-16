import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <button
      className={`btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 ${className}`}
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle;
