import { useLocation } from "react-router-dom";
import { Search, Bell, User } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AlignJustify } from "lucide-react";

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
            hasSearch: true,
            searchPlaceholder: "Search for transaction, item, etc"
        },
        "/user/savings-loan": { 
            title: "Savings & Loan", 
            bg: "bg-card-bg text-theme-text",
            hasSearch: false
        },
        "/user/market-place": { 
            title: "Market Place", 
            bg: "bg-card-bg text-theme-text",
            hasSearch: false
        },
        "/user/message": { 
            title: "Messages", 
            bg: "bg-card-bg text-theme-text",
            hasSearch: false
        },
        "/user/profile": { 
            title: "Profile", 
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
            bg: "bg-megagreen text-white",
            input: "",
            hasSearch: true,
            searchPlaceholder: "Search for something..."
        },
       
    };

    const defaultSetting = headerSettings[location.pathname] || {
        title: "Dashboard",
        bg: "bg-card-bg text-theme-text",
        hasSearch: false
    };

    return (
        <header className={`px-6 py-4 font-poppins ${defaultSetting.bg}`}>
            <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-10">
                    {/* Center - Conditional Search */}
                    {defaultSetting.hasSearch && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-icon w-4 h-4" />
                            <Input
                                type="text"
                                placeholder={defaultSetting.searchPlaceholder || "Search..."}
                                className="pl-10 w-70 border-transparent shadow-none placeholder:text-icon"
                            />
                        </div>
                    )}
                    {/* Right side - User actions */}
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="hover:bg-white/10">
                            <Bell className="w-5 h-5" />
                        </Button>
                        
                        <Button variant="ghost" size="icon" className="hover:bg-white/10 lg:hidden">
                            <User className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
