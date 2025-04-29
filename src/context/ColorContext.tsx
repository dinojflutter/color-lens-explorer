
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { ColorInfo, SavedColor } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface ColorContextType {
  currentColor: ColorInfo | null;
  savedColors: SavedColor[];
  setCurrentColor: (color: ColorInfo | null) => void;
  saveColor: (color: ColorInfo) => void;
  deleteColor: (id: string) => void;
  clearSavedColors: () => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [currentColor, setCurrentColor] = useState<ColorInfo | null>(null);
  const [savedColors, setSavedColors] = useState<SavedColor[]>(() => {
    const saved = localStorage.getItem('savedColors');
    return saved ? JSON.parse(saved) : [];
  });

  const saveColor = useCallback((color: ColorInfo) => {
    const newColor: SavedColor = {
      ...color,
      id: uuidv4(),
      timestamp: Date.now(),
    };

    setSavedColors((prev) => {
      const updated = [newColor, ...prev];
      localStorage.setItem('savedColors', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: 'Color Saved',
      description: `The color ${color.hex} has been added to your collection.`,
    });
  }, []);

  const deleteColor = useCallback((id: string) => {
    setSavedColors((prev) => {
      const updated = prev.filter((color) => color.id !== id);
      localStorage.setItem('savedColors', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: 'Color Removed',
      description: 'The color has been removed from your collection.',
    });
  }, []);

  const clearSavedColors = useCallback(() => {
    setSavedColors([]);
    localStorage.removeItem('savedColors');
    toast({
      title: 'Collection Cleared',
      description: 'All saved colors have been removed from your collection.',
    });
  }, []);

  const value = {
    currentColor,
    savedColors,
    setCurrentColor,
    saveColor,
    deleteColor,
    clearSavedColors,
  };

  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
};

export const useColor = () => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
};
