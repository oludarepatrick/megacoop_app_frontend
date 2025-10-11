import { useState } from 'react';
import { kycService } from '@/services/kycService';
import { useMutation } from '@tanstack/react-query';
import { useKYCNavigation } from '@/hooks/useKYC';

export const useFaceVerification = (onSuccess?: () => void) => {
  const { refreshKYCStatus } = useKYCNavigation();
  
  const [step, setStep] = useState<'instructions' | 'camera' | 'captured' | 'complete'>('instructions');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const startMutation = useMutation({
    mutationFn: () => kycService.startFaceCapturing(),
    onSuccess: () => {
      setStep('camera');
    },
    onError: (error) => {
      console.error('Failed to start face capturing:', error);
    }
  });
  
  const sendMutation = useMutation({
    mutationFn: (imageData: string) => kycService.sendFaceCapturing(imageData),
    onSuccess: async (response) => {
      console.log('Face verification completed:', response);
      await refreshKYCStatus();
      if (onSuccess) {
        onSuccess();
      } 
    },
    onError: (error) => {
      console.error('Face verification failed:', error);
      setStep('camera'); 
    }
  });

  const handleStart = () => {
    console.log('Starting face verification...');
    startMutation.mutate();
  };
  
  const handleCapture = (webcamRef: React.RefObject<any>) => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setStep('captured');
      }
    }
  };
  
  const handleRetake = () => {
    setCapturedImage(null);
    setStep('camera');
  };
  
  const handleSubmit = () => {
    if (capturedImage) {
      const base64String = capturedImage.split(',')[1];
      sendMutation.mutate(base64String);
    }
  };

  return {
    step,
    capturedImage,
    isStarting: startMutation.isPending,
    isSending: sendMutation.isPending,
    
    handleStart,
    handleCapture,
    handleRetake,
    handleSubmit,
    setStep,
  };
};
