<<<<<<< HEAD
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  // If we are on the Home page, we can use anchor links. 
  // If we are on other pages, we can just link to the pages.
  return (
    <header>
      <Link to="/" className="logo">
        {/* 🔥 NEW AI + ECO LOGO */}
=======
import React from 'react';

function Navbar() {
  return (
    <header>
      <div className="logo">
>>>>>>> b088cd8b8ded0990610ef93523063d8d83702ef2
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#22c55e" strokeWidth="4"/>
          <path d="M50 20 L65 40 L50 60 L35 40 Z" fill="#22c55e"/>
          <circle cx="50" cy="50" r="5" fill="#0ea5e9"/>
        </svg>
        <h1>EcoVision</h1>
<<<<<<< HEAD
      </Link>

      <nav>
        {location.pathname === '/' ? (
          <>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#objectives">Objectives</a>
            <Link to="/upload">Upload</Link>
            <Link to="/result">Result</Link>
            <a href="#team">Team</a>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/upload">Upload</Link>
            <Link to="/result">Result</Link>
          </>
        )}
=======
      </div>

      <nav>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#objectives">Objectives</a>
        <a href="#upload">Upload</a>
        <a href="#result">Result</a>
        <a href="#team">Team</a>
>>>>>>> b088cd8b8ded0990610ef93523063d8d83702ef2
      </nav>
    </header>
  );
}

export default Navbar;
