import { useEffect } from 'react';
import { useKYCStore, getKYCStepsWithStatus } from '@/store/kycStore';
import { useAuthStore } from '@/store/authStore';

export const useKYC = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    status,
    currentStep,
    modalType,
    isLoading,
    hasCheckedStatus,
    checkKYCStatus,
    setModalType,
    setCurrentStep,
    getNextIncompleteStep,
    isKYCComplete,
    shouldShowModal,
  } = useKYCStore();

  // Always check KYC status when user is authenticated
  // This ensures we get fresh data from the API every time
  useEffect(() => {
    if (isAuthenticated) {
      checkKYCStatus();
    }
  }, [isAuthenticated, checkKYCStatus]);
  
  // Re-check KYC status when user returns to window (e.g., from browser back)
  useEffect(() => {
    const handleWindowFocus = () => {
      if (isAuthenticated) {
        checkKYCStatus();
      }
    };
    
    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [isAuthenticated, checkKYCStatus]);


  // Get completed steps as string array
  const getCompletedStepLabels = (): string[] => {
    if (!status) return [];
    
    const stepsWithStatus = getKYCStepsWithStatus(status);
    return stepsWithStatus
      .filter(step => step.completed)
      .map(step => step.label);
  };

  // Get next step information
  const getNextStepInfo = () => {
    const nextStep = getNextIncompleteStep();
    const stepsWithStatus = getKYCStepsWithStatus(status);
    const stepInfo = stepsWithStatus.find(step => step.step === nextStep);
    
    return {
      stepNumber: nextStep,
      stepName: stepInfo?.label || `Step ${nextStep}`,
      isComplete: isKYCComplete(), // Use the proper KYC completion check
    };
  };

  // Handle modal actions
  const handleCloseModal = () => {
    // Temporarily hide modal - it will reappear when status is rechecked
    setModalType('none');
  };

  const handleProceedToKYC = () => {
    // Temporarily hide modal - it will reappear when status is rechecked
    setModalType('none');
    // Navigation will be handled by the component using this hook
  };

  const handleContinueKYC = () => {
    // Set current step to the next incomplete step
    const nextStep = getNextIncompleteStep();
    setCurrentStep(nextStep);
    // Temporarily hide modal - it will reappear when status is rechecked
    setModalType('none');
    // Navigation will be handled by the component using this hook
  };

  // Force refresh KYC status (useful after completing a step)
  const refreshKYCStatus = async () => {
    await checkKYCStatus();
  };

  return {
    // State
    kycStatus: status,
    currentStep,
    modalType,
    isLoading,
    hasCheckedStatus,
    
    // Computed values
    isKYCComplete: isKYCComplete(),
    shouldShowModal: shouldShowModal(),
    completedSteps: getCompletedStepLabels(),
    nextStepInfo: getNextStepInfo(),
    
    // Actions
    checkKYCStatus,
    refreshKYCStatus,
    handleCloseModal,
    handleProceedToKYC,
    handleContinueKYC,
    setModalType,
    setCurrentStep,
  };
};

// Hook specifically for checking if user should see KYC modal
export const useKYCModal = () => {
  const kyc = useKYC();
  
  // Show modal only when we have checked the API and it says we should show modal
  const showModal = kyc.hasCheckedStatus && kyc.shouldShowModal !== 'none';
  
  // Always use the calculated shouldShowModal as the modal type
  const modalType = kyc.shouldShowModal;
  
  return {
    showModal,
    modalType,
    isLoading: kyc.isLoading,
    handleCloseModal: kyc.handleCloseModal,
    handleProceedToKYC: kyc.handleProceedToKYC,
    handleContinueKYC: kyc.handleContinueKYC,
    completedSteps: kyc.completedSteps,
    nextStepInfo: kyc.nextStepInfo,
  };
};

// Hook for KYC page to handle step navigation
export const useKYCNavigation = () => {
  const kyc = useKYC();
  
  return {
    currentStep: kyc.currentStep,
    kycStatus: kyc.kycStatus,
    setCurrentStep: kyc.setCurrentStep,
    refreshKYCStatus: kyc.refreshKYCStatus,
    isKYCComplete: kyc.isKYCComplete,
  };
};