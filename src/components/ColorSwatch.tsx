
import { useState, useEffect } from 'react';
import { ColorInfo } from '@/types';
import { getContrastYIQ } from '@/utils/colorUtils';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ColorSwatchProps {
  color: ColorInfo;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCopyButton?: boolean;
  className?: string;
}

const ColorSwatch = ({
  color,
  onClick,
  size = 'md',
  showCopyButton = true,
  className,
}: ColorSwatchProps) => {
  const [copied, setCopied] = useState(false);
  const textColor = getContrastYIQ(color.hex);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
  };

  const sizeClasses = {
    sm: 'h-8 w-8 min-w-8 rounded-md',
    md: 'h-12 w-12 min-w-12 rounded-lg',
    lg: 'h-16 w-16 min-w-16 rounded-xl',
    xl: 'h-24 w-24 min-w-24 rounded-xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: color.hex }}
      className={cn(
        'color-card relative flex items-center justify-center shadow-sm cursor-pointer',
        sizeClasses[size],
        onClick && 'hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      {showCopyButton && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopy}
                className={`absolute top-1 right-1 rounded-full bg-${textColor === 'black' ? 'black/10' : 'white/30'} p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100 focus:opacity-100`}
              >
                {copied ? (
                  <Check size={14} className={`text-${textColor}`} />
                ) : (
                  <Copy size={14} className={`text-${textColor}`} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy color code'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </motion.div>
  );
};

export default ColorSwatch;
