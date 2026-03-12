import axios from '@/lib/axiosInstance';
import type { SavingFormData, WithdrawAmountFormData } from '@/schemas/savingsPlanSchema';
import type { DashboardCharts } from '@/types/dashboard';
import type { SavingMonthlyCharts, SavingPlan } from '@/types/savingType';

export const savingService = {
    getYearlySavingStats: async () : Promise<DashboardCharts> => {
        const response = await axios.get('savings/monthly-transactions', {
            params: { year: new Date().getFullYear() }
        })
        return response.data
    },

    getMonthlySavingStats: async () : Promise<SavingMonthlyCharts> => {
        const response = await axios.get('savings/monthly-savings', {
            params: { 
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
             }
        })
        return response.data
    },

    createSavingPlan: async (data : SavingFormData) => {
        const response = await axios.post('savings/create-saving-plan', data)
        return response.data
    },

    getSavingPlans: async () : Promise<SavingPlan[]> => {
        const response = await axios.get('/savings/my-plans')
        return response.data.data
    },

    cancelSavingPlan: async (data: {saving_id: number}) => {
        const response = await axios.post(`/savings/terminate-saving-plan`, data)
        return response.data
    },

    partialWithdraw: async (data:{saving_id: number, amount: number}) => {
        const response = await axios.post("/savings/partial-withdrawal", data);
        return response.data
    },

    withdrawalOtp: async (data: WithdrawAmountFormData) => {
        const response = await axios.post("/user/request-withdrawal-otp", data)
        return response.data
    },

    submitWithdrawalRequest: async (data: {otp: string}) => {
        const response = await axios.post("/user/wallet-withdrawal", data)
        return response.data
    }


}
