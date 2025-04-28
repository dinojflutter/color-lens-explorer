
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Heart } from 'lucide-react';
import { ColorInfo } from '@/types';
import { useColor } from '@/context/ColorContext';
import { getContrastYIQ } from '@/utils/colorUtils';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ColorDetailProps {
  color: ColorInfo;
}

export default function ColorDetail({ color }: ColorDetailProps) {
  const { saveColor } = useColor();
  const [copied, setCopied] = useState<'hex' | 'rgb' | null>(null);
  const textColor = getContrastYIQ(color.hex);

  const handleCopyHex = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied('hex');
    toast({ description: 'HEX कोड कपी गरियो!' });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyRgb = () => {
    navigator.clipboard.writeText(color.rgb);
    setCopied('rgb');
    toast({ description: 'RGB कोड कपी गरियो!' });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = () => {
    saveColor(color);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="rounded-xl overflow-hidden shadow-lg mb-6"
    >
      <div
        className="h-40 relative"
        style={{ backgroundColor: color.hex }}
      >
        <div 
          className="absolute inset-0 flex items-center justify-center p-4"
          style={{ color: textColor }}
        >
          <h2 className="text-3xl font-bold drop-shadow-sm">
            {color.name || 'रङ्ग छनोट'}
          </h2>
        </div>
      </div>
      
      <div className="bg-card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">HEX</div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyHex}
              className="w-full flex items-center justify-between p-3 rounded-md bg-secondary hover:bg-accent/50 transition-colors"
            >
              <span className="font-mono">{color.hex}</span>
              {copied === 'hex' ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </motion.button>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">RGB</div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyRgb}
              className="w-full flex items-center justify-between p-3 rounded-md bg-secondary hover:bg-accent/50 transition-colors"
            >
              <span className="font-mono">{color.rgb}</span>
              {copied === 'rgb' ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </motion.button>
          </div>
        </div>
        
        <Button 
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
        >
          <Heart className="h-4 w-4" />
          रङ्ग सुरक्षित गर्नुहोस्
        </Button>
      </div>
    </motion.div>
  );
}
