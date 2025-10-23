import { useState, useEffect, useMemo } from "react";
import type { PooledFormData, HousingFormData, ApiInvestmentFormData } from "@/schemas/investSchema";

export const useInvestmentPayment = (
    investData: PooledFormData | HousingFormData | ApiInvestmentFormData, 
    walletBalance: number
) => {
    const getMinimumAmount = () => {
        // Handle pooled and housing investments
        if("sub_type" in investData && investData.sub_type){
            switch(investData.sub_type){
                // pooled investments
                case "starter-pool": return 100000;
                case "growth-pool": return 500000;
                case "premium-pool": return 2000000;
                // housing investments
                case "MoFi-housing-fund":
                case "NHF": return 50000;
                case "housing-project-investment": return 500000;
                // default: return 100000;
            }
        }

        if ('amount' in investData && investData.amount > 0) {
            return investData.amount; 
        }

        return 100000
        // // Check if it's an API investment (has investment_id instead of investmentType)
        // if ('investment_id' in investData) {
        //     return investData.amount; // API investments use the amount from schema as minimum
        // }
    };

    const minimumAmount = useMemo(() => getMinimumAmount(), [investData]);
    const [amount, setAmount] = useState(minimumAmount);
    const [error, setError] = useState("");

    const validateAmount = (val: number) => {
        if (val < minimumAmount) {
            setError(`Minimum investment amount is ₦${minimumAmount.toLocaleString()}`);
            return false;
        }
        setError("");
        return true;
    };

    const isEligible = walletBalance >= amount;
    
    const handleChange = (value: string) => {
        const num = parseFloat(value.replace(/,/g, ""));
        if (isNaN(num)) return;
        setAmount(num);
        validateAmount(num);
    };

    const increment = () => setAmount(prev => {
        const newVal = prev + 10000;
        validateAmount(newVal);
        return newVal;
    });

    const decrement = () => setAmount(prev => {
        const newVal = Math.max(minimumAmount, prev - 10000);
        validateAmount(newVal);
        return newVal;
    });

    useEffect(() => {
        setAmount(minimumAmount);
        setError("");
    }, [minimumAmount]);

    return { amount, setAmount, error, isEligible, increment, decrement, handleChange, minimumAmount, validateAmount };
};
