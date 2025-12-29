import { User } from "lucide-react";
import universityLogo from "@/assets/university-logo.jfif";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  isTyping?: boolean;
}

export function ChatMessage({ content, isUser, isTyping }: ChatMessageProps) {
  if (isTyping) {
    return (
      <div className="flex gap-3 items-start animate-fade-in">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <img
            src={universityLogo}
            alt="Bot"
            className="w-6 h-6 rounded-full object-cover"
          />
        </div>
        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  // Format content with markdown-like syntax
  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className={`flex gap-3 items-start animate-fade-in ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-primary" : "bg-primary/10"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <img
            src={universityLogo}
            alt="Bot"
            className="w-6 h-6 rounded-full object-cover"
          />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-muted text-foreground rounded-tl-sm"
        }`}
      >
        <div 
          className="text-sm leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: formatContent(content) }} 
        />
      </div>
    </div>
  );
}
