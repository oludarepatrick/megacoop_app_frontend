import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";
import clsx from "clsx";

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                <main className="flex-1 p-4 sm:p-6" onClick={closeSidebar}>
                    <div className=" max-w-[1440px] mx-auto">
                        <Outlet /> 
                    </div>
                </main>
            </div>
        </div>
    )
}
export default DashboardLayout;
