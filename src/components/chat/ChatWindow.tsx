import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { QuickReplies } from "./QuickReplies";
import { ChatInput } from "./ChatInput";
import { welcomeMessage, popularQuestions } from "@/data/faqData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", content: welcomeMessage, isUser: false },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke("faq-chat", {
        body: { message },
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I apologize, I couldn't process your question. Please try again.",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      toast.error("Failed to get response. Please try again.");
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again or contact the university directly at info@uop.edu.pk",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const showQuickReplies = messages.length === 1;

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} content={msg.content} isUser={msg.isUser} />
          ))}
          {isTyping && <ChatMessage content="" isUser={false} isTyping />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies - only show at start */}
      {showQuickReplies && (
        <div className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <QuickReplies suggestions={popularQuestions} onSelect={handleSend} />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border bg-background">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}
