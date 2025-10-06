import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";
import clsx from "clsx";
import CompleteKYCModal from "../KYC/KYCRequiredModal";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";

const DashboardLayout = () => {
    const user = useAuthStore((state) => state.user)
    const logout = useLogout();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const kycStatus = user?.kyc_status; 
    const [isKYCModalOpen, setIsKYCModalOpen] = useState(!kycStatus);


    const navigate = useNavigate();

    const handleKYCClose = () => {
        setIsKYCModalOpen(false);
        logout.mutate();
    }

    const handleKYCProceed = () => {
        console.log("Proceed to KYC");
        setIsKYCModalOpen(false);
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
            {/* KYC Modal */}
            <CompleteKYCModal 
                isOpen={isKYCModalOpen}
                onClose={handleKYCClose}
                onProceed={handleKYCProceed}
            />

        </div>
    )
}
export default DashboardLayout;
