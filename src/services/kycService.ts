import axios from "@/lib/axiosInstance";
import type { AddressFormData, BvnFormData, NinFormData, UploadIDFormData } from "@/schemas/kycSchema";
import type { KYCStatusResponse } from "@/types/kycType";

export const kycService = {
    //check kyc status
    getKYCStatus: async(): Promise<KYCStatusResponse> => {
        const response = await axios.get('/kyc/check-kyc-status'); 
        return response.data;
    },

    // submit NIN verification
    NINVerification: async (data: NinFormData) => {
        const response = await axios.post('/kyc/verify-nin', data)
        return response.data;
    },

    BVNVerification: async (data: BvnFormData) => {
        const response = await axios.post('/kyc/verify-bvn', data);
        return response.data;
    },

    // submit id card
    submitIDUpload: async (data: UploadIDFormData) => {
        const response = await axios.post('/kyc/submit-valid-idcard', data, {
            headers: { "Content-Type": "multipart/form-data"}
        });
        console.log(data)
        return response.data;
    },
    
    // submit id proof of address
    submitAddress: async (data: AddressFormData) => {
        const response = await axios.post('/kyc/verify-address', data, {
            headers: { "Content-Type": "multipart/form-data"}
        });
        return response.data;
    },

    //start face capturing
    startFaceCapturing: async () => {
        const response = await axios.post('/kyc/selfie/start');
        return response.data;
    },

    // stop face capturing
    sendFaceCapturing: async (data: string ) => {
        const response = await axios.post('/kyc/selfie/send', {image_data: data});
        return response.data;
    },
}
