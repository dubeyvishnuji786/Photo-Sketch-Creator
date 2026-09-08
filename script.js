const imageInput = document.getElementById('imageInput');
const sketchCanvas = document.getElementById('sketchCanvas');
const ctx = sketchCanvas.getContext('2d');
const intensitySlider = document.getElementById('intensity');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    originalImage = new Image();
    originalImage.onload = () => {
      sketchCanvas.width = originalImage.width;
      sketchCanvas.height = originalImage.height;
      processSketch();
      downloadBtn.disabled = false;
    };
    originalImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

intensitySlider.addEventListener('input', () => {
  if (originalImage) {
    processSketch();
  }
});

function processSketch() {
  ctx.drawImage(originalImage, 0, 0);
  const imgData = ctx.getImageData(0, 0, sketchCanvas.width, sketchCanvas.height);
  const data = imgData.data;
  const intensity = parseInt(intensitySlider.value, 10);

  // Convert to artistic pencil sketch effect
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    let pencilTone = avg > (255 - intensity * 15) ? 255 : avg * 0.7;
    
    data[i] = pencilTone;
    data[i + 1] = pencilTone;
    data[i + 2] = pencilTone;
  }

  ctx.putImageData(imgData, 0, 0);
}

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'pencil-sketch.png';
  link.href = sketchCanvas.toDataURL('image/png');
  link.click();
});
      
