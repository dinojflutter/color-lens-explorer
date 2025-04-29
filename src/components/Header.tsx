
import { motion } from 'framer-motion';
import { EyeIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-4 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <EyeIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-primary">Color</span> Picker
            </h1>
          </div>
          <p className="text-muted-foreground max-w-lg">
            Upload an image or use your camera to discover colors from any object.
            HEX and RGB codes will be automatically generated.
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleTheme}
          className="self-center md:self-auto"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 mr-2" />
          ) : (
            <Moon className="h-4 w-4 mr-2" />
          )}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
    </motion.header>
  );
}
