import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KYCStatusData, KYCModalType, KYCState, KYCStep } from '@/types/kycType';
import { kycService } from '@/services/kycService';

type KYCStore = KYCState & {
  checkKYCStatus: () => Promise<void>;
  setModalType: (modalType: KYCModalType) => void;
  setCurrentStep: (step: number) => void;
  resetKYCState: () => void;
  getNextIncompleteStep: () => number;
  isKYCComplete: () => boolean;
  isKYCPendingApproval: () => boolean;
  shouldShowModal: () => KYCModalType;
}

const initialState: KYCState = {
  status: null,
  currentStep: 1,
  modalType: 'none',
  isLoading: false,
  hasCheckedStatus: false,
};


const KYC_STEPS: KYCStep[] = [
  { step: 1, name: 'nin', label: 'NIN', completed: false, verificationType: 'immediate' },
  { step: 2, name: 'bvn', label: 'BVN', completed: false, verificationType: 'immediate' },
  { step: 3, name: 'valid_id_card', label: 'Valid ID Card', completed: false, verificationType: 'admin-approval' },
  { step: 4, name: 'proof_of_address', label: 'Address', completed: false, verificationType: 'admin-approval' },
  { step: 5, name: 'live_face_verification', label: 'Face Recognition', completed: false, verificationType: 'immediate' },
];

export const useKYCStore = create<KYCStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      checkKYCStatus: async () => {
        set({ isLoading: true });
        
        try {
          const response = await kycService.getKYCStatus();
          
          if (!response.success) {
            set({
              status: null,
              currentStep: 1,
              modalType: 'required',
              isLoading: false,
              hasCheckedStatus: true,
            });
            return;
          }

          if (typeof response.data === 'string') {
            set({
              status: null,
              currentStep: 1,
              modalType: 'required',
              isLoading: false,
              hasCheckedStatus: true,
            });
            return;
          }

          const kycData = response.data as KYCStatusData;
          
          set({ status: kycData });
          
          const nextStep = get().getNextIncompleteStep();
          const isComplete = get().isKYCComplete();
          
          let modalType: KYCModalType = 'none';
          const isPendingApproval = get().isKYCPendingApproval();
          
          if (isPendingApproval) {
            modalType = 'pending'; 
          } else if (!isComplete) {
            modalType = nextStep === 1 ? 'required' : 'continue';
          }

          set({
            currentStep: nextStep,
            modalType,
            isLoading: false,
            hasCheckedStatus: true,
          });

        } catch (error) {
          console.error('Error checking KYC status:', error);
          set({
            status: null,
            currentStep: 1,
            modalType: 'required',
            isLoading: false,
            hasCheckedStatus: true,
          });
        }
      },

      setModalType: (modalType) => set({ modalType }),

      setCurrentStep: (step) => set({ currentStep: step }),

      resetKYCState: () => set(initialState),

      getNextIncompleteStep: () => {
        const { status } = get();
        if (!status) return 1;

        for (const step of KYC_STEPS) {
          if (status[step.name] !== 'verified') {
            return step.step;
          }
        }
        return 6; 
      },

      isKYCComplete: () => {
        const { status } = get();
        if (!status) return false;

        const requiredSteps = KYC_STEPS.slice(0, 5); 
        const allStepsVerified = requiredSteps.every(step => status[step.name] === 'verified');
        const adminApproved = status.admin_approval_status === 'verified';
        
        return allStepsVerified && adminApproved;
      },

      isKYCPendingApproval: () => {
        const { status } = get();
        if (!status) return false;

        const requiredSteps = KYC_STEPS.slice(0, 5); 
        const allStepsVerified = requiredSteps.every(step => status[step.name] === 'verified');
        const adminPending = status.admin_approval_status === 'pending';
        
        return allStepsVerified && adminPending;
      },

      shouldShowModal: () => {
        const { status, hasCheckedStatus } = get();
        
        if (!hasCheckedStatus) {
          return 'none'; 
        }

        if (!status) {
          return 'required'; 
        }

        const nextStep = get().getNextIncompleteStep();
        const isComplete = get().isKYCComplete();
        const isPendingApproval = get().isKYCPendingApproval();

        if (isPendingApproval) {
          return 'pending'; 
        }
        
        if (isComplete) {
          return 'none'; 
        }

        return nextStep === 1 ? 'required' : 'continue';
      },
    }),
    {
      name: 'megacoop-kyc',
      partialize: (state) => ({
        status: state.status,
        currentStep: state.currentStep,
      }),
    }
  )
);

export const getKYCStepInfo = (stepNumber: number): KYCStep | undefined => {
  return KYC_STEPS.find(step => step.step === stepNumber);
};

export const getKYCStepsWithStatus = (status: KYCStatusData | null): KYCStep[] => {
  return KYC_STEPS.map(step => {
    const stepStatus = status ? status[step.name] : 'not verified';
    const isVerified = stepStatus === 'verified';
    
    const shouldShowPending = step.verificationType === 'admin-approval' && isVerified;
    
    return {
      ...step,
      completed: isVerified,
      isPending: shouldShowPending,
      status: stepStatus,
    };
  });
};

export const updateStepStatusAfterSuccess = (
  verificationType: 'immediate' | 'admin-approval'
) => {
  
  if (verificationType === 'immediate') {
    // For immediate steps, the step is truly verified
    return { completed: true, isPending: false };
  } else {
    return { completed: true, isPending: true };
  }
};
