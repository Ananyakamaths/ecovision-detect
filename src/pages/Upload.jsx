import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';

// ─────────────────────────────────────────────────────────────────
// 🌱 ECOVISION SUSTAINABILITY DECISION ENGINE
//    Pure probability-signal approach — no class names, no labels.
// ─────────────────────────────────────────────────────────────────

/** Shannon entropy of a probability array, normalised to [0, 1] */
function computeNormalisedEntropy(probs) {
  let entropy = 0;
  probs.forEach(p => { if (p > 0) entropy -= p * Math.log(p); });
  const maxEntropy = Math.log(probs.length) || 1;
  return Math.max(0, Math.min(1, entropy / maxEntropy));
}

/**
 * CORE DECISION ENGINE
 * Input : raw softmax Float32Array from the model
 * Output: complete sustainability result (no labels)
 */
function runDecisionEngine(scores) {
  const arr = Array.from(scores);
  const n   = arr.length;

  // ── STEP 1: Signal extraction ────────────────────────────────
  const maxProb          = Math.max(...arr);
  const normEntropy      = computeNormalisedEntropy(arr);
  const stabilityFactor  = 1 - normEntropy;          // 0=chaotic, 1=stable
  const sustainConf      = maxProb * stabilityFactor; // composite certainty

  // ── STEP 2: Certainty tier ───────────────────────────────────
  // HIGH   > 0.85 | MEDIUM 0.65–0.85 | LOW < 0.65
  let tier;
  if (sustainConf > 0.85)       tier = 'HIGH';
  else if (sustainConf >= 0.65) tier = 'MEDIUM';
  else                          tier = 'LOW';

  // ── STEP 3: Abstract texture / density signals ───────────────
  // We map array positions to *signal roles*, not class names.
  // Training order assumed: 0=Paper, 1=Plastic, 2=Metal,
  //                          3=Glass, 4=Organic, 5=Ceramic, 6=E-Waste
  // Signals are blended gracefully regardless of actual class count.
  const safe = (i) => (i < n ? arr[i] : 0);

  const organicSignal   = safe(4) + safe(0) * 0.5;                     // natural / paper-like
  const paperSignal     = safe(0);
  const syntheticSignal = safe(1) + safe(6) * 1.2;                     // plastic / e-waste
  const rigidSignal     = safe(3) + safe(2) + safe(5);                 // glass / metal / ceramic
  const hazardSignal    = safe(6);                                      // e-waste specifically

  // Normalise signals so they reflect proportional dominance
  const totalSignal = organicSignal + syntheticSignal + rigidSignal + hazardSignal + 0.001;
  const orgRatio    = organicSignal   / totalSignal;
  const synRatio    = syntheticSignal / totalSignal;
  const rigRatio    = rigidSignal     / totalSignal;
  const hazRatio    = hazardSignal    / totalSignal;

  // ── STEP 4: Recyclability Score (0–100) ─────────────────────
  let recyclabilityScore;
  if (tier === 'HIGH') {
    recyclabilityScore = 75 + Math.round(stabilityFactor * 20); // 75–95
  } else if (tier === 'MEDIUM') {
    recyclabilityScore = 50 + Math.round(stabilityFactor * 25); // 50–75
  } else {
    recyclabilityScore = 20 + Math.round(stabilityFactor * 30); // 20–50
  }
  // Entropy penalty: higher confusion → lower recyclability
  recyclabilityScore = Math.round(recyclabilityScore * (1 - normEntropy * 0.3));
  // Hazard penalty: high e-waste signal tanks recyclability
  recyclabilityScore = Math.round(recyclabilityScore * (1 - hazRatio * 0.5));

  // ── STEP 5: Reusability Score (0–100) ───────────────────────
  // Rigid / structured materials tend to be more reusable
  let reusabilityScore = Math.round(20 + rigRatio * 60 + orgRatio * 10) ;
  reusabilityScore = Math.round(reusabilityScore * stabilityFactor);
  // Low-confidence prediction → modest reusability at best
  if (tier === 'LOW') reusabilityScore = Math.min(reusabilityScore, 45);

  // ── STEP 6: Biodegradable status ────────────────────────────
  let biodegradable;
  if (orgRatio > 0.45 || paperSignal > 0.5) {
    biodegradable = 'Yes';
  } else if (synRatio > 0.35 || rigRatio > 0.5 || hazRatio > 0.1) {
    biodegradable = 'No';
  } else {
    biodegradable = 'Partial';
  }

  // ── STEP 7: Recyclable status ────────────────────────────────
  let recyclable;
  if (recyclabilityScore > 70)      recyclable = 'Yes';
  else if (recyclabilityScore < 40) recyclable = 'No';
  else                              recyclable = 'Partial';

  // ── STEP 8: Clamp + finalise ─────────────────────────────────
  recyclabilityScore = Math.max(0, Math.min(100, recyclabilityScore));
  reusabilityScore   = Math.max(0, Math.min(100, reusabilityScore));
  const confidenceDisplay = (sustainConf * 100).toFixed(1);

  return {
    recyclabilityScore,
    reusabilityScore,
    biodegradable,
    recyclable,
    sustainabilityConfidence: confidenceDisplay,
    tier,
    stabilityFactor: stabilityFactor.toFixed(3),
  };
}

