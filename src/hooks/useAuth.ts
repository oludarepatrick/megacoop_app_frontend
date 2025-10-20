import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import type {
    FinalSubmitData,
    CombinedAccessCodeData
} from '@/schemas/authSchemas';

export const useVerifyAccessCode = (
    onSuccess: (data: CombinedAccessCodeData) => void,
    onError: (message: string) => void
) => {
    return useMutation({
        mutationFn: authService.verifyAccessCode,
        onSuccess: (response) => {
            console.log("response", response);
            onSuccess(response);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Invalid access code");
            console.log("error", error);
        },
    });
};

export const useSendEmailVerification = (
    onError: (message: string) => void
) => {
    return useMutation({
        mutationFn: authService.sendEmailVerification,
        onSuccess: () => {
            console.log("Email verification code sent successfully");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Error sending email verification code");
        },
    });
};

export const useSendLoginEmailVerification = (
    onError: (message: string) => void
) => {
    return useMutation({
        mutationFn: ({ email, password }: { email: string, password: string }) =>
            authService.sendLoginEmailVerification(email, password),
        onSuccess: (response) => {
            console.log("Login email verification code sent successfully", response);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Error sending login email verification code");
        },
    });
};

export const useSendPhoneVerification = (
    onError: (message: string) => void
) => {
    return useMutation({
        mutationFn: authService.sendPhoneVerification,
        onSuccess: () => {
            console.log("Phone verification code sent successfully");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Error sending phone verification code");
        },
    });
};

export const useResendCode = (
    onSuccess: (type: 'email' | 'phone') => void,
    onError: (message: string) => void
) => {
    return useMutation({
        mutationFn: ({ type, email, phone }: { type: 'email' | 'phone', email?: string, phone?: string }) =>
            authService.resendCode(type, email, phone),
        onSuccess: (_, variables) => {
            onSuccess(variables.type);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Error resending code");
        },
    });
};

export const useSubmitSignUpData = (
    onSuccess: () => void,
    onError: (message: string) => void
) => {
    return useMutation({
        mutationFn: ({ data, userProfileDetails }: { data: FinalSubmitData, userProfileDetails: CombinedAccessCodeData | null }) =>
            authService.submitSignUpData(data, userProfileDetails),
        onSuccess: (response) => {
            console.log("submitSignUpData response", response);
            onSuccess();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Error submitting information");
        },
    });
};

// Removed useLoginUser - login now happens through OTP verification

export const useVerifyEmailCode = (
    onSuccess: () => void,
    onError: (message: string) => void
) => {
    return useMutation({
        mutationFn: ({ code, email }: { code: string, email: string }) =>
            authService.verifyEmailCode(code, email),
        onSuccess: () => {
            onSuccess();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Invalid verification code");
        },
    });
};

export const useVerifyPhoneCode = (
    onSuccess: () => void,
    onError: (message: string) => void
) => {
    return useMutation({
        mutationFn: ({ code, phone }: { code: string, phone: string }) =>
            authService.verifyPhoneCode(code, phone),
        onSuccess: () => {
            console.log("Phone verified successfully");
            onSuccess();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Invalid verification code");
        },
    });
};

export const useVerifyLoginOtp = (
    onSuccess: () => void,
    onError: (message: string) => void
) => {
    const { login } = useAuthStore();
    
    return useMutation({
        mutationFn: ({ email, otp }: { email: string, otp: string }) =>
            authService.verifyLoginOtp(email, otp),
        onSuccess: (response) => {
            const { user, token } = response.data || {};
            if (user && token) {
                login(user, token);
            } else {
                console.error("MISSING DATA in response.data - User:", user, "Token:", token);
            }
            onSuccess();
        },
        onError: (error: AxiosError<{ message: string; data?: Record<string, string[]> }>) => {
            console.log("Login OTP error:", error.response?.data);
            if (error.response?.data?.data) {
                const validationErrors = error.response.data.data;
                const errorMessages = [];
                
                if (validationErrors.email) {
                    errorMessages.push(validationErrors.email.join(' '));
                }
                if (validationErrors.token || validationErrors.otp) {
                    errorMessages.push((validationErrors.token || validationErrors.otp).join(' '));
                }
                
                if (errorMessages.length > 0) {
                    onError(errorMessages.join(' '));
                    return;
                }
            }
            onError(error.response?.data?.message || "Invalid OTP code");
        },
    });
};

export const useResendLoginOtp = (
    onSuccess: () => void,
    onError: (message: string) => void
) => {
    return useMutation({
        mutationFn: ({ email, password }: { email: string, password: string }) =>
            authService.sendLoginEmailVerification(email, password),
        onSuccess: (response) => {
            console.log("Login OTP resent successfully", response);
            onSuccess();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Error resending login OTP");
        },
    });
};


export const useLogout = () => {
    const { logout: logoutFromStore, setIsLoading } = useAuthStore();
    
    return useMutation({
        mutationFn: async () => {
            setIsLoading(true);
            const result = await authService.logout();
            return result;
        },
        onSuccess: async () => {
            await logoutFromStore();
        },
        onError: (error: AxiosError<{message: string}>) => {
            console.error("🚨 Logout failed:", error);
            setIsLoading(false);
        }
    });
};
