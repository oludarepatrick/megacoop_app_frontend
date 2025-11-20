import { useState } from "react"
import BaseModal from "./WithdrawalSteps/BaseModal"
import WithdrawForm from "./WithdrawalSteps/WithdrawForm"
import OtpVerification from "./WithdrawalSteps/OtpVerification"

type WithdrawModalProps ={
    isOpen: boolean
    onClose: () => void
}

const WithdrawModal = ({isOpen, onClose}: WithdrawModalProps) => {
    const [step, setStep] = useState("form")

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            {step === "form" && (
                <WithdrawForm onProceed={()=> setStep("otp")}/>
            )}
            {step === "otp" && (
                <OtpVerification 
                    phone="07055****89"
                    onVerify={()=>{}}
                    isPending={false}

                />
            )}

        </BaseModal>
    )
}
export default WithdrawModal

