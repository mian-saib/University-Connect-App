import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !disabled) {
        onSend(message.trim());
        setMessage("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="relative flex items-end gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about admissions, fees, academics..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none px-4 py-3 text-sm bg-muted border border-border rounded-2xl
                   placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                   transition-all duration-200 disabled:opacity-50"
          style={{ minHeight: "48px", maxHeight: "120px" }}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-3 rounded-full bg-primary text-primary-foreground
                   flex items-center justify-center transition-all duration-200
                   hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
