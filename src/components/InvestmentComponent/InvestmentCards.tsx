import { Card, CardContent } from "@/components/ui/card";
import moneyIcon from "../../assets/money-bag-icon.svg";
import pieChartIcon from "../../assets/pie-chart-icon.svg";
import repeatIcon from "../../assets/repeat-icon.svg";

interface InvestmentData {
  totalInvested: number;
  numberOfInvestments: number;
  rateOfReturn: number;
}

interface InvestmentCardsProps {
  data?: InvestmentData;
}

export default function InvestmentCards({ data }: InvestmentCardsProps) {
  const cards = [
    {
      title: "Total Invested Amount",
      value: `₦${data?.totalInvested?.toLocaleString() || "0.00"}`,
      icon: moneyIcon,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Available Investments",
      value: data?.numberOfInvestments?.toLocaleString() || "0",
      icon: pieChartIcon,
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      title: "Rate of Return",
      value: `+${data?.rateOfReturn || "5.80"}%`,
      icon: repeatIcon,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <section
      className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2
      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
      md:grid md:grid-cols-3 md:overflow-visible md:snap-none
    "
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          className="w-[350px] md:w-full p-0 py-4 snap-start shrink-0 justify-center"
        >
          <CardContent className="py-4">
            <div className="flex items-center space-x-4">
              <div className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${card.bgColor}`}>
                <img src={card.icon} alt="" aria-hidden="true" className="w-5 object-contain" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-green-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}






// import { Card, CardContent } from "@/components/ui/card"
// import { DollarSign, TrendingUp, RefreshCw } from "lucide-react"

// interface InvestmentData {
//   totalInvested: number
//   numberOfInvestments: number
//   rateOfReturn: number
// }

// interface InvestmentCardsProps {
//   data?: InvestmentData
// }

// export default function InvestmentCards({ data }: InvestmentCardsProps) {
//   const cards = [
//     {
//       title: "Total Invested Amount",
//       value: `₦${data?.totalInvested?.toLocaleString() || "150,000"}`,
//       icon: DollarSign,
//       bgColor: "bg-purple-100",
//       iconColor: "text-purple-600",
//     },
//     {
//       title: "Number of Investments",
//       value: data?.numberOfInvestments?.toLocaleString() || "1,250",
//       icon: TrendingUp,
//       bgColor: "bg-pink-100",
//       iconColor: "text-pink-600",
//     },
//     {
//       title: "Rate of Return",
//       value: `+${data?.rateOfReturn || "5.80"}%`,
//       icon: RefreshCw,
//       bgColor: "bg-blue-100",
//       iconColor: "text-blue-600",
//     },
//   ]

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
//       {cards.map((card, index) => {
//         const IconComponent = card.icon
//         return (
//           <Card key={index} className="border border-gray-200 shadow-sm">
//             <CardContent className="p-4 lg:p-6">
//               <div className="flex items-center space-x-4">
//                 <div className={`p-3 rounded-full ${card.bgColor}`}>
//                   <IconComponent className={`h-6 w-6 ${card.iconColor}`} />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm text-green-600 font-medium mb-1">{card.title}</p>
//                   <p className="text-2xl font-bold">{card.value}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }
