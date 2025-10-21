import { CardContent, CardHeader } from "./ui/card";
import { EllipsisVertical } from "lucide-react";


type StatProps = {
    title: string;
    amount: number;
    icon: string;
    interest: string;
    iconbg: string;
    interestBg: string;
}

const StatCard= ({title, amount, icon, interest, iconbg, interestBg}:StatProps) => {
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
                    <p className="text-[22px] font-bold">
                        ₦{Number(amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        <span className="text-base">
                            .{String(Number(amount).toFixed(2)).split(".")[1] || "00"}
                        </span>
                    </p>

                    <span className={`flex items-center justify-center text-xs font-medium px-2 rounded text-dark ${interestBg} rounded-2xl`}>
                        {interest}
                    </span>

                </div>
            </CardContent>

        </>
    )
}

export default StatCard;