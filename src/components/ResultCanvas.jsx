import { useEffect, useRef } from 'react';

function ResultCanvas({ imageSrc, category, color }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageSrc && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Overlay Bounding Box dynamically based on image size
        const boxWidth = img.width * 0.8;
        const boxHeight = img.height * 0.8;
        const x = (img.width - boxWidth) / 2;
        const y = (img.height - boxHeight) / 2;

        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, boxWidth, boxHeight);

        // Background for text
        ctx.fillStyle = color;
        ctx.fillRect(x, y - 30, ctx.measureText(category).width + 30, 30);

        // Text
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(category.toUpperCase(), x + 10, y - 8);
      };
    }
  }, [imageSrc, category, color]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Hidden image used to draw to canvas */}
      <img 
        ref={imageRef} 
        src={imageSrc} 
        alt="hidden" 
        style={{ display: 'none' }} 
      />
      <canvas 
        ref={canvasRef} 
        className="preview-img"
        style={{ maxWidth: '100%' }}
      ></canvas>
    </div>
  );
}

export default ResultCanvas;
