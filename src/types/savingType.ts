export type SavingPlan = {
    id: number
    goal_name: string
    purpose: string
    target_amount: number
    total_saved: number
    frequency: string
    amount_saved: number
    saving_status: string
    created_at: string
    updated_at: string
    transactions: SavingsTransactions

}[]

export type SavingsTransactions = {
    id: number
    saving_id: number
    user_id: number
    type: string
    balance_b4: string
    amount: string
    status: string
    next_due_date: string
    payment_method: null
    reference: string
    description: string
    created_at: string
    updated_at: string
}[]