
import { useState, useEffect } from 'react';

interface AdPlaceholderProps {
  type?: 'banner' | 'square';
}

export default function AdPlaceholder({ type = 'banner' }: AdPlaceholderProps) {
  const [color, setColor] = useState('#9b87f5');
  
  useEffect(() => {
    const colors = ['#9b87f5', '#8b5cf6', '#D946EF', '#0EA5E9'];
    const interval = setInterval(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setColor(randomColor);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      style={{ 
        background: `linear-gradient(135deg, ${color}30, ${color}80)`,
        borderLeft: `4px solid ${color}`
      }}
      className={`relative flex items-center justify-center rounded-xl transition-colors duration-700 ease-in-out shadow-sm ${
        type === 'banner' ? 'h-24 w-full' : 'h-64 w-full'
      }`}
    >
      <div className="text-center">
        <p className="text-sm font-medium">Advertisement Placeholder</p>
        <p className="text-xs opacity-75">
          AdMob advertisement will appear here
        </p>
      </div>
    </div>
  );
}
