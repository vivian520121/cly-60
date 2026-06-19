import { useMemo } from 'react';
import type { Highlight, HighlightColor } from '../../types';

interface HighlightedTextProps {
  text: string;
  highlights: Highlight[];
  onHighlightClick?: (highlightId: string) => void;
}

export function HighlightedText({ text, highlights, onHighlightClick }: HighlightedTextProps) {
  const renderedContent = useMemo(() => {
    if (highlights.length === 0) {
      return [{ text, isHighlighted: false, highlightId: null, color: null as HighlightColor | null }];
    }

    const sortedHighlights = [...highlights].sort((a, b) => a.startIndex - b.startIndex);
    
    const segments: Array<{
      text: string;
      isHighlighted: boolean;
      highlightId: string | null;
      color: HighlightColor | null;
    }> = [];

    let lastIndex = 0;

    for (const highlight of sortedHighlights) {
      if (highlight.startIndex > lastIndex) {
        segments.push({
          text: text.slice(lastIndex, highlight.startIndex),
          isHighlighted: false,
          highlightId: null,
          color: null,
        });
      }

      if (highlight.startIndex < text.length && highlight.endIndex > lastIndex) {
        const start = Math.max(highlight.startIndex, lastIndex);
        const end = Math.min(highlight.endIndex, text.length);
        segments.push({
          text: text.slice(start, end),
          isHighlighted: true,
          highlightId: highlight.id,
          color: highlight.color,
        });
        lastIndex = end;
      }
    }

    if (lastIndex < text.length) {
      segments.push({
        text: text.slice(lastIndex),
        isHighlighted: false,
        highlightId: null,
        color: null,
      });
    }

    return segments;
  }, [text, highlights]);

  return (
    <span className="inline">
      {renderedContent.map((segment, index) =>
        segment.isHighlighted ? (
          <span
            key={index}
            className={`highlight-${segment.color} cursor-pointer transition-all hover:opacity-80`}
            onClick={(e) => {
              e.stopPropagation();
              if (segment.highlightId && onHighlightClick) {
                onHighlightClick(segment.highlightId);
              }
            }}
            title="点击移除高亮"
          >
            {segment.text}
          </span>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </span>
  );
}
