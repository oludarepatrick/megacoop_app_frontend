import { Card, CardContent,  CardHeader, CardTitle } from "../ui/card";
import wallet from "../../assets/expense-icon.svg";
import { Progress } from "../ui/progress";



type Achievement = {
    icon: string
    title: string
    description: string
    current: number
    target: number
    color?: string  // optional progress bar color override
}

type NextAchievementProps = {
    achievement?: Achievement
}

const NextAchievement = ({ achievement }: NextAchievementProps) => {
    const defaultAchievement: Achievement = {
        icon: "🔥",
        title: "Streak Saver",
        description: "Save consistently for 3 months in a row",
        current: 1,
        target: 3,
    }

    const active = achievement ?? defaultAchievement
    const percentage = Math.min((active.current / active.target) * 100, 100)
    const progressColor = active.color ?? "[&>[data-slot=progress-indicator]]:bg-megaorange"

    return (
        <Card>
            <CardHeader className="flex justify-between gap-4 items-center">
                <CardTitle className="text-xl font-medium truncate">Next Achievement</CardTitle>
                {/* <CardDescription className="uppercase text-megagreen text-xs whitespace-nowrap">
                    View all
                </CardDescription> */}
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 min-w-0">
                    <div className="shrink-0">
                        <img src={wallet} alt="wallet-icon" className="w-8 h-8" />
                    </div>
                    <div className="flex-1 space-y-4 min-w-0">
                        <div className="flex justify-between text-sm gap-2">
                            <span className="truncate font-semibold">
                                {active.title} {active.icon}
                            </span>
                            <span className="font-medium whitespace-nowrap text-muted-foreground">
                                {active.current}/{active.target}
                            </span>
                        </div>
                        <Progress value={percentage} className={`h-2 ${progressColor}`} />
                        <p className="text-xs text-muted-foreground break-words">
                            {active.description}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default NextAchievement


// const NextAchievement = ()=> {
//     return (
//         <Card>
//             <CardHeader className="flex justify-between gap-4 items-center">
//                 <CardTitle className="text-xl font-medium truncate">Next Achievement</CardTitle>
//                 <CardDescription className="uppercase text-megagreen text-xs whitespace-nowrap">View all</CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <div className="flex gap-4 min-w-0">
//                     <div className="shrink-0">
//                         <img src={wallet} alt="wallet-icon" className="w-8 h-8" />
//                     </div>
//                     <div className="flex-1 space-y-4 min-w-0">
//                         <div className="flex justify-between text-sm gap-2">
//                             <span className="truncate font-semibold">Conservatist 🤝</span>
//                             <span className="font-medium whitespace-nowrap text-muted-foreground">0/1</span>
//                         </div>
//                         <Progress value={5} className="h-2 [&>[data-slot=progress-indicator]]:bg-megaorange" />
//                         <p className="text-xs text-muted-foreground break-words">Make only 5 debits in a month</p>
//                     </div>
//                 </div>
                
//             </CardContent>
//         </Card>
//     )
// }
// export default NextAchievement;