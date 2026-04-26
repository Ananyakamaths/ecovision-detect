import { useEffect, useRef } from 'react';

/**
 * ResultCanvas — draws the uploaded image onto a canvas.
 * No category label or bounding box text is drawn here.
 * The sustainability result is shown in the Result page's own UI.
 */
function ResultCanvas({ imageSrc }) {
  const canvasRef = useRef(null);
  const imageRef  = useRef(null);

  useEffect(() => {
    if (!imageSrc || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const img    = imageRef.current;

    const draw = () => {
      canvas.width  = img.naturalWidth  || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Subtle green overlay border — no text, no labels
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth   = Math.max(3, canvas.width * 0.005);
      const pad = ctx.lineWidth / 2;
      ctx.strokeRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2);
    };

    if (img.complete) {
      draw();
    } else {
      img.onload = draw;
    }
  }, [imageSrc]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Hidden source image */}
      <img
        ref={imageRef}
        src={imageSrc}
        alt=""
        aria-hidden="true"
        style={{ display: 'none' }}
      />
      <canvas
        ref={canvasRef}
        className="preview-img"
        style={{ maxWidth: '100%', borderRadius: '12px' }}
        aria-label="Analysed waste image"
      />
    </div>
  );
}

export default ResultCanvas;
