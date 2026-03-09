export type MessageRole = "user" | "assistant"
export type Message = {
    role: MessageRole
    content: string
    timestamp: Date
}
export type StartSessionResponse = {
    session_id: string
    welcome_message: string
    message_count: number
}

export type SendMessageSchema = {
    session_id: string
    message: string
    context_only: false
}

export type SendMessageResponse = {
    session_id: string
    message: string
    response: {
        answer: string
        explanation: string
        sources: string[]
        confidence: number
    }
    context_only: boolean
}

export type ClearSessionResponse = {
    message: string
}

export type ChatHistoryResponse = {
    session_id: string
    history: Message[]
    message_count: number
    last_active: Date
}

export type SuggestionChip = {
    id: number
    label: string
}