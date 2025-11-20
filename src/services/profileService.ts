import axios from '@/lib/axiosInstance';
import { jsonConfig } from '@/common/utils';
import { type AccountInfoFormData } from '@/schemas/profileSchema';

export const submitUserAccountInfo = async (data: AccountInfoFormData) => {
        const response = await axios.post('/profile/account-info', data, jsonConfig);
    return response.data;
};

export const fetchAccountInfo = async (): Promise<AccountInfoFormData> => {
        const response = await axios.get('/profile/account-info');
        return response.data;   
};