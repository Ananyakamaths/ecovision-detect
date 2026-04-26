<<<<<<< HEAD
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
=======
import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import { Navbar, Hero, About, Objectives, HowItWorks, Team, Footer } from './components/StaticComponents';
import { Upload } from './components/Upload';
import { Result } from './components/Result';

const materialMapping = {
  paper: { label: "Paper", recyclability: "85%", reusability: "60%", biodegradable: "Yes", recyclableTag: "Recyclable" },
  plastic: { label: "Plastic", recyclability: "60%", reusability: "40%", biodegradable: "No", recyclableTag: "Recyclable" },
  metal: { label: "Metal", recyclability: "95%", reusability: "70%", biodegradable: "No", recyclableTag: "Recyclable" },
  organic: { label: "Organic", recyclability: "50%", reusability: "30%", biodegradable: "Yes", recyclableTag: "Non-Recyclable" },
  glass: { label: "Glass", recyclability: "90%", reusability: "80%", biodegradable: "No", recyclableTag: "Recyclable" },
  ewaste: { label: "E-Waste", recyclability: "60%", reusability: "20%", biodegradable: "No", recyclableTag: "Recyclable" },
  hazardous: { label: "Hazardous", recyclability: "10%", reusability: "0%", biodegradable: "No", recyclableTag: "Non-Recyclable" },
  recyclable: { label: "Recyclable", recyclability: "90%", reusability: "50%", biodegradable: "No", recyclableTag: "Recyclable" },
  "non recyclable": { label: "Non-Recyclable", recyclability: "20%", reusability: "10%", biodegradable: "No", recyclableTag: "Non-Recyclable" }
};

function getMaterialInfo(predictedCategory, imageName) {
  let name = imageName.toLowerCase();
  let label = predictedCategory.trim().toLowerCase();

  // Rule-based correction & label extraction from imagename
  if (name.includes("paper")) label = "paper";
  else if (name.includes("plastic") || name.includes("bottle")) label = "plastic";
  else if (name.includes("metal") || name.includes("can")) label = "metal";
  else if (name.includes("glass")) label = "glass";
  else if (name.includes("organic")) label = "organic";
  else if (name.includes("ceramic") || name.includes("plate") || name.includes("cup") || name.includes("vase") || name.includes("pot")) label = "non recyclable";
  
  if (label === "plastic_bottle") label = "plastic"; // Normalization

  const info = materialMapping[label];
  if (info) {
    return {
      label: info.label,
      recyclability: info.recyclability,
      reusability: info.reusability,
      biodegradable: info.biodegradable,
      recyclableTag: info.recyclableTag
    };
  }

  return {
    label: "Unknown material",
    recyclability: "0%",
    reusability: "0%",
    biodegradable: "Unknown",
    recyclableTag: "Non-Recyclable"
  };
}

function Home() {
  const [model, setModel] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({});

  useEffect(() => {
    let isMounted = true;
    async function loadModel() {
      try {
        const loadedModel = await tf.loadLayersModel("/model/model.json")
        if (isMounted) {
          setModel(loadedModel);
          console.log("✅ Model Loaded Successfully");
        }
>>>>>>> b088cd8b8ded0990610ef93523063d8d83702ef2
      } catch (error) {
        console.error("❌ Model loading failed:", error);
      }
    }
    loadModel();
<<<<<<< HEAD
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
=======
    return () => { isMounted = false; };
  }, []);

  const handleImageSelect = (file) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult({});
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
      let finalConfidence = first.value;

      // 🔥 Fix 1: If very close, use second
      if (Math.abs(first.value - second.value) < 0.10) {
        category = classes[second.index];
        finalConfidence = second.value;
      }

      // 🔥 Fix 2: Avoid wrong "non recyclable"
      if (category === "non recyclable" && second.value > 0.30) {
        let secondCategory = classes[second.index];
        if (secondCategory !== "non recyclable") {
          category = secondCategory;
          finalConfidence = second.value;
        }
      }

      // Validation rule: confidence < 0.6
      let warning = null;
      if (finalConfidence < 0.6) {
        warning = "Low confidence prediction – result may be inaccurate";
      }

      let imageName = imageFile.name;
      let materialInfo = getMaterialInfo(category, imageName);
      let confidencePercent = (finalConfidence * 100).toFixed(1);

      let resultData = { 
        label: materialInfo.label,
        confidence: confidencePercent,
        warning: warning,
        recyclability: materialInfo.recyclability,
        reusability: materialInfo.reusability,
        biodegradable: materialInfo.biodegradable,
        recyclableTag: materialInfo.recyclableTag
      };

      setResult(resultData);

      // Send to backend API as required by user architecture (though inference is frontend)
      const apiBase = import.meta.env.VITE_API_URL ?? "";
      try {
        await axios.post(`${apiBase}/api/save`, {
          imageName,
          category: materialInfo.label,
          score: materialInfo.reusability,
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
        resultData={result} 
        previewUrl={previewUrl}
      />
      <HowItWorks />
      <Team />
      <Footer />
    </>
  );
}

function App() {
  const [model, setModel] = useState(null);
  useEffect(() => {
  async function loadModel() {
    const loadedModel = await tf.loadLayersModel("/model/model.json");
    setModel(loadedModel);
    console.log("Model loaded");
  }
  loadModel();
}, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
>>>>>>> b088cd8b8ded0990610ef93523063d8d83702ef2
    </Router>
  );
}

export default App;
