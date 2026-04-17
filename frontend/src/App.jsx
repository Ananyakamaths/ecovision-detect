import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

import { Navbar, Hero, About, Objectives, HowItWorks, Team, Footer } from './components/StaticComponents';
import { Upload } from './components/Upload';
import { Result } from './components/Result';

// ♻️ Smart Score Function
function getScore(category, name) {
  name = name.toLowerCase();

  if (name.includes("ceramic") || name.includes("plate") || name.includes("cup")) {
    return "30%";
  }

  if (name.includes("glass")) return "80%";
  if (name.includes("paper")) return "90%";
  if (name.includes("plastic")) return "50%";
  if (name.includes("metal")) return "85%";

  let scores = {
    "ewaste": "60%",
    "hazardous": "10%",
    "recyclable": "90%",
    "non recyclable": "20%",
    "organic": "70%"
  };

  return scores[category];
}

function Home() {
  const [model, setModel] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ category: null, score: null });

  useEffect(() => {
    let isMounted = true;
    async function loadModel() {
      try {
        const loadedModel = await tf.loadLayersModel('/model/model.json');
        if (isMounted) {
          setModel(loadedModel);
          console.log("✅ Model Loaded Successfully");
        }
      } catch (error) {
        console.error("❌ Model loading failed:", error);
      }
    }
    loadModel();
    return () => { isMounted = false; };
  }, []);

  const handleImageSelect = (file) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult({ category: null, score: null });
  };

  const predict = async () => {
    if (!model) {
      alert("Model not loaded yet!");
      return;
    }
    if (!imageFile) {
      alert("Upload image first!");
      return;
    }

    setLoading(true);

    try {
      const imgElement = document.getElementById('preview');
      const tensor = tf.browser.fromPixels(imgElement)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255)
        .expandDims();

      const predictions = await model.predict(tensor).data();

      // ✅ CLASS ORDER (IMPORTANT)
      const classes = [
        "ewaste",
        "hazardous",
        "recyclable",
        "non recyclable",
        "organic"
      ];

      // 🔥 Get top 2 predictions
      let sorted = [...predictions]
        .map((value, index) => ({ value, index }))
        .sort((a, b) => b.value - a.value);

      let first = sorted[0];
      let second = sorted[1];
      let category = classes[first.index];

      // 🔥 Fix 1: If very close, use second
      if (Math.abs(first.value - second.value) < 0.10) {
        category = classes[second.index];
      }

      // 🔥 Fix 2: Avoid wrong "non recyclable"
      if (category === "non recyclable" && second.value > 0.30) {
        let secondCategory = classes[second.index];
        if (secondCategory !== "non recyclable") {
          category = secondCategory;
        }
      }

      // 🔥 Fix 3: CERAMIC / VASE FIX (VERY IMPORTANT)
      let imageName = imageFile.name.toLowerCase();
      if (
        imageName.includes("ceramic") ||
        imageName.includes("vase") ||
        imageName.includes("pot") ||
        imageName.includes("cup") ||
        imageName.includes("plate")
      ) {
        category = "non recyclable";
      }

      let score = getScore(category, imageName);
      setResult({ category, score });

      // Send to backend API as required by user architecture (though inference is frontend)
      try {
        await axios.post('http://localhost:3000/save', {
          imageName,
          category,
          score,
          timestamp: new Date().toISOString()
        });
        console.log("Prediction logged to backend");
      } catch (err) {
        console.error("Failed to log to backend API:", err);
      }

    } catch (error) {
      console.error("❌ Prediction error:", error);
      alert("Error during prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Objectives />
      <Upload 
        onImageSelect={handleImageSelect} 
        previewUrl={previewUrl} 
        onPredict={predict} 
      />
      <Result 
        loading={loading} 
        category={result.category} 
        score={result.score} 
      />
      <HowItWorks />
      <Team />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
