import React from 'react';

export function Result({ loading, category, score }) {
  const colors = {
    "ewaste": "blue",
    "hazardous": "orange",
    "recyclable": "green",
    "non recyclable": "red",
    "organic": "brown"
  };

  return (
    <section id="result">
      <h2>Result</h2>

      {loading && <p id="loading">⏳ Processing...</p>}

      {!loading && category && (
        <p id="category">
          Detected Waste: <span style={{ color: colors[category] }}>{category}</span>
        </p>
      )}

      {!loading && score && (
        <p id="score">Reusability Score: {score}</p>
      )}
    </section>
  );
}
