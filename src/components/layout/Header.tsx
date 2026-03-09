import { useLocation } from "react-router-dom";
import { Search} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AlignJustify } from "lucide-react";
import AskMegaBot from "../AIChatBot";

type menuProps={
    onMenuToggle: () => void
}

const Header = ({onMenuToggle}: menuProps) => {
    const location = useLocation();

    const headerSettings: Record<string, { 
        title: string; 
        bg: string;
        hasSearch: boolean;
        input?: string;
        searchPlaceholder?: string;
    }> = {
        // Sidebar pages - Default background
        "/user/dashboard": { 
            title: "Dashboard", 
            bg: "bg-card-bg text-theme-text",
            hasSearch: false,
            searchPlaceholder: "Search for transaction, item, etc"
        },
        "/user/savings-loan": { 
            title: "Savings & Loan", 
            bg: "bg-card-bg text-theme-text",
            hasSearch: false
        },
        "/user/market-place": { 
            title: "Market Place", 
            bg: "bg-megaPrimary text-white",
            hasSearch: false
        },
        "/user/investment": { 
            title: "Investment", 
            bg: "bg-megaPrimary text-white",
            hasSearch: false
        },
        "/user/profile": { 
            title: "Profile", 
            bg: "bg-megaPrimary text-white",
            hasSearch: false
        },
        "/user/help": { 
            title: "Help", 
            bg: "bg-card-bg text-theme-text",
            hasSearch: false
        },
        "/user/settings": { 
            title: "Settings", 
            bg: "bg-card-bg text-theme-text",
            hasSearch: false
        },
        "/user/transactions": { 
            title: "Transactions", 
            bg: "bg-megaPrimary text-white",
            input: "text-icon",
            hasSearch: false,
            searchPlaceholder: "Search for something..."
        },
        "/user/cart": { 
            title: "My Cart", 
            bg: "bg-megaPrimary text-white",
            hasSearch: false
        },
       
    };

    const defaultSetting = headerSettings[location.pathname] || {
        title: "Dashboard",
        bg: "bg-card-bg text-theme-text",
        hasSearch: false
    };

    return (
        <header className={`px-4 lg:px-6 py-4 font-poppins ${defaultSetting.bg}`}>
            <div className="flex items-center justify-between gap-4">
                {/* Left side - Page Title */}
                <div className="flex gap-3">
                    <Button
                        variant="ghost" 
                        className="hover:bg-transparent lg:hidden"
                        onClick={onMenuToggle}
                    >
                        <AlignJustify className="!w-6 !h-6" />
                    </Button>

                    <h1 className="text-2xl font-bold">
                        {defaultSetting.title}
                    </h1>
                </div>
                <div className="flex items-center gap-4 ">
                    {/* Center - Conditional Search */}
                    {defaultSetting.hasSearch && (
                        <div className="relative hidden sm:flex bg-white rounded-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-icon w-4 h-4" />
                            <Input
                                type="text"
                                placeholder={defaultSetting.searchPlaceholder || "Search..."}
                                className={`pl-10 w-70 border-transparent shadow-none placeholder:text-icon ${defaultSetting.input}`}
                            />
                        </div>
                    )}
                    {/* Right side - Chat Button */}
                    <AskMegaBot/>
                    {/* <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            onClick={onClick}
                            className={`hover:bg-white/10 border-megaPrimary rounded-full`}
                        >
                            <span className="flex items-center gap-2">
                                <img src="/megacoop-green-icon.svg" alt="" className="w-5" />
                                Ask
                                <span className="hidden md:inline -ml-1">
                                    Jane
                                </span>
                            </span>
                        </Button>
                    </div> */}
                </div>
            </div>
        </header>
    );
};

export default Header;
