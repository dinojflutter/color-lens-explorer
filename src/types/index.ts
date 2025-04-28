
export interface ColorInfo {
  hex: string;
  rgb: string;
  name?: string;
  timestamp?: number;
}

export interface SavedColor extends ColorInfo {
  id: string;
  timestamp: number;
}
