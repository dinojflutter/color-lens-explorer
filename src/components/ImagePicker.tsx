
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCamera } from '@/hooks/useCamera';
import { getPixelData, rgbToHex, formatRgb, getColorName } from '@/utils/colorUtils';
import { useColor } from '@/context/ColorContext';
import { toast } from '@/components/ui/use-toast';

interface Pointer {
  x: number;
  y: number;
  show: boolean;
}

export default function ImagePicker() {
  const { setCurrentColor } = useColor();
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [pointer, setPointer] = useState<Pointer>({ x: -20, y: -20, show: false });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { videoRef, startCamera, stopCamera, hasCamera, isLoading: cameraLoading } = useCamera({
    onError: () => {
      toast({
        variant: "destructive",
        title: "क्यामेरा त्रुटि",
        description: "क्यामेरा पहुँच प्राप्त गर्न सकिएन। अनुमति दिनुहोस् वा अन्य उपकरण प्रयोग गर्नुहोस्।"
      });
      setActiveTab('upload');
    }
  });

  // Handle tab switching
  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  }, [activeTab, startCamera, stopCamera]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImage(result);
      setPointer({ x: -20, y: -20, show: false });
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update pointer position
    setPointer({ x, y, show: true });
    
    // Get pixel data
    const canvas = canvasRef.current;
    const pixelData = getPixelData(canvas, x, y);
    
    if (pixelData) {
      const { r, g, b } = pixelData;
      const hex = rgbToHex(r, g, b);
      const rgb = formatRgb(r, g, b);
      const name = getColorName(hex);
      
      setCurrentColor({
        hex,
        rgb,
        name
      });
    }
  };

  const handleCameraCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !containerRef.current) return;
    
    const video = videoRef.current;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create a canvas to capture the current video frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Calculate the scale between video dimensions and displayed dimensions
    const scaleX = video.videoWidth / rect.width;
    const scaleY = video.videoHeight / rect.height;
    
    // Adjust coordinates
    const adjustedX = x * scaleX;
    const adjustedY = y * scaleY;
    
    // Update pointer position
    setPointer({ x, y, show: true });
    
    // Draw the current video frame to the canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get pixel data at the click position
    const pixelData = getPixelData(canvas, adjustedX, adjustedY);
    
    if (pixelData) {
      const { r, g, b } = pixelData;
      const hex = rgbToHex(r, g, b);
      const rgb = formatRgb(r, g, b);
      const name = getColorName(hex);
      
      setCurrentColor({
        hex,
        rgb,
        name
      });
    }
  };

  // Load image to canvas when image changes
  useEffect(() => {
    if (!image || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      // Adjust canvas size to match container
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        // Set canvas dimensions
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        
        // Calculate aspect ratios
        const imgAspect = img.width / img.height;
        const containerAspect = containerWidth / containerHeight;
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (imgAspect > containerAspect) {
          // Image is wider than container
          drawHeight = containerHeight;
          drawWidth = drawHeight * imgAspect;
          offsetX = (containerWidth - drawWidth) / 2;
        } else {
          // Image is taller than container
          drawWidth = containerWidth;
          drawHeight = drawWidth / imgAspect;
          offsetY = (containerHeight - drawHeight) / 2;
        }
        
        // Draw image centered
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };
    img.src = image;
  }, [image]);

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue="upload" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="upload" className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            तस्विर अपलोड गर्नुहोस्
          </TabsTrigger>
          <TabsTrigger value="camera" className="flex-1" disabled={!hasCamera}>
            <Camera className="h-4 w-4 mr-2" />
            क्यामेरा
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-4">
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            
            {!image ? (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">रंग पत्ता लगाउन चित्र अपलोड गर्नुहोस्</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  PNG, JPG वा GIF फाइलहरू। अधिकतम आकार 10MB।
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  चित्र चयन गर्नुहोस्
                </Button>
              </motion.div>
            ) : (
              <div className="relative h-[300px] rounded-lg overflow-hidden" ref={containerRef}>
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  onClick={handleImageClick}
                />
                {pointer.show && (
                  <motion.div
                    className="absolute w-6 h-6 rounded-full border-2 border-white shadow-md pointer-events-none"
                    style={{ 
                      left: pointer.x - 12, 
                      top: pointer.y - 12,
                    }}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            )}
            
            {image && (
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setImage(null);
                    setPointer({ x: -20, y: -20, show: false });
                  }}
                >
                  नयाँ चित्र
                </Button>
                <p className="text-sm text-muted-foreground self-center">
                  तस्वीरमा कुनै पनि ठाउँमा क्लिक गरेर रङ छान्नुहोस्
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="camera" className="mt-4">
          <div className="space-y-4">
            <div className="relative h-[300px] rounded-lg overflow-hidden bg-black" ref={containerRef}>
              {cameraLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-contain"
                    onClick={handleCameraCapture}
                  />
                  {pointer.show && (
                    <motion.div
                      className="absolute w-6 h-6 rounded-full border-2 border-white shadow-md pointer-events-none"
                      style={{ 
                        left: pointer.x - 12, 
                        top: pointer.y - 12,
                      }}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              क्यामेरामा कुनै पनि ठाउँमा क्लिक गरेर रङ छान्नुहोस्
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
