export type WalletTransaction= {
    id: number;
    user_id: number
    type: "credit" | "debit";
    balance_b4: string
    amount: string;
    reference: string
    description: string;
    status: "approved" | "pending" | "rejected";
    created_at: string;
    updated_at: string
}
