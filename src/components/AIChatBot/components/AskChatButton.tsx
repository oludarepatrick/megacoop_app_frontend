import { Button } from "@/components/ui/button"


type AskChatButtonProps = {
    onClick: () => void;
    isOpen: boolean;
};

export const AskChatButton = ({ onClick, isOpen }: AskChatButtonProps) => {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close chat" : "Open chat with Jane"}
            className={`hover:bg-white/10 text-black border-megaPrimary rounded-full`}
            >
                <span className="flex items-center gap-2">
                    <img src="/megacoop-green-icon.svg" alt="" className="w-5" />
                    Ask
                    <span className="hidden md:inline -ml-1">
                        Jane
                    </span>
                </span>
            
        </Button>
    )
}