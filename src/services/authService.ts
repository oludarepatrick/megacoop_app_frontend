import axios from '@/lib/axiosInstance';
import { formConfig, jsonConfig } from '@/common/utils';
import type {
    AccessCodeFormData,
    FinalSubmitData,
    CombinedAccessCodeData
} from '@/schemas/authSchemas';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.schooldrive.com.ng/api/v1/';

export const authService = {
    verifyAccessCode: async (accessCode: AccessCodeFormData) => {
        const response = await axios.post(`${API_BASE_URL}user/validate-code`, accessCode );
        return response.data;
    },

    sendEmailVerification: async (email: string) => {
        const formData = new FormData();
        formData.append('email', email);
        const response = await axios.post(`${API_BASE_URL}user/send-email-verification-token`, formData, formConfig);
        return response.data;
    },

    sendPhoneVerification: async (phone: string) => {
        const formData = new FormData();
        formData.append('phone', phone);
        const response = await axios.post(`${API_BASE_URL}user/send-phone-verification-otp`, formData, formConfig);
        return response.data;
    },

    resendCode: async (type: 'email' | 'phone', email?: string, phone?: string) => {
        const endpoint = type === 'email' ? `${API_BASE_URL}user/send-email-verification-token` : `${API_BASE_URL}user/send-phone-verification-otp`;
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
        const response = await axios.post(`${API_BASE_URL}user/complete-signup`, finalData, jsonConfig);
        return response.data;
    },

    verifyEmailCode: async (code: string, email: string) => {
        const formData = new FormData();
        formData.append('token', code);
        formData.append('email', email);
        const response = await axios.post(`${API_BASE_URL}user/verify-email`, formData, formConfig);
        return response.data;
    },

    verifyPhoneCode: async (code: string, phone: string) => {
        const formData = new FormData();
        formData.append('token', code);
        formData.append('phone', phone);
        const response = await axios.post(`${API_BASE_URL}user/verify-phone`, formData, formConfig);
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

        const response = await axios.post(`${API_BASE_URL}user/send-login-verification-otp`, formData, formConfig);
        console.log('Response from send-login-verification-otp:', response);
        return response.data;
    },

    verifyLoginOtp: async (email: string, otp: string) => {
        const formData = new FormData();
        formData.append('token', otp);
        formData.append('email', email);
        const response = await axios.post(`${API_BASE_URL}user/verify-login-otp`, formData, formConfig);
        return response.data;
    },

    logout: async (): Promise<void> => {
        const response = await axios.get("/user/logout")
        return response.data
    }
};
