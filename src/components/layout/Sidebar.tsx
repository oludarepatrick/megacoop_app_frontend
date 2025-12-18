import clsx from "clsx";
import { Settings, X, ChevronDown, CircleDollarSign, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import walletIcon from "../../assets/wallet-icon.svg"
// import messageIcon from "../../assets/message-icon.svg"
import profileIcon from "../../assets/profile-icon.svg"
import helpIcon from "../../assets/help-icon.svg"
import moonIcon from "../../assets/moon-icon.svg"
import { Switch } from "../ui/switch";
import { useThemeStore } from "@/store/themeStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import PageLoader from "../PageLoader";


type menuProps={
    onClick: () => void
}

const Sidebar = ({onClick}:menuProps) => {
    const {theme, toggleTheme} = useThemeStore()
    const user = useAuthStore(state => state.user);
    const logout = useLogout();

    const activeClass= ({isActive}:{isActive: boolean}) =>
        clsx("flex gap-3 cursor-pointer", {
        "text-megagreen bg-main-bg p-3 rounded-lg": isActive,
        "text-white": !isActive,
    });

    const handleLogout= () => {
        logout.mutate();
    }

    return (
        <aside className="w-[306px] h-full bg-megaPrimary text-white  rounded-br-lg  pt-20 px-12 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative">
            <Button 
                variant="ghost" 
                className="hover:bg-transparent lg:hidden absolute top-4 right-10"
                onClick={onClick}
            >
                <X className="text-whitebg !w-8 !h-8" />
            </Button>
            <nav className="font-jakarta flex flex-col gap-8">
                <NavLink to="dashboard" className={activeClass}>
                    <LayoutGrid /> Dashboard
                </NavLink>

                <NavLink to="savings-loan" className={activeClass}>
                    <img src={walletIcon} alt="" aria-hidden="true" />
                    Savings & Loan
                </NavLink>

                <NavLink to="investment" className={activeClass}>
                    <CircleDollarSign /> Invest
                </NavLink>

                <NavLink to="market-place" className={activeClass}>
                    <img src={walletIcon} alt="" aria-hidden="true" />
                    Market place
                </NavLink>

                <NavLink to="profile" className={activeClass}>
                    <img src={profileIcon} alt="" aria-hidden="true" />
                    Profile
                </NavLink>

                <NavLink to="settings" className={activeClass}>
                    <Settings /> Settings
                </NavLink>

                <hr/>
                {/* <div className="flex gap-3 cursor-pointer">
                    <ShieldCheck /> Security
                    </div> */}

                <NavLink to="help" className={activeClass}>
                    <img src={helpIcon} alt="" aria-hidden="true" />
                    Help
                </NavLink>
                <div className="flex items-center justify-between gap-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <img src={moonIcon} alt="" aria-hidden="true" />
                        Dark Mode
                    </div>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                </div>

                {/* user profile */}
                
                <div className="flex items-center justify-between gap-3 pt-30 pb-10 ">
                    <div className="border-white/20 pt-4 pb-6">
                        <div className="flex items-center space-x-3 mb-4 font-jakarta">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={user?.avatar || ""} alt="" />
                                <AvatarFallback className="font-medium">
                                    {/* {getInitials()} */}dd
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-lg font-bold truncate">
                                    {user?.first_name} 
                                    {/* { user?.last_name} */}
                                </p>
                                <p className="text-xs text-white/70 truncate">
                                    { user?.email }
                                </p>
                            </div>
                            <ChevronDown/>
                        </div>
                                
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            disabled={logout.isPending}
                            className="w-full justify-start text-white hover:text-red-500 font-jakarta cursor-pointer disabled:opacity-50"
                        >
                            {logout.isPending ? (
                                <>
                                    <PageLoader />
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <LogOut className="!w-6 !h-6 mr-3" />
                                    Logout
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </nav>           
        </aside>
    )
}

export default Sidebar;
