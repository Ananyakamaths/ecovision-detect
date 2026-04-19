import { useLocation, Link } from 'react-router-dom';
import ResultCanvas from '../components/ResultCanvas';

function Result() {
  const location = useLocation();
  const { imageSrc, label, confidence, color } = location.state || {};

  if (!imageSrc) {
    return (
      <section id="result" className="page-section">
        <h2>Result</h2>
        <p>No result available. Please upload an image.</p>
        <Link to="/upload" className="btn" style={{marginTop: '20px'}}>Go to Upload</Link>
      </section>
    );
  }

  return (
    <section id="result" className="page-section">
      <h2>Result</h2>
      
      <ResultCanvas imageSrc={imageSrc} category={label} color={color} />

      <p id="category" className="category-text">
        Detected Waste: <span style={{ color: color }}>{label}</span>
      </p>
      <p id="score" className="score-text">
        Confidence: {(confidence * 100).toFixed(2)}%
      </p>
      <p style={{ marginTop: '15px' }}>
        This prediction is generated using a TensorFlow.js model trained to classify waste materials.
      </p>
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/upload" className="btn">Upload Another Image</Link>
      </div>
    </section>
  );
}

export default Result;
