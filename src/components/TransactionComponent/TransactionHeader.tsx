import { Calendar, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


const TransactionsHeader = () => {
    return (
         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-xl lg:text-2xl font-semibold">Recent Transactions</h2>
            
            <div className="flex justify-between gap-3">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ring w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search for anything..."
                        className="rounded-full text-xs pr-10 w-full sm:w-70 shadow-none placeholder:text-megaPrimary text-megaPrimary"
                    />
                </div>
                
                {/* Date Filter */}
                <div className="relative">
                    <Select>
                        <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">10 May - 20 May</SelectItem>
                            <SelectItem value="date1">21 May - 30 May</SelectItem>
                            <SelectItem value="date2">01 May - 20 May</SelectItem>
                        </SelectContent>
                    </Select>
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-icon w-4 h-4" />
                </div>
            </div>
        </div>
    )
}

export default TransactionsHeader;
