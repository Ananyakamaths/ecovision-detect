import React, { useRef } from 'react';

export function Upload({ onImageSelect, previewUrl, onPredict }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onImageSelect(file);
    }
  };

  return (
    <section id="upload">
      <h2>Upload Waste Image</h2>

      <input 
        type="file" 
        id="imageUpload" 
        accept="image/*" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <br/><br/>

      {previewUrl && (
        <img id="preview" src={previewUrl} width="200" alt="Preview" />
      )}

      <br/><br/>

      <button onClick={onPredict}>Detect Waste</button>
    </section>
  );
}
