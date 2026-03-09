import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SendHorizonal } from "lucide-react"

type ChatInputAreaProps = {
    input: string
    isTyping: boolean
    onInputChange: (value: string) => void
    onSend: () => void
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function ChatInputArea({ input, isTyping, onInputChange, onSend, onKeyDown }: ChatInputAreaProps) {
    return (
        <div className="p-4 bg-white border-t border-gray shrink-0">
            <div className="flex items-center gap-2">
                <Input
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Write your question"
                    disabled={isTyping}
                    aria-label="Type your message"
                    className="flex-1 h-11 rounded-2xl border-gray-200 bg-gray-50 font-poppins text-sm
                     placeholder:text-gray-400 focus-visible:ring-megagreen/30
                     focus-visible:border-megagreen disabled:opacity-50"
                />

                {/* shadcn Button + Tooltip */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={() =>onSend()}
                            disabled={(input && !input.trim()) || isTyping}
                            size="icon"
                            aria-label="Send message"
                            className="h-10 w-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-white
                                    shrink-0 disabled:opacity-30 active:scale-95 transition-all"
                        >
                        <SendHorizonal className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Send</TooltipContent>
                </Tooltip>

            </div>
            <p className="text-center text-[10px] text-gray-400 font-poppins mt-2.5">
                Understand that Jane Is Limited!
            </p>

        </div>
    )
}