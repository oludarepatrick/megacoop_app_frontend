import { formatCurrency } from "@/common/utils";
import { CardContent, CardHeader } from "./ui/card";
import { EllipsisVertical} from "lucide-react";


type StatProps = {
    title: string;
    amount: number | undefined;
    icon: string;
    // interest: string;
    iconbg: string;
    // interestBg: string;
}

const StatCard= ({title, amount, icon, iconbg, }:StatProps) => {
    return (
        <>
            <CardHeader className="p-0 grid-cols-[2fr_auto]">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${iconbg}`}>
                    <img src={icon} alt={title} className="w-6 h-6" />
                </div>
                <EllipsisVertical/>
            </CardHeader>
            <CardContent className="px-0 pb-2">
                <h3 className="text-text-muted font-medium text-[13px]">{title}</h3>
                <div className="flex justify-between gap-2">
                    {/* <p className="text-[22px] font-bold">₦{amount.toLocaleString()}<span className="text-base">.00</span></p> */}
                    {amount === undefined ? (
                        <span className="block animate-spin rounded-full h-4 w-4 border-b-2 border-megagreen my-2" />
                    ) : (() => {
                        const [naira, kobo] = formatCurrency(amount).split(".")
                        return (
                            <p className="text-[22px] font-bold">
                                {naira}.
                                <span className="text-base">
                                    {kobo}
                                </span>
                            </p>
                        )
                    })()}
            
                </div>
            </CardContent>

        </>
    )
}

export default StatCard;