import { useLocation, Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────
// 🌱 ECOVISION RESULT PAGE — Sustainability Decision Output
//    Reads the full sustainability result from navigation state.
//    Never shows object names or raw confidence.
// ─────────────────────────────────────────────────────────────────

/** Animated circular progress ring */
function ScoreRing({ score, size = 110, stroke = 9, color = '#22c55e', label }) {
  const radius      = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset      = circumference - (score / 100) * circumference;

  return (
    <div className="score-ring-wrap">
      <svg width={size} height={size} className="score-ring" aria-label={`${label}: ${score}%`}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.2s ease' }}
        />
        <text
          x="50%" y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#fff"
          fontSize="18"
          fontWeight="700"
        >
          {score}%
        </text>
      </svg>
      <span className="score-ring-label">{label}</span>
    </div>
  );
}

/** Yes / No / Partial badge */
function StatusBadge({ value, icon }) {
  const map = {
    Yes:     { cls: 'badge-yes',     emoji: '✅' },
    No:      { cls: 'badge-no',      emoji: '❌' },
    Partial: { cls: 'badge-partial', emoji: '⚠️' },
  };
  const { cls, emoji } = map[value] || map['Partial'];
  return (
    <span className={`status-badge ${cls}`} aria-label={`${icon} ${value}`}>
      {emoji} {value}
    </span>
  );
}

function Result() {
  const location = useLocation();
  const state = location.state || {};

  const {
    imageSrc,
    recyclabilityScore,
    reusabilityScore,
    biodegradable,
    recyclable,
    sustainabilityConfidence,
    tier,
  } = state;

  // Guard: navigated here without data
  if (!imageSrc) {
    return (
      <section id="result" className="page-section result-page">
        <h2>🌿 Sustainability Report</h2>
        <p style={{ color: '#94a3b8', marginTop: '10px' }}>
          No analysis available yet. Please upload an image first.
        </p>
        <Link to="/upload" className="btn" style={{ marginTop: '24px', display: 'inline-block' }}>
          ← Go to Upload
        </Link>
      </section>
    );
  }

  // Tier badge colour
  const tierColor = { HIGH: '#22c55e', MEDIUM: '#f59e0b', LOW: '#ef4444' }[tier] || '#64748b';

  // Confidence bar colour
  const confNum = parseFloat(sustainabilityConfidence);
  const confColor = confNum >= 70 ? '#22c55e' : confNum >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <section id="result" className="page-section result-page">
      <h2>🌿 Sustainability Analysis Report</h2>
      <p className="result-subtitle">
        Evaluated by the EcoVision Environmental Impact Engine — no object guessing involved.
      </p>

      {/* ── Uploaded image preview ───────────────────────────── */}
      <div className="result-image-wrap">
        <img
          src={imageSrc}
          alt="Analysed waste item"
          className="result-image"
        />
        <div className="result-image-badge">
          <span style={{ color: tierColor }}>● {tier} CERTAINTY</span>
        </div>
      </div>

      {/* ── Score rings ──────────────────────────────────────── */}
      <div className="score-rings-row" aria-label="Sustainability scores">
        <ScoreRing
          score={recyclabilityScore}
          color="#22c55e"
          label="Recyclability"
        />
        <ScoreRing
          score={reusabilityScore}
          color="#0ea5e9"
          label="Reusability"
        />
      </div>

      {/* ── Status cards ─────────────────────────────────────── */}
      <div className="status-cards-row">
        <div className="status-card">
          <span className="status-card-icon">♻️</span>
          <span className="status-card-title">Recyclable</span>
          <StatusBadge value={recyclable} icon="Recyclable:" />
        </div>
        <div className="status-card">
          <span className="status-card-icon">🌱</span>
          <span className="status-card-title">Biodegradable</span>
          <StatusBadge value={biodegradable} icon="Biodegradable:" />
        </div>
      </div>

      {/* ── Sustainability Confidence bar ─────────────────────── */}
      <div className="confidence-section" aria-label={`Sustainability Confidence: ${sustainabilityConfidence}%`}>
        <div className="confidence-header">
          <span>🔬 Sustainability Confidence</span>
          <span style={{ color: confColor, fontWeight: 700 }}>{sustainabilityConfidence}%</span>
        </div>
        <div className="confidence-track">
          <div
            className="confidence-fill"
            style={{ width: `${Math.min(confNum, 100)}%`, background: confColor }}
          />
        </div>
        <p className="confidence-note">
          Derived from prediction stability and signal entropy — not from object classification.
        </p>
      </div>

      {/* ── Legend ───────────────────────────────────────────── */}
      <div className="result-legend">
        <span className="legend-item"><span style={{ color: '#22c55e' }}>●</span> HIGH certainty (&gt;85%)</span>
        <span className="legend-item"><span style={{ color: '#f59e0b' }}>●</span> MEDIUM (65–85%)</span>
        <span className="legend-item"><span style={{ color: '#ef4444' }}>●</span> LOW (&lt;65%)</span>
      </div>

      {/* ── Actions ──────────────────────────────────────────── */}
      <div className="result-actions">
        <Link to="/upload" className="btn" id="analyseAnotherBtn">
          🔄 Analyse Another Image
        </Link>
      </div>
    </section>
  );
}

export default Result;
