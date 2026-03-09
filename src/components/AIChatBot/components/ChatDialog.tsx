import { SUGGESTION_CHIPS } from "../constants"
import type { Message } from "../type"
import { ChatHeader } from "./ChatHeader"
import { ChatInputArea } from "./ChatInputArea"
import { ChatMessages } from "./ChatMessages"
import { WelcomeScreen } from "./WelcomeScreen"

type ChatView = "welcome" | "chat"

interface ChatDialogProps {
    isOpen: boolean
    currentView: ChatView
    greeting: string
    messages: Message[]
    input: string
    isTyping: boolean
    isStartingSession: boolean
    messagesEndRef: React.RefObject<HTMLDivElement>
    onNewChat: () => void
    onClose: () => void
    onChipClick: (label: string) => void
    onInputChange: (value: string) => void
    onSend: () => void
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function ChatDialog({
    isOpen, currentView, greeting, messages, input, isTyping, isStartingSession, messagesEndRef,
    onNewChat, onClose, onChipClick, onInputChange, onSend, onKeyDown
}: ChatDialogProps) {
    return (
        <>
            {/* backdrop */}
            <div onClick={onClose} aria-hidden="true" className={`
                fixed inset-0 z-40 transition-all duration-300 ${
                    isOpen ? "bg-black/10 backdrop-blur-[1px] pointer-events-auto" :
                    "pointer-events-none opacity-0"
                }`}
            />

            {/* Panel */}

            <div role="dialog" aria-label="Chat with Jane" className={`
                fixed bottom-8 right-3 sm:right-8 z-50 w-[370px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto transition-all
                duration-300 ease-in-out ${
                    isOpen ? "opacity-100 translate-y-0 pointer-events-auto" :
                    "opacity-0 translate-y-6 pointer-events-none"
                }`}
                style={{transformOrigin: "bottom right"}}
            >
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200/60 bg-whitebg flex flex-col"
                 style={{height: "500px"}}
                >
                    <ChatHeader onNewChat={onNewChat} onClose={onClose} />

                    {currentView === "welcome" ? (
                        <WelcomeScreen
                            greeting={greeting}
                            isStartingSession={isStartingSession}
                            chips={SUGGESTION_CHIPS}
                            onChipClick={onChipClick}
                        />
                    ) : (
                        <ChatMessages
                            messages={messages}
                            isTyping={isTyping}
                            messagesEndRef={messagesEndRef}
                        />
                    )}

                    <ChatInputArea
                        input={input}
                        isTyping={isTyping}
                        onInputChange={onInputChange}
                        onSend={onSend}
                        onKeyDown={onKeyDown}
                    />
                </div>
            </div>

        
        </>
    )
}