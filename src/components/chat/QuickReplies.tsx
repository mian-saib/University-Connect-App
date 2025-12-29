interface QuickRepliesProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function QuickReplies({ suggestions, onSelect }: QuickRepliesProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-2.5 text-sm bg-muted hover:bg-muted/80 text-foreground rounded-full border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-sm"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
