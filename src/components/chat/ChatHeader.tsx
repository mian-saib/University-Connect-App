import { Moon, Sun } from "lucide-react";
import universityLogo from "@/assets/university-logo.jfif";

interface ChatHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function ChatHeader({ isDark, onToggleTheme }: ChatHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={universityLogo} 
            alt="University of Peshawar" 
            className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" 
          />
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">UoP FAQ Assistant</h1>
            <p className="text-xs text-muted-foreground">University of Peshawar</p>
          </div>
        </div>
        <button 
          onClick={onToggleTheme} 
          className="p-2.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
        </button>
      </div>
    </header>
  );
}
