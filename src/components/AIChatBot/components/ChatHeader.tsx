import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { MessageSquarePlus, PanelLeftIcon, X } from "lucide-react"

type ChatHeaderProps = {
    onNewChat: () => void
    onClose: () => void
}
export function ChatHeader({onNewChat, onClose} : ChatHeaderProps) {
    return (
        <div className="shrink-0 bg-white">
            <div className="p-3 flex items-center justify-between">
                <div className="flex gap-2">
                    {/* collapse menu with chat name */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <PanelLeftIcon className="w-5 h-5 text-gray-500 cursor-pointer" onClick={onClose} />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Open Sidebar</TooltipContent>
                    </Tooltip>
                    <span className="font-semibold text-grey-800 font-poppins text-sm">Jane</span>

                </div>


                <div className="flex gap-3" >
                    {/* New Chat */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onNewChat}
                        className="h-7 rounded-full border-none bg-transparent text-megagreen
                                    hover:bg-megagreen/10 hover:text-megagreen hover:border-megagreen/50
                                    font-poppins text-xs px-3 gap-1.5"
                        >
                        <MessageSquarePlus className="h-3.5 w-3.5" />
                        New chat
                    </Button>

                    {/* Right: close */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat"
                            className="h-7 w-7 text-gray-400 hover:text-gray-700">
                            <X className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Hide</TooltipContent>
                    </Tooltip>

                </div>

            </div>
            <Separator />
        </div>
    )
}