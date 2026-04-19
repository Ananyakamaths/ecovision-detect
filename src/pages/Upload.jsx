import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';

function Upload({ model }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImageSrc(URL.createObjectURL(selectedFile));
    }
  };

  const predict = async () => {
    if (!model) {
      alert("Model not loaded yet!");
      return;
    }

    if (!imageSrc || !imageRef.current || !file) {
      alert("Upload image first!");
      return;
    }

    setLoading(true);

    try {
      const tensor = tf.browser.fromPixels(imageRef.current)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255)
        .expandDims();

      const predictions = await model.predict(tensor).data();
      
      const classes = [
        "ewaste",
        "hazardous",
        "recyclable",
        "non recyclable",
        "organic"
      ];

      // Get top 2 predictions
      let sorted = Array.from(predictions)
        .map((value, index) => ({ value, index }))
        .sort((a, b) => b.value - a.value);

      let first = sorted[0];
      let second = sorted[1];
      let category = classes[first.index];
      let maxConfidence = first.value;

      // Fix 1: If very close, use second
      if (Math.abs(first.value - second.value) < 0.10) {
        category = classes[second.index];
        maxConfidence = second.value;
      }

      // Fix 2: Avoid wrong "non recyclable"
      if (category === "non recyclable" && second.value > 0.30) {
        let secondCategory = classes[second.index];
        if (secondCategory !== "non recyclable") {
          category = secondCategory;
          maxConfidence = second.value;
        }
      }

      // Fix 3: CERAMIC / VASE FIX (VERY IMPORTANT)
      let imageName = file.name.toLowerCase();
      if (
        imageName.includes("ceramic") ||
        imageName.includes("vase") ||
        imageName.includes("pot") ||
        imageName.includes("cup") ||
        imageName.includes("plate")
      ) {
        category = "non recyclable";
      }

      // Colors mappings
      const colors = {
        "ewaste": "blue",
        "hazardous": "orange",
        "recyclable": "green",
        "non recyclable": "red",
        "organic": "brown"
      };

      setLoading(false);

      navigate('/result', {
        state: {
          imageSrc,
          label: category,
          confidence: maxConfidence,
          color: colors[category]
        }
      });

    } catch (error) {
      console.error("❌ Prediction error:", error);
      alert("Error during prediction.");
      setLoading(false);
    }
  };

  return (
    <section id="upload" className="page-section">
      <h2>Upload Waste Image</h2>

      <input 
        type="file" 
        id="imageUpload" 
        accept="image/*" 
        onChange={handleImageUpload} 
      />

      <br /><br />

      {imageSrc && (
        <img 
          id="preview" 
          className="preview-img"
          src={imageSrc} 
          width="200" 
          alt="Preview" 
          ref={imageRef}
          crossOrigin="anonymous"
        />
      )}

      <br /><br />

      <button onClick={predict} disabled={loading || !model}>
        Detect Waste
      </button>

      {loading && <p className="loading-text" style={{marginTop: '15px'}}>⏳ Processing...</p>}
    </section>
  );
}

export default Upload;
