import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Result from './pages/Result';
import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

function App() {
  const [model, setModel] = useState(null);

  useEffect(() => {
    async function loadModel() {
      try {
        const loadedModel = await tf.loadLayersModel('/model/model.json');
        setModel(loadedModel);
        console.log("✅ Model Loaded Successfully");
      } catch (error) {
        console.error("❌ Model loading failed:", error);
      }
    }
    loadModel();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload model={model} />} />
        <Route path="/result" element={<Result />} />
      </Routes>
      <footer>
        <p>© 2026 EcoVision | Smart Waste Management 🌍</p>
      </footer>
    </Router>
  );
}

export default App;
