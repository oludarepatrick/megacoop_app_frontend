import { Skeleton } from "@/components/ui/skeleton"
import type { SuggestionChip } from "../type"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

type WelcomeScreenProps = {
    greeting: string
    isStartingSession: boolean
    chips: SuggestionChip[]
    onChipClick: (label: string) => void
}


export function WelcomeScreen({ greeting, isStartingSession, chips, onChipClick }: WelcomeScreenProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-start px-5 pt-8 pb-4 bg-white overflow-y-auto">
            <div className="flex flex-col items-center w-full">
                <img src="/megacoop-green-icon.svg" className="w-8 mb-4" alt="Logo" />

                {isStartingSession ? (
                    // ── Loading: skeleton only, no chips ──
                    <div className="flex flex-col items-center gap-3 mb-8 w-full max-w-[200px]">
                        <Skeleton className="h-6 w-3/4 rounded-lg" />
                        <Skeleton className="h-4 w-full rounded-lg" />
                    </div>
                ) : (
                    // ── Resolved: greeting + chips always appear together ──
                    <>
                        <div className="text-center mb-8">
                            {greeting.split("\n").map((line, idx) => (
                                <p key={idx} className={
                                    idx === 0
                                        ? "text-xl font-semibold text-gray-800 font-poppins"
                                        : "text-sm text-gray-400 font-poppins mt-1"
                                }>
                                    {line}
                                </p>
                            ))}
                        </div>

                        {chips.length > 0 && (
                            <div className="w-full space-y-2">
                                {chips.map((chip) => (
                                    <Button
                                        key={chip.id}
                                        variant="outline"
                                        onClick={() => onChipClick(chip.label)}
                                        className="w-full justify-start gap-3 h-auto py-3 px-4 rounded-xl border-gray-200
                                                   font-poppins font-normal text-sm text-gray-700
                                                   hover:border-megagreen/40 hover:bg-megagreen/5 hover:text-gray-900
                                                   group transition-all truncate"
                                    >
                                        <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-megagreen shrink-0 transition-colors" />
                                        {chip.label}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
// export function WelcomeScreen({ greeting, isStartingSession, chips, onChipClick }: WelcomeScreenProps) {
//     return (
//         <div className="flex-1 flex flex-col items-center justify-start px-5 pt-8 pb-4 bg-white overflow-y-auto">
//             <div className="flex flex-col items-center">
//                 <img src="/megacoop-green-icon.svg" className="w-8  mb-4" alt="Logo" />

//                 {/* Greeting Loader */}
//                 {isStartingSession ? (
//                     <div className="flex flex-col items-center gap-3 mb-8 w-full max-w-[200px]">
//                         <Skeleton className="h-6 w-3/4 rounded-lg" />
//                         <Skeleton className="h-4 w-full rounded-lg" />
//                     </div>
//                 ) : (
//                     <div className="text-center mb-8">
//                         {/* The API response split the greeting into heading+ subtitle */}
//                         {greeting.split("\n").map((line, idx) => (
//                             <p key={idx} className={
//                                 idx === 0
//                                     ? "text-xl font-semibold text-gray-800 font-poppins"
//                                     : "text-sm text-gray-400 font-poppins mt-1"
//                                 }>
//                                 {line} 
//                             </p>
//                         ))}
//                     </div>
//                 )}

//                 {/* Suggestion chips */}

//                 {isStartingSession  && chips.length > 0 ? "" : (
//                     <div className="w-full space-y-2">
//                         {chips.map((chip) => (
//                             <Button
//                                 key={chip.id}
//                                 variant="outline"
//                                 onClick={() => onChipClick(chip.label)}
//                                 className="w-full justify-start gap-3 h-auto py-3 px-4 rounded-xl border-gray-200
//                                             font-poppins font-normal text-sm text-gray-700
//                                             hover:border-megagreen/40 hover:bg-megagreen/5 hover:text-gray-900
//                                             group transition-all"
//                                 >
//                                 <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-megagreen shrink-0 transition-colors" />
//                                 {chip.label}
//                             </Button>
//                         ))}
//                     </div>

//                 )}
//             </div>
//         </div>
//     )
// }