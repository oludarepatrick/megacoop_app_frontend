import axios from '@/lib/axiosInstance';
import type { SavingFormData } from '@/schemas/savingsPlanSchema';
import type { SavingPlan } from '@/types/savingType';

export const savingService = {
    createSavingPlan: async (data : SavingFormData) => {
        const response = await axios.post('savings/create-saving-plan', data)
        return response.data
    },

    getSavingPlans: async () : Promise<SavingPlan> => {
        const response = await axios.get('/savings/my-plans')
        return response.data.data
    }

}
