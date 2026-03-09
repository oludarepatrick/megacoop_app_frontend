import { TooltipProvider } from "../ui/tooltip";
import { AskChatButton } from "./components/AskChatButton";
import { ChatDialog } from "./components/ChatDialog";
import { useChatBot } from "./hooks/useChatBot";




const AskMegaBot = () => {
    const chat = useChatBot();

    return (
        <TooltipProvider delayDuration={300}>
            <ChatDialog
                isOpen={chat.isOpen}
                currentView={chat.currentView}
                greeting={chat.greeting}
                messages={chat.messages}
                input={chat.input}
                isStartingSession={chat.isStartingSession}
                isTyping={chat.isTyping}
                messagesEndRef={chat.messagesEndRef}
                onNewChat={chat.newChat}
                onClose={chat.closeChat}
                onChipClick={(label) => chat.handleSend(label)}
                onInputChange={chat.setInput}
                onSend={chat.handleSend}
                onKeyDown={chat.handleKeyDown}
            
            />

            <AskChatButton
                isOpen={chat.isOpen}
                onClick={chat.toggleChat}
            />
        </TooltipProvider>
    )
}

export default AskMegaBot;





// import { useState, useRef, useEffect } from "react"
// import { Button } from "./ui/button"


// interface Message {
//   id: number
//   role: "user" | "assistant"
//   content: string
// }

// const AskMegaBot = () => {
//   const [open, setOpen] = useState(false)
//   const [messages, setMessages] = useState<Message[]>([
//     { id: 1, role: "assistant", content: "Hi! I'm Jane. How can I help you today?" }
//   ])
//   const [input, setInput] = useState("")
//   const [isTyping, setIsTyping] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (open) {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//     }
//   }, [messages, open])

//   const handleSend = () => {
//     if (!input.trim()) return

//     const userMessage: Message = {
//       id: Date.now(),
//       role: "user",
//       content: input.trim()
//     }

//     setMessages(prev => [...prev, userMessage])
//     setInput("")
//     setIsTyping(true)

//     // Simulate assistant response
//     setTimeout(() => {
//       const botMessage: Message = {
//         id: Date.now() + 1,
//         role: "assistant",
//         content: "Thanks for your message! I'm here to help. Let me look into that for you."
//       }
//       setMessages(prev => [...prev, botMessage])
//       setIsTyping(false)
//     }, 1200)
//   }

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSend()
//     }
//   }

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className={`fixed inset-0 z-40 transition-all duration-300 ${
//           open ? "bg-black/10 backdrop-blur-sm pointer-events-auto" : "pointer-events-none opacity-0"
//         }`}
//         onClick={() => setOpen(false)}
//       />

//       {/* Chat Dialog */}
//       <div
//         className={`fixed bottom-24 right-8 z-50 w-[360px] max-w-[calc(100vw-2rem)] transition-all duration-300 ease-in-out ${
//           open
//             ? "opacity-100 translate-y-0 pointer-events-auto"
//             : "opacity-0 translate-y-6 pointer-events-none"
//         }`}
//         style={{ transformOrigin: "bottom right" }}
//       >
//         <div
//           className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white flex flex-col"
//           style={{ height: "480px" }}
//         >
//           {/* Header */}
//           <div className="bg-megagreen px-4 py-3 flex items-center gap-3 shrink-0">
//             <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
//               <img src="/megacoop-logo-white.svg" className="w-5 h-5" alt="Jane" />
//             </div>
//             <div className="flex-1">
//               <p className="text-white font-semibold font-poppins text-sm leading-tight">Jane</p>
//               <div className="flex items-center gap-1.5">
//                 <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
//                 <p className="text-white/70 text-xs font-poppins">Online · AI Assistant</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setOpen(false)}
//               className="text-white/60 hover:text-white transition-colors w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10"
//             >
//               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                 <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//             </button>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/50">
//             {messages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
//               >
//                 {msg.role === "assistant" && (
//                   <div className="w-6 h-6 rounded-full bg-megagreen flex items-center justify-center shrink-0 mb-0.5">
//                     <img src="/megacoop-logo-white.svg" className="w-3.5 h-3.5" alt="Jane" />
//                   </div>
//                 )}
//                 <div
//                   className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm font-poppins leading-relaxed ${
//                     msg.role === "user"
//                       ? "bg-megagreen text-white rounded-br-sm"
//                       : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
//                   }`}
//                 >
//                   {msg.content}
//                 </div>
//               </div>
//             ))}

//             {/* Typing indicator */}
//             {isTyping && (
//               <div className="flex items-end gap-2">
//                 <div className="w-6 h-6 rounded-full bg-megagreen flex items-center justify-center shrink-0">
//                   <img src="/megacoop-logo-white.svg" className="w-3.5 h-3.5" alt="Jane" />
//                 </div>
//                 <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
//                   <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
//                   <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
//                   <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <div className="px-3 py-3 border-t border-gray-100 bg-white shrink-0">
//             <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-megagreen focus-within:ring-1 focus-within:ring-megagreen/20 transition-all">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Ask Jane anything..."
//                 className="flex-1 bg-transparent text-sm font-poppins text-gray-800 placeholder-gray-400 outline-none"
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!input.trim()}
//                 className="w-7 h-7 rounded-lg bg-megagreen disabled:opacity-30 flex items-center justify-center transition-all hover:opacity-90 shrink-0"
//               >
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                   <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </button>
//             </div>
//             <p className="text-center text-[10px] text-gray-400 font-poppins mt-2">Powered by MegaCoop AI</p>
//           </div>
//         </div>
//       </div>

//       {/* Trigger Button */}
//       <Button
//         variant="outline"
//         onClick={() => setOpen(prev => !prev)}
//         className={`fixed bottom-8 right-8 z-50 border-white font-normal bg-megagreen text-whitebg font-poppins p-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
//           open ? "scale-95 shadow-md" : "scale-100"
//         }`}
//       >
//         <div className="transition-all duration-200 flex items-center gap-2">
//           {open ? (
//             <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
//               <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//           ) : (
//             <>
//               <img src="/megacoop-logo-white.svg" className="w-5" alt="" />
//               Ask
//               <span className="hidden md:inline -ml-1">Jane</span>
//             </>
//           )}
//         </div>
//       </Button>
//     </>
//   )
// }

// export default AskMegaBot