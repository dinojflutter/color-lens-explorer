
import { useState, useEffect, useRef } from 'react';

interface UseCameraOptions {
  onError?: (error: Error) => void;
}

export function useCamera({ onError }: UseCameraOptions = {}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = async (deviceId?: string) => {
    setIsLoading(true);
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown camera error');
      setError(error);
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const takeSnapshot = (): HTMLCanvasElement | null => {
    if (!videoRef.current) return null;
    
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas;
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    stream,
    error,
    isLoading,
    startCamera,
    stopCamera,
    takeSnapshot,
    hasCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
  };
}
