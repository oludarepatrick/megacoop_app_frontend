export type User = {
  id: string;
  email: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  avatar?: string;
  role?: string;
  kyc_status?: string | null;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  state?: string;
  city?: string;
  address?: string;
  amount?: number
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export interface AuthFormProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    signUpStep: number;
    onSignUpStepChange: (step: number) => void;
    loginStep: number;
    onLoginStepChange: (step: number) => void;
    userEmail: string;
    userPhone: string;
    loginEmail: string;
    setShowSuccessModal: (show: boolean) => void;
    onError: (message: string) => void;
    onUserEmailChange: (email: string) => void;
    onUserPhoneChange: (phone: string) => void;
    onLoginEmailChange: (email: string) => void;
    imgHeight?: number;
    setShowCongratulationsModal: (show: boolean) => void;
}
