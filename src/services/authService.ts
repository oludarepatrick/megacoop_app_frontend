import axios from '@/lib/axiosInstance';
import { formConfig, jsonConfig } from '@/common/utils';
import type {
    AccessCodeFormData,
    FinalSubmitData,
    CombinedAccessCodeData
} from '@/schemas/authSchemas';

export const authService = {
    verifyAccessCode: async (accessCode: AccessCodeFormData) => {
        const response = await axios.post('/validate-code', { code: accessCode });
        return response.data;
    },

    sendEmailVerification: async (email: string) => {
        const formData = new FormData();
        formData.append('email', email);
        const response = await axios.post('/send-email-verification-token', formData, formConfig);
        return response.data;
    },

    sendPhoneVerification: async (phone: string) => {
        const formData = new FormData();
        formData.append('phone', phone);
        const response = await axios.post('/send-phone-verification-otp', formData, formConfig);
        return response.data;
    },

    resendCode: async (type: 'email' | 'phone', email?: string, phone?: string) => {
        const endpoint = type === 'email' ? '/send-email-verification-token' : '/send-phone-verification-otp';
        const formData = new FormData();
        if (type === 'email' && email) {
            formData.append('email', email);
        } else if (type === 'phone' && phone) {
            formData.append('phone', phone);
        }
        const response = await axios.post(endpoint, formData, formConfig);
        return response.data;
    },

    submitSignUpData: async (data: FinalSubmitData, userProfileDetails: CombinedAccessCodeData | null) => {
        const finalData = {
            ...data,
            code: userProfileDetails?.code,
            email: userProfileDetails?.email,
        };
        console.log("submitSignUpData finalData", finalData);
        const response = await axios.post('/complete-signup', finalData, jsonConfig);
        return response.data;
    },

    verifyEmailCode: async (code: string, email: string) => {
        const formData = new FormData();
        formData.append('token', code);
        formData.append('email', email);
        const response = await axios.post('/verify-email', formData, formConfig);
        return response.data;
    },

    verifyPhoneCode: async (code: string, phone: string) => {
        const formData = new FormData();
        formData.append('token', code);
        formData.append('phone', phone);
        const response = await axios.post('/verify-phone', formData, formConfig);
        return response.data;
    },

    sendLoginEmailVerification: async (email: string, password: string) => {
        console.log('sendLoginEmailVerification called with:', { email, passwordLength: password.length });
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        
        console.log('FormData contents for email verification:');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        const response = await axios.post('/send-login-verification-otp', formData, formConfig);
        return response.data;
    },

    verifyLoginOtp: async (email: string, otp: string) => {
        const formData = new FormData();
        formData.append('token', otp);
        formData.append('email', email);
        const response = await axios.post('/verify-login-otp', formData, formConfig);
        return response.data;
    },

    logout: async (): Promise<void> => {
        const response = await axios.get("/logout")
        return response.data
    }
};
