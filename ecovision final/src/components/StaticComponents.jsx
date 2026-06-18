import React from 'react';

// --- Navbar.jsx ---
export function Navbar() {
  return (
    <header>
      <div className="logo">
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#22c55e" strokeWidth="4"/>
          <path d="M50 20 L65 40 L50 60 L35 40 Z" fill="#22c55e"/>
          <circle cx="50" cy="50" r="5" fill="#0ea5e9"/>
        </svg>
        <h1>EcoVision</h1>
      </div>

      <nav>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#objectives">Objectives</a>
        <a href="#upload">Upload</a>
        <a href="#result">Result</a>
        <a href="#team">Team</a>
      </nav>
    </header>
  );
}

// --- Hero.jsx ---
export function Hero() {
  return (
    <section id="home">
      <h2>AI Powered Waste Detection System</h2>
      <p>
        EcoVision is an intelligent system that helps classify waste into different categories
        using Artificial Intelligence. It promotes smart waste management and environmental sustainability.
      </p>
    </section>
  );
}

// --- InfoSection.jsx ---
export function About() {
  return (
    <section id="about">
      <h2>About</h2>
      <p>
        Improper waste disposal is a major environmental issue. Manual segregation is inefficient.
        EcoVision uses AI to automatically detect and classify waste into categories like recyclable,
        organic, ewaste, hazardous, and non recyclable.
      </p>
    </section>
  );
}

export function Objectives() {
  return (
    <section id="objectives">
      <h2>Objectives</h2>
      <ul>
        <li>Automated waste segregation</li>
        <li>Instant image-based classification</li>
        <li>Smart waste management</li>
        <li>Reduce environmental pollution</li>
      </ul>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section>
      <h2>How It Works</h2>
      <p>
        The system uses a trained AI model to analyze uploaded images.
        It identifies patterns and classifies waste into predefined categories.
        Based on classification, a reusability score is generated.
      </p>
    </section>
  );
}

export function Team() {
  return (
    <section id="team">
      <h2>Team</h2>
      <p>
        Ananya Kamath <br/>
        Rishikesh Tale<br/>
        Hema sathvika <br/>
        pooja<br/>
      </p>
    </section>
  );
}

// --- Footer.jsx ---
export function Footer() {
  return (
    <footer>
      <p>© 2026 EcoVision | Smart Waste Management 🌍</p>
    </footer>
  );
}
