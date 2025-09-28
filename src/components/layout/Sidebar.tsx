import clsx from "clsx";
import { Settings, X, ShieldCheck, ChevronDown, CircleDollarSign } from "lucide-react";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import walletIcon from "../../assets/wallet-icon.svg"
import messageIcon from "../../assets/message-icon.svg"
import profileIcon from "../../assets/profile-icon.svg"
import helpIcon from "../../assets/help-icon.svg"
import moonIcon from "../../assets/moon-icon.svg"
import { Switch } from "../ui/switch";
import { useThemeStore } from "@/store/themeStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type menuProps={
    onClick: () => void
}

const Sidebar = ({onClick}:menuProps) => {
    const {theme, toggleTheme} = useThemeStore()


    const activeClass= ({isActive}:{isActive: boolean}) =>
        clsx("flex gap-3 cursor-pointer", {
        "text-megagreen bg-main-bg p-3 rounded-lg": isActive,
        "text-white": !isActive,
    });

    return (
        <aside className="w-[306px] h-full bg-megaPrimary text-white rounded-r-lg pt-20 px-12 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative">
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

                <NavLink to="market-place" className={activeClass}>
                    <img src={walletIcon} alt="" aria-hidden="true" />
                    Market place
                </NavLink>

                <NavLink to="investment" className={activeClass}>
                    <CircleDollarSign /> Invest
                </NavLink>

                <NavLink to="message" className={activeClass}>
                    <img src={messageIcon} alt="" aria-hidden="true" />
                    Messages
                </NavLink>

                <NavLink to="profile" className={activeClass}>
                    <img src={profileIcon} alt="" aria-hidden="true" />
                    Profile
                </NavLink>

                <NavLink to="settings" className={activeClass}>
                    <Settings /> Settings
                </NavLink>

                <hr/>
                <div className="flex gap-3 cursor-pointer">
                    <ShieldCheck /> Security
                </div>

                <div className="flex gap-3 cursor-pointer">
                    <img src={helpIcon} alt="" aria-hidden="true" />
                    Help
                </div>
                <div className="flex items-center justify-between gap-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <img src={moonIcon} alt="" aria-hidden="true" />
                        Dark Mode
                    </div>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                </div>

                {/* user profile */}
                <div className="flex items-center justify-between gap-3 pt-30 pb-10">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-[50px] h-[50px]">
                            <AvatarImage src="" alt="" />
                            <AvatarFallback>EU</AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-bold text-lg">MegaCoop</h4>
                            <p className="text-sm font-light">User</p>
                        </div>
                    </div>
                    <ChevronDown/>
                </div>


            </nav>           
        </aside>
    )
}

export default Sidebar;
