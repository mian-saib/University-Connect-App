import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ChatHeader isDark={isDark} onToggleTheme={toggleTheme} />
      
      {/* Main Chat Area */}
      <main className="flex-1 pt-16 flex flex-col">
        <ChatWindow />
      </main>
    </div>
  );
};

export default Index;
