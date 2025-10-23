import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";
import clsx from "clsx";
import CompleteKYCModal from "../KYC/KYCRequiredModal";
import KYCContinueModal from "../KYC/KYCContinueModal";
import KYCPendingModal from "../KYC/KYCPendingModal";
import { useLogout } from "@/hooks/useAuth";
import { Toaster } from "../ui/sonner";
import { useKYCModal } from "@/hooks/useKYC";

const DashboardLayout = () => {
    const logout = useLogout();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Use KYC modal hook for managing KYC state
    const {
        showModal,
        modalType,
        handleCloseModal,
        handleProceedToKYC,
        handleContinueKYC,
        completedSteps,
        nextStepInfo,
    } = useKYCModal();

    const handleKYCClose = () => {
        handleCloseModal();
        logout.mutate();
        navigate("/user/dashboard");
    }

    const handleKYCProceed = () => {
        console.log("Proceed to KYC");
        handleProceedToKYC();
        navigate("/user/kyc");
    }
    
    const handleKYCContinue = () => {
        console.log("Continue KYC from step:", nextStepInfo.stepNumber);
        handleContinueKYC();
        navigate("/user/kyc");
    }

    const toggleSidebar = () =>{
        setIsSidebarOpen(!isSidebarOpen);
    }

    const closeSidebar = () =>{
        setIsSidebarOpen(false);
    }

    const sidebarStyle= clsx(
        "fixed inset-y-0 left-0 z-50 lg:hidden",
        "transform transition-transform duration-300 ease",
        isSidebarOpen? "translate-x-0" : "-translate-x-full"
    )

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <Sidebar onClick={closeSidebar}/>
            </div>

            {/* Mobile sidebar*/}       
            <div className={sidebarStyle}>
                <Sidebar onClick={closeSidebar} />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-x-hidden" >
                <Header onMenuToggle={toggleSidebar} />
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto" onClick={closeSidebar}>
                    <div className=" max-w-[1440px] mx-auto">
                        <Outlet /> 
                    </div>
                </main>
            </div>
            
            {/* KYC Modals */}
            <CompleteKYCModal 
                isOpen={showModal && modalType === 'required'}
                onClose={handleKYCClose}
                onProceed={handleKYCProceed}
            />
            
            <KYCContinueModal 
                isOpen={showModal && modalType === 'continue'}
                onClose={handleKYCClose}
                onContinue={handleKYCContinue}
                nextStepName={nextStepInfo.stepName}
                completedSteps={completedSteps}
            />
            
            <KYCPendingModal 
                isOpen={showModal && modalType === 'pending'}
                onClose={handleKYCClose}
            />

            {/* ✅ Global Toaster (for protected routes only) */}
            <Toaster richColors position="top-right" />

        </div>
    )
}
export default DashboardLayout;
