import React from 'react';

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
