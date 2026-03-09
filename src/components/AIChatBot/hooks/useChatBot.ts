import { useCallback, useEffect, useState, useRef } from "react";
import type { Message } from "../type";
import { useMutation } from "@tanstack/react-query";
import { ChatApi } from "../api/chatApi";

type ChatView = "welcome" | "chat";

type UseChatBotReturn = {
  isOpen: boolean;
  currentView: ChatView;
  greeting: string;
  sessionID: string;
  messages: Message[];
  input: string;
  isTyping: boolean;
  isStartingSession: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  toggleChat: () => void;
  closeChat: () => void;
  newChat: () => void;
  setInput: (value: string) => void;
  handleSend: (text?: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function useChatBot(): UseChatBotReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ChatView>("welcome");
  const [greeting, setGreeting] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null!);

  // Auto scroll message to the latest message -------

  useEffect(() => {
    if (currentView === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentView]);

  // Push a chat bubble to the thread --------
  const pushMessage = useCallback((role: Message["role"], content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role, content, timestamp: new Date() },
    ]);
  }, []);

  // Mutate start session API ------
  const startMutation = useMutation({
    mutationFn: ChatApi.startSession,
    onSuccess: (data) => {
      setSessionID(data.session_id);
      setGreeting(data.welcome_message);
    },
    onError: (error) => {
      console.error("[ChatBot] failed to start session", error);
      setGreeting("Hello 👋\nHow can I help you today? "); // fallback greeting
    },
  });

  // Mutate send message API ------
  const sendMessageMutation = useMutation({
    mutationFn: ChatApi.sendMessage,
    onSuccess: (data) => {
      if (data.context_only) {
        // This means the message was processed but no answer generated (e.g. due to low confidence)
        pushMessage(
          "assistant",
          "I'm not sure about that. Could you please rephrase or ask something else?",
        );
      } else {
        pushMessage("assistant", data.response.answer);
      }
    },
    onError: (error) => {
      console.error("[ChatBot] failed to send message", error);
      pushMessage(
        "assistant",
        "Sorry, something went wrong. Please try again.",
      );
    },
  });

  // Reset chat to welcome screen (call start API) --------
  const initSession = useCallback(() => {
    setSessionID("");
    setGreeting("");
    setMessages([]);
    setCurrentView("welcome");
    setInput("");
    startMutation.mutate(undefined);
  }, [startMutation]);

  // Toggle chat open/close --------
  const openChat = useCallback(() => {
    setIsOpen(true);
    initSession();
  }, [initSession]);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(
    () => (isOpen ? closeChat() : openChat()),
    [isOpen, openChat, closeChat],
  );

  // New Chat re-trigger /start session --------
  const newChat = useCallback(() => initSession(), [initSession]);

  // Send: accept either text input or suggestion chip label --------
  const handleSend = useCallback(
    (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || sendMessageMutation.isPending) return;

      setCurrentView("chat");
      setInput("");
      pushMessage("user", content);
      sendMessageMutation.mutate({
        session_id: sessionID,
        message: content,
        context_only: false,
      });
    },
    [input, sessionID, sendMessageMutation, pushMessage, setInput],
  );

  // Enter Key submit
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return {
    isOpen,
    currentView,
    greeting,
    sessionID,
    messages,
    input,
    isTyping: sendMessageMutation.isPending,
    isStartingSession: startMutation.isPending,
    messagesEndRef,
    toggleChat,
    closeChat,
    newChat,
    setInput,
    handleSend,
    handleKeyDown,
  };
}
