
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
      title: '색상 저장됨',
      description: `${color.hex} 색상이 저장되었습니다.`,
    });
  }, []);

  const deleteColor = useCallback((id: string) => {
    setSavedColors((prev) => {
      const updated = prev.filter((color) => color.id !== id);
      localStorage.setItem('savedColors', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: '색상 삭제됨',
      description: '색상이 컬렉션에서 삭제되었습니다.',
    });
  }, []);

  const clearSavedColors = useCallback(() => {
    setSavedColors([]);
    localStorage.removeItem('savedColors');
    toast({
      title: '모든 색상 삭제됨',
      description: '저장된 모든 색상이 삭제되었습니다.',
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
