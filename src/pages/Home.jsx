function Home() {
  return (
    <div>
      {/* HOME */}
      <section id="home" className="page-section">
        <h2>AI Powered Waste Detection System</h2>
        <p>
          EcoVision is an intelligent system that helps classify waste into different categories
          using Artificial Intelligence. It promotes smart waste management and environmental sustainability.
        </p>
      </section>

      {/* ABOUT */}
      <section id="about" className="page-section">
        <h2>About</h2>
        <p>
          Improper waste disposal is a major environmental issue. Manual segregation is inefficient.
          EcoVision uses AI to automatically detect and classify waste into categories like recyclable,
          organic, ewaste, hazardous, and non recyclable.
        </p>
      </section>

      {/* OBJECTIVES */}
      <section id="objectives" className="page-section">
        <h2>Objectives</h2>
        <ul>
          <li>Automated waste segregation</li>
          <li>Instant image-based classification</li>
          <li>Smart waste management</li>
          <li>Reduce environmental pollution</li>
        </ul>
      </section>

      {/* HOW IT WORKS */}
      <section className="page-section">
        <h2>How It Works</h2>
        <p>
          The system uses a trained AI model to analyze uploaded images.
          It identifies patterns and classifies waste into predefined categories.
          Based on classification, a reusability score is generated.
        </p>
      </section>

      {/* TEAM */}
      <section id="team" className="page-section">
        <h2>Team</h2>
        <p>
          Ananya Kamath <br />
          Rishikesh Tale<br />
          Hema sathvika <br />
          pooja<br />
        </p>
      </section>
    </div>
  );
}

export default Home;
