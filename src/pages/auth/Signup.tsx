// pages/SignUpLoginPage.tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthCarousel from '@/components/AuthCarousel';
import AuthForm from '@/components/AuthForm';
// import AuthCarousel from '../../components/AuthCarousel';
// import AuthForm from '../../components/AuthForm';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SuccessIcon from '../../assets/signup_successfull_icon.png';
import ErrorIcon from '../../assets/Error_icon.png';
import SuccessfulSignUpBg from '../../assets/signup_success_background_img.png';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://34.56.64.14/api/v1/';


const SignUpLoginPage = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<string>(location.pathname === '/login' ? 'login' : 'signup');
    const [signUpStep, setSignUpStep] = useState(1);
    const [loginStep, setLoginStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
    const [imgHeight, setImgHeight] = useState<number | undefined>(undefined);
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("09025697028");
    const [loginEmail, setLoginEmail] = useState("");

    useEffect(() => {
        setActiveTab(location.pathname === "/login" ? "login" : "signup");
    }, [location.pathname]);

    const handleError = (message: string) => {
        setErrorMessage(message);
        setShowErrorModal(true);
    };

    const handleProceed = () => {
        setShowSuccessModal(false);
        setSignUpStep(2);
    };

    const handleStartJourney = () => {
        setSignUpStep(1);
        setActiveTab("login");
    };

    return (
        <div className="flex flex-row justify-between items-center bg-transparent px-4 overflow-hidden relative">
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute -bottom-50 right-[-120px] h-[300px] w-[300px] rounded-full bg-transparent border-[60px] border-[#0F7033] opacity-50 z-0"
            />

            <AuthCarousel
                imgHeight={imgHeight}
                onImgHeightChange={setImgHeight}
            />

            <AuthForm
                activeTab={activeTab}
                onTabChange={setActiveTab}
                signUpStep={signUpStep}
                onSignUpStepChange={setSignUpStep}
                loginStep={loginStep}
                onLoginStepChange={setLoginStep}
                userEmail={userEmail}
                userPhone={userPhone}
                loginEmail={loginEmail}
                onError={handleError}
                onUserEmailChange={setUserEmail}
                onUserPhoneChange={setUserPhone}
                onLoginEmailChange={setLoginEmail}
                API_BASE_URL={API_BASE_URL}
                imgHeight={imgHeight}
            />

            {/* Success Modal */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="w-[310px] max-w-[310px]">
                    <img src={SuccessIcon} alt="Success" className="relative top-[-48px] w-12 h-12 mx-auto" />
                    <DialogHeader>
                        <DialogTitle className="text-green-600 mx-auto mb-4">Verification Successful!</DialogTitle>
                        <DialogDescription className="text-green-600 mx-auto mb-4 text-center">
                            Click on proceed to move to the next step.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex align-center justify-center sm:flex-col space-y-2">
                        <Button onClick={handleProceed} className="bg-green-600 hover:bg-green-700">
                            Proceed
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Error Modal */}
            <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
                <DialogContent className="w-[310px] max-w-[310px]">
                    <img src={ErrorIcon} alt="Error" className="relative top-[-45px] w-12 h-12 mx-auto" />
                    <DialogHeader>
                        <DialogTitle className="text-red-600 mx-auto mb-4">Verification Error!</DialogTitle>
                        <DialogDescription className="text-red-600 mx-auto mb-4 text-center">
                            {errorMessage || "Please contact admin or try again later."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex align-center justify-center sm:flex-col space-y-2">
                        <Button onClick={() => setShowErrorModal(false)}>Try Again</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Congratulations Modal */}
            <Dialog open={showCongratulationsModal} onOpenChange={setShowCongratulationsModal}>
                <DialogContent
                    className="w-[310px] max-w-[310px] h-[310px] rounded-lg shadow-lg bg-cover bg-center"
                    style={{ backgroundImage: `url('${SuccessfulSignUpBg}')` }}
                >
                    <DialogHeader></DialogHeader>
                    <DialogFooter className="flex align-center justify-center sm:flex-col space-y-2">
                        <Button onClick={handleStartJourney} className="bg-green-600 hover:bg-green-700 mb-[-10px] md:mb-10">
                            Let's Start
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SignUpLoginPage;




