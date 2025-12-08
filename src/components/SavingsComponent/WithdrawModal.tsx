import { useState } from "react"
import BaseModal from "./WithdrawalSteps/BaseModal"
import WithdrawForm from "./WithdrawalSteps/WithdrawForm"
import OtpVerification from "./WithdrawalSteps/OtpVerification"
import { useAuthStore } from "@/store/authStore"
import { useResendWithdrawalOtp, useSendWithdrawalOtp } from "@/hooks/useSaving"
import type { WithdrawAmountFormData } from "@/schemas/savingsPlanSchema"

type WithdrawModalProps ={
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const WithdrawModal = ({isOpen, onClose, onSuccess}: WithdrawModalProps) => {
    const [step, setStep] = useState("form")
    const [otpError, setOtpError] = useState("")
    const [amount, setAmount] = useState<WithdrawAmountFormData | null>(null)


    const {user} = useAuthStore()
    const {mutate, isPending} = useSendWithdrawalOtp(() => {
            onSuccess()
        },
        (msg) => setOtpError(msg)
    )

    const {mutate: resendOTP, isPending:isResending} = useResendWithdrawalOtp();

    const handleClose = () => {
        setStep("form");
        setOtpError("");
        setAmount(null);
        onClose()
    }

    const handleProceed = (data:WithdrawAmountFormData) => {
        setAmount(data);
        setStep("otp")
    }

    const handleResendOtp = () => {
        if(!amount) return;
        resendOTP(amount, {
            onSuccess: () => {
                setOtpError("");
            },
            // onError: (error: any) => {
            //     setOtpError(error.response.data.message || "Failed to resend OTP. Please try again");
            // }
            onError: (error: unknown) => {
                const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
                setOtpError(errorMessage || "Failed to resend OTP. Please try again");
            }
        })
    }

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose}>
            {step === "form" && (
                <WithdrawForm onProceed={handleProceed}/>
            )}
            {step === "otp" && (
                <OtpVerification 
                    phone={user?.phone?.replace(/(\d{3})\d+(?=\d{4})/, "$1****")}
                    onVerify={(code) => mutate({otp: code})}
                    error={otpError}
                    isPending={isPending}
                    isResending={isResending}
                    onResend={handleResendOtp}
                    onClearError={() => setOtpError("")}
                />
            )}

        </BaseModal>
    )
}
export default WithdrawModal

