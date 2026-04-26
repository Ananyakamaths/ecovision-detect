import React from 'react';

export function Result({ loading, resultData, previewUrl }) {
  if (!loading && !resultData.label) return null;

  return (
    <section id="result" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Analysis Result</h2>

      {loading && <p id="loading" style={{ fontSize: '1.2rem', color: '#666' }}>⏳ Processing analysis...</p>}

      {!loading && resultData.label && (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '20px' }}>
          {previewUrl && (
            <div style={{ marginBottom: '20px' }}>
              <img src={previewUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', objectFit: 'contain' }} />
            </div>
          )}
          
          <h3 style={{ margin: '10px 0', color: '#333' }}>
            Detected Material: <span style={{ color: '#2e8b57' }}>{resultData.label}</span>
          </h3>

          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '15px' }}>
            Confidence: <strong>{resultData.confidence}%</strong>
          </p>

          {resultData.warning && (
            <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '6px', marginBottom: '15px', border: '1px solid #ffeeba' }}>
              ⚠️ {resultData.warning}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>Recyclability</h4>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#0066cc' }}>{resultData.recyclability}</p>
            </div>
            <div style={{ backgroundColor: '#f0fff0', padding: '15px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2e8b57' }}>Reusability</h4>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#2e8b57' }}>{resultData.reusability}</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <span style={{ 
              padding: '8px 16px', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              backgroundColor: resultData.recyclableTag === 'Recyclable' ? '#d4edda' : '#f8d7da',
              color: resultData.recyclableTag === 'Recyclable' ? '#155724' : '#721c24'
            }}>
              {resultData.recyclableTag}
            </span>
            <span style={{ 
              padding: '8px 16px', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              backgroundColor: resultData.biodegradable === 'Yes' ? '#d4edda' : '#f8d7da',
              color: resultData.biodegradable === 'Yes' ? '#155724' : '#721c24'
            }}>
              {resultData.biodegradable === 'Yes' ? 'Biodegradable' : 'Non-Biodegradable'}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
