import axios from '@/lib/axiosInstance';
import { jsonConfig } from '@/common/utils';
import { type AccountInfoFormData } from '@/schemas/profileSchema';

export const submitUserAccountInfo = async (data: AccountInfoFormData) => {
        const response = await axios.post('/user/submit-user-bank-account', data, jsonConfig);
        console.log("submitUserAccountInfo response:", response);
    return response.data;
};

export const fetchAccountInfo = async (): Promise<AccountInfoFormData> => {
        const response = await axios.get('/user/get-user-bank-account', jsonConfig);
        return response.data;   
};