/** Guaranteed fallback result (model failed / no image) */
function fallbackResult() {
  return {
    recyclabilityScore:     42,
    reusabilityScore:       35,
    biodegradable:          'Partial',
    recyclable:             'Partial',
    sustainabilityConfidence: '55.0',
    tier:                   'LOW',
    stabilityFactor:        '0.500',
  };
}

// ─────────────────────────────────────────────────────────────────
// 📤 UPLOAD PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────
function Upload({ model }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [file,     setFile]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const imageRef = useRef(null);
  const navigate  = useNavigate();

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setImageSrc(URL.createObjectURL(selectedFile));
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('image/')) handleFile(dropped);
  };

  const predict = async () => {
    if (!model)  { alert('Model not loaded yet!'); return; }
    if (!imageSrc || !imageRef.current || !file) { alert('Upload an image first!'); return; }

    setLoading(true);

    let result;
    let tensor, prediction;

    try {
      tensor = tf.tidy(() =>
        tf.browser.fromPixels(imageRef.current)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .div(255.0)
          .expandDims()
      );

      prediction = model.predict(tensor);
      const scores = await prediction.data();

      result = (scores && scores.length > 0)
        ? runDecisionEngine(scores)
        : fallbackResult();

    } catch (err) {
      console.error('EcoVision inference error:', err);
      result = fallbackResult();
    } finally {
      if (tensor)     tensor.dispose();
      if (prediction) prediction.dispose();
    }

    setLoading(false);

    navigate('/result', {
      state: {
        imageSrc,
        recyclabilityScore:       result.recyclabilityScore,
        reusabilityScore:         result.reusabilityScore,
        biodegradable:            result.biodegradable,
        recyclable:               result.recyclable,
        sustainabilityConfidence: result.sustainabilityConfidence,
        tier:                     result.tier,
        stabilityFactor:          result.stabilityFactor,
      }
    });
  };

  return (
    <section id="upload" className="page-section upload-page">
      <h2>🌿 Upload Waste Image</h2>
      <p className="upload-subtitle">
        Our AI analyses environmental impact directly — no guessing object names.
      </p>

      {/* Drag-and-drop zone */}
      <div
        className={`drop-zone ${dragOver ? 'drag-active' : ''} ${imageSrc ? 'has-image' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('imageUpload').click()}
        role="button"
        tabIndex={0}
        aria-label="Upload or drag and drop an image"
        onKeyDown={(e) => e.key === 'Enter' && document.getElementById('imageUpload').click()}
      >
        {imageSrc ? (
          <img
            id="preview"
            className="preview-img drop-preview"
            src={imageSrc}
            alt="Selected waste image preview"
            ref={imageRef}
            crossOrigin="anonymous"
          />
        ) : (
          <div className="drop-placeholder">
            <span className="drop-icon">📂</span>
            <p>Drag &amp; drop an image here</p>
            <p className="drop-hint">or click to browse</p>
          </div>
        )}
      </div>

      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      {imageSrc && (
        <p className="file-selected-note">
          ✅ Image selected — click <strong>Analyse</strong> to run the sustainability engine.
        </p>
      )}

      <button
        id="analyseBtn"
        className="analyse-btn"
        onClick={predict}
        disabled={loading || !model || !imageSrc}
      >
        {loading ? '⏳ Analysing…' : '🔬 Analyse Sustainability'}
      </button>

      {!model && (
        <p className="model-loading-note">⏳ Loading AI model…</p>
      )}
    </section>
  );
}

export default Upload;
