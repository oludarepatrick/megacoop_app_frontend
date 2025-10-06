import elips from "@/assets/elips-bcg.svg"
import { KYCNIN } from "@/components/KYC/NINVerification";
import { KYCBVN } from "@/components/KYC/BVNVerification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { useState } from "react";
import { IDUPload } from "@/components/KYC/IDUploadVerification";
import { AddressUpload } from "@/components/KYC/AddressVerification";
import { FaceVerification } from "@/components/KYC/FaceVerification";
import KYCSuccessModal from "@/components/KYC/KYCSuccessModal";
import { useNavigate } from "react-router-dom";


const steps = [
    { label: "NIN" },
    { label: "BVN" },
    { label: "Valid ID Card", isPending: true  },
    { label: "Address", isPending: true  },
    { label: "Face Recognition" },
]
const KYCVerification = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isComplete, setIsComplete] = useState(false);
    const navigate = useNavigate();

    const handleNextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
    const handleLastStep= () => {
        setIsComplete(true);
    }

    const handleCloseSucessModal = () => {
        setIsComplete(false)
        navigate("/user/dashboard");
    }
   

    const renderSteps = () =>{
        switch(currentStep) {
            case 1: return <KYCNIN onSuccess={handleNextStep}/>
            case 2: return <KYCBVN onSuccess={handleNextStep}/>
            case 3: return <IDUPload onSuccess={handleNextStep}/>
            case 4: return <AddressUpload onSuccess={handleNextStep} />
            case 5: return <FaceVerification onSuccess={handleLastStep}/>
        }
    }
    
    return (
        <section className="min-h-screen sm:flex font-poppins relative">
            <div className="flex-1 flex flex-col justify-between items-center px-8 pt-10 pb-10 relative z-10">
                <header>
                    {/* <img src="/Logo.svg" alt="megacoop-logo" /> */}
                </header>
                <Card className="w-full max-w-[627px] p-8 shadow-lg pb-14">
                    <CardHeader className="justify-center mb-4 text-center px-0 ">
                        <div className="mx-auto">
                            <img src="/Logo.svg" alt="megacoop-logo" className="h-14" />
                        </div>
                        <CardTitle className="text-2xl font-semibold mb-2 text-green-900">
                            KYC Verification Wizard
                        </CardTitle>
                        <CardDescription className="text-xs font-medium -mt-3 text-green-900">Ensure you provide the correct Information required</CardDescription>
                    </CardHeader>
                    <CardContent className=" px-0 sm:px-6">
                        <Stepper steps={steps} currentStep={currentStep} />
                        {renderSteps()}
                    </CardContent>
                </Card>
                <footer>
                    <p className="text-sm">
                        KYC Secured by <span className="text-megagreen font-semibold">
                            Mega<span className="text-black">Coop</span>
                        </span>
                    </p>
                </footer>
            </div>
            <div 
                className="absolute bottom-0 right-0 w-80 h-80 z-[-1]"
                style={{
                    backgroundImage: `url("${elips}")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'bottom right'
                }}
            />

            {isComplete && <KYCSuccessModal isOpen={true} onClose={handleCloseSucessModal} />}
        </section>
    )
}

export default KYCVerification;
