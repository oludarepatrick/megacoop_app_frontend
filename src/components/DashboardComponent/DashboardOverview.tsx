import wallet from "../../assets/wallet-tick-icon.svg"
import moneySent from "../../assets/money-icon.svg"
import card from "../../assets/card-icon.svg"
import moneyReceive from "../../assets/money-sent-icon.svg"
import StatCard from "../StatCard";
import { Card } from "../ui/card";

const mockStats = [
    { 
        id: "balance", 
        title: "Wallet Balance", 
        amount: 250000, 
        icon: wallet,
        interest: "+1.29%",
        iconbg:"bg-[#FFF2E5]", 
        interestBg: "bg-[#E5FFF1]",
    },
    { 
        id: "income", 
        title: "Total Income(ROI)", 
        amount: 50000, 
        icon: card,
        interest: "+1.29%",
        iconbg:"bg-[#DDFFE7]",
        interestBg: "bg-[#E5FFF1]",
    },
    { 
        id: "savings", 
        title: "Total Savings", 
        amount: 100000, 
        icon: moneySent,
        interest: "+1.29%",
        iconbg:"bg-[#FFDFF6]",
        interestBg: "bg-[#FFEEEE]",
    },
    { 
        id: "loan", 
        title: "Total Loan", 
        amount: 15000, 
        icon: moneyReceive,
        interest: "+1.29%",
        iconbg:"bg-[#FFEBEA]",
        interestBg: "bg-[#FFEEEE]"
    },
];

const DashboardOverview = () => {
    return (
        <section className="
            flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            xl:grid xl:grid-cols-4 xl:overflow-visible xl:snap-none
        ">
            {mockStats.map((stat) => (
                <Card key={stat.id} className="w-[254px] xl:w-full p-0 px-3 pt-4 snap-start shrink-0">
                    <StatCard {...stat} />
                </Card>
            ))}

        </section>
    )
}

export default DashboardOverview ;