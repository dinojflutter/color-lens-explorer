
// Helper function to convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// Helper function to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Format RGB as string
export function formatRgb(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}

// Calculate if text should be dark or light based on background
export function getContrastYIQ(hexcolor: string): 'black' | 'white' {
  const rgb = hexToRgb(hexcolor);
  if (!rgb) return 'black';
  
  const { r, g, b } = rgb;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}

// Get color name approximation
export function getColorName(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'Unknown';
  
  const { r, g, b } = rgb;
  
  // This is a simple approximation for common color names
  if (r > 200 && g > 200 && b > 200) return 'White';
  if (r < 50 && g < 50 && b < 50) return 'Black';
  
  if (r > 200 && g < 100 && b < 100) return 'Red';
  if (r > 200 && g > 150 && b < 100) return 'Orange';
  if (r > 200 && g > 200 && b < 100) return 'Yellow';
  if (r < 100 && g > 150 && b < 100) return 'Green';
  if (r < 100 && g > 150 && b > 150) return 'Teal';
  if (r < 100 && g < 100 && b > 150) return 'Blue';
  if (r > 150 && g < 100 && b > 150) return 'Purple';
  if (r > 150 && g < 100 && b < 100) return 'Brown';
  
  if (r > g && r > b) return 'Red-ish';
  if (g > r && g > b) return 'Green-ish';
  if (b > r && b > g) return 'Blue-ish';
  
  return 'Gray';
}

// Extract pixels from image data
export function getPixelData(canvas: HTMLCanvasElement, x: number, y: number): { r: number; g: number; b: number } | null {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    return {
      r: imageData[0],
      g: imageData[1],
      b: imageData[2]
    };
  } catch (error) {
    console.error('Error getting pixel data:', error);
    return null;
  }
}
