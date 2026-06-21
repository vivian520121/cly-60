import { useMemo } from 'react';
import type { Highlight, HighlightColor, Annotation } from '../../types';

interface HighlightedTextProps {
  text: string;
  highlights: Highlight[];
  annotations: Annotation[];
  annotationsVisible?: boolean;
  searchQuery?: string;
  onHighlightClick?: (highlightId: string) => void;
  onAnnotationClick?: (annotation: Annotation) => void;
}

interface TextSegment {
  text: string;
  isHighlighted: boolean;
  highlightId: string | null;
  color: HighlightColor | null;
  hasAnnotation: boolean;
  annotationId: string | null;
  isSearchMatch: boolean;
}

export function HighlightedText({
  text,
  highlights,
  annotations,
  annotationsVisible = true,
  searchQuery = '',
  onHighlightClick,
  onAnnotationClick,
}: HighlightedTextProps) {
  const renderedContent = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const hasSearchQuery = trimmedQuery.length > 0;

    const breakpoints = new Set<number>();
    breakpoints.add(0);
    breakpoints.add(text.length);

    for (const h of highlights) {
      breakpoints.add(h.startIndex);
      breakpoints.add(h.endIndex);
    }

    if (annotationsVisible) {
      for (const a of annotations) {
        const start = a.startIndex ?? a.position;
        const end = a.endIndex ?? a.position + 1;
        breakpoints.add(start);
        breakpoints.add(end);
      }
    }

    if (hasSearchQuery) {
      const lowerText = text.toLowerCase();
      let idx = lowerText.indexOf(trimmedQuery);
      while (idx !== -1) {
        breakpoints.add(idx);
        breakpoints.add(idx + trimmedQuery.length);
        idx = lowerText.indexOf(trimmedQuery, idx + 1);
      }
    }

    const sortedBreakpoints = [...breakpoints].sort((a, b) => a - b);

    const segments: TextSegment[] = [];

    for (let i = 0; i < sortedBreakpoints.length - 1; i++) {
      const start = sortedBreakpoints[i];
      const end = sortedBreakpoints[i + 1];

      if (start >= text.length) continue;
      if (start === end) continue;

      const segmentText = text.slice(start, end);

      let isHighlighted = false;
      let highlightId: string | null = null;
      let color: HighlightColor | null = null;

      for (const h of highlights) {
        if (start >= h.startIndex && end <= h.endIndex) {
          isHighlighted = true;
          highlightId = h.id;
          color = h.color;
          break;
        }
      }

      let hasAnnotation = false;
      let annotationId: string | null = null;

      if (annotationsVisible) {
        for (const a of annotations) {
          const aStart = a.startIndex ?? a.position;
          const aEnd = a.endIndex ?? a.position + 1;
          if (start >= aStart && end <= aEnd) {
            hasAnnotation = true;
            annotationId = a.id;
            break;
          }
        }
      }

      let isSearchMatch = false;
      if (hasSearchQuery) {
        const segmentLower = segmentText.toLowerCase();
        if (segmentLower === trimmedQuery || (segmentLower.includes(trimmedQuery) && segmentLower.length <= trimmedQuery.length + 2)) {
          isSearchMatch = true;
        }
      }

      segments.push({
        text: segmentText,
        isHighlighted,
        highlightId,
        color,
        hasAnnotation,
        annotationId,
        isSearchMatch,
      });
    }

    return segments;
  }, [text, highlights, annotations, annotationsVisible, searchQuery]);

  return (
    <span className="inline">
      {renderedContent.map((segment, index) => {
        const annotation = segment.hasAnnotation && segment.annotationId
          ? annotations.find((a) => a.id === segment.annotationId)
          : null;

        const classNames: string[] = [];
        if (segment.isHighlighted && segment.color) {
          classNames.push(`highlight-${segment.color}`);
        }
        if (segment.hasAnnotation && annotationsVisible) {
          classNames.push('annotation-mark');
        }
        if (segment.isSearchMatch) {
          classNames.push('search-highlight');
        }
        if (segment.isHighlighted || segment.hasAnnotation || segment.isSearchMatch) {
          classNames.push('cursor-pointer transition-all hover:opacity-80');
        }

        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (segment.hasAnnotation && annotation && onAnnotationClick) {
            onAnnotationClick(annotation);
          } else if (segment.isHighlighted && segment.highlightId && onHighlightClick) {
            onHighlightClick(segment.highlightId);
          }
        };

        const title = segment.hasAnnotation
          ? '点击查看批注'
          : segment.isHighlighted
          ? '点击移除高亮'
          : '';

        if (classNames.length > 0) {
          return (
            <span
              key={index}
              className={classNames.join(' ')}
              onClick={handleClick}
              title={title}
            >
              {segment.text}
              {segment.hasAnnotation && annotationsVisible && (
                <span className="annotation-dot" />
              )}
            </span>
          );
        }

        return <span key={index}>{segment.text}</span>;
      })}
    </span>
  );
}
