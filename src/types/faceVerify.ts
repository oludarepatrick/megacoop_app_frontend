// Simplified face verification types
export type FaceVerificationStep = 'instructions' | 'camera' | 'captured' | 'complete';

export type FaceVerificationState = {
    step: FaceVerificationStep;
    capturedImage: string | null;
    isStarting: boolean;
    isSending: boolean;
};
