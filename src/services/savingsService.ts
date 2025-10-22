import axios from '@/lib/axiosInstance';
import type { SavingFormData } from '@/schemas/savingsPlanSchema';

export const savingService = {
    createSavingPlan: async (data : SavingFormData) => {
        const response = await axios.post('savings/create-saving-plan', data)
        return response.data
    },

    getSavingPlans: async() => {
        const response = await axios.post('/savings/my-plans')
        return response.data;
    }

}
