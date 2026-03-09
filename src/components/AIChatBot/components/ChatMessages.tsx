import { ScrollArea } from "@/components/ui/scroll-area"
import type { Message } from "../type"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



type ChatMessagesProps = {
    messages: Message[]
    messagesEndRef: React.RefObject<HTMLDivElement>
    isTyping: boolean
}

export function ChatMessages({ messages, messagesEndRef, isTyping }: ChatMessagesProps) {
    return (
        // scrollable container for chat messages

        <ScrollArea className="flex-1 min-h-0 bg-gray-50/40 ">
            <div className="px-4 py-4 space-y-3">
                {messages.map((msg) => (
                    <div key={crypto.randomUUID()} className={`
                        flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}
                    `}>
                        {msg.role === "assistant" && (
                            <Avatar className="h-6 w-6 shrink-0 mb-0.5 border border-gray-100">
                                <AvatarImage src="/megacoop-green-icon.svg" alt="Jane" />
                                <AvatarFallback className="bg-megagreen/10 text-megagreen text-[10px] font-semibold">J</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm font-poppins leading-relaxed
                            ${msg.role === "user" ? 
                                "bg-megagreen text-white rounded-br-sm" : 
                                "bg-white text-grey-800 rounded-bl-sm shadow-sm border border-gray-100"}
                            `}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && <TypingDots/>}

                {/* scroll anchor */}

                <div ref={messagesEndRef}/>
            </div>
        </ScrollArea>
    )
}

function TypingDots() {
    return (
        <div className="flex items-end gap-2">
            <Avatar className="h-6 w-6 shrink-0 border border-gray-100">
                <AvatarImage src="/megacoop-logo.svg" alt="Jane" />
                <AvatarFallback className="bg-megagreen/10 text-megagreen text-[10px] font-semibold">J</AvatarFallback>
            </Avatar>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
        </div>
    )
}