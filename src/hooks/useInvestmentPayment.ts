import { useState, useEffect, useMemo } from "react";
import type { PooledFormData, HousingFormData } from "@/schemas/investSchema";

export const useInvestmentPayment = (investData: PooledFormData | HousingFormData, walletBalance: number) => {
    const getMinimumAmount = () => {
        const type = investData.investmentType;
        switch (type) {
            case "starter-pool": return 100000;
            case "growth-pool": return 500000;
            case "premium-pool": return 2000000;
            case "MoFi-housing-fund":
            case "NHF": return 50000;
            case "housing-project-investment": return 500000;
            default: return 100000;
        }
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
