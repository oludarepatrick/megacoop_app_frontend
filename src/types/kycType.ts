export type KYCStatus = 'verified' | 'not verified' | 'pending';

export type KYCStatusData = {
    nin: KYCStatus;
    bvn: KYCStatus;
    valid_id_card: KYCStatus;
    proof_of_address: KYCStatus;
    live_face_verification: KYCStatus;
    admin_approval_status: KYCStatus;
}

export type KYCStatusResponse = {
    success: boolean;
    message: string;
    data: KYCStatusData | string;
}

export type KYCStep = {
    step: number;
    name: keyof KYCStatusData;
    label: string;
    completed: boolean;
    isPending?: boolean;
    status?: KYCStatus;
    verificationType?: 'immediate' | 'admin-approval';
}

export type KYCModalType = 'none' | 'required' | 'continue' | 'success' | 'pending';

export type KYCState = {
    status: KYCStatusData | null;
    currentStep: number;
    modalType: KYCModalType;
    isLoading: boolean;
    hasCheckedStatus: boolean;
}
