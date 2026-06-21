import { useRef, useState, useCallback, useEffect } from 'react';
import type { Quote, BookTemplate, Annotation, HighlightColor } from '../../types';
import { HighlightedText } from '../marks/HighlightedText';
import { useQuoteStore } from '../../store/useQuoteStore';

interface BookPageProps {
  quote: Quote | null;
  pageSide: 'left' | 'right';
  pageNumber: number;
  totalPages: number;
  template?: BookTemplate;
}

export function BookPage({ quote, pageSide, pageNumber, totalPages, template }: BookPageProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const annotationInputRef = useRef<HTMLTextAreaElement>(null);
  const {
    activeTool,
    highlightColor,
    addHighlight,
    removeHighlight,
    addAnnotation,
    removeAnnotation,
    toggleBookmark,
    currentTemplate,
    pageSettings,
    annotationsVisible,
    searchQuery,
    searchHighlightQuoteId,
  } = useQuoteStore();

  const [showAnnotationInput, setShowAnnotationInput] = useState(false);
  const [annotationPosition, setAnnotationPosition] = useState(0);
  const [annotationStartIndex, setAnnotationStartIndex] = useState(0);
  const [annotationEndIndex, setAnnotationEndIndex] = useState(0);
  const [annotationText, setAnnotationText] = useState('');

  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);

  useEffect(() => {
    if (showAnnotationInput && annotationInputRef.current) {
      setTimeout(() => {
        annotationInputRef.current?.focus();
      }, 0);
    }
  }, [showAnnotationInput]);

  const pageTemplate = template || quote?.template || currentTemplate;

  const roughnessOpacity = (pageSettings.roughness / 100) * 0.25;
  const yellowingOpacity = (pageSettings.yellowing / 100) * 0.6;
  const paddingValue = `${2 + (pageSettings.margin / 100) * 4}rem`;

  const pageStyle = {
    '--paper-roughness': roughnessOpacity,
    '--paper-yellowing': yellowingOpacity,
  } as React.CSSProperties;

  const getTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !contentRef.current) return null;

    const range = selection.getRangeAt(0);
    const selectedStr = selection.toString().trim();

    if (!selectedStr || !contentRef.current.contains(range.startContainer)) {
      return null;
    }

    const fullText = quote?.content || '';
    const startIndex = fullText.indexOf(selectedStr);

    if (startIndex === -1) {
      return null;
    }

    const endIndex = startIndex + selectedStr.length;

    return { text: selectedStr, startIndex, endIndex };
  }, [quote?.content]);

  const handleMouseUp = useCallback(() => {
    if (!quote || showAnnotationInput) return;

    if (activeTool === 'highlight') {
      const selection = getTextSelection();
      if (selection && selection.text.trim()) {
        addHighlight(quote.id, {
          startIndex: selection.startIndex,
          endIndex: selection.endIndex,
          color: highlightColor as HighlightColor,
        });
      }
    } else if (activeTool === 'annotation') {
      const selection = getTextSelection();
      if (selection) {
        setAnnotationPosition(selection.startIndex);
        setAnnotationStartIndex(selection.startIndex);
        setAnnotationEndIndex(selection.endIndex);
        setShowAnnotationInput(true);
        setAnnotationText('');
      }
    }

    if (activeTool === 'highlight' || activeTool === 'annotation') {
      window.getSelection()?.removeAllRanges();
    }
  }, [activeTool, quote, getTextSelection, addHighlight, highlightColor, showAnnotationInput]);

  const handleAddAnnotation = () => {
    if (quote && annotationText.trim()) {
      addAnnotation(quote.id, {
        content: annotationText,
        position: annotationPosition,
        startIndex: annotationStartIndex,
        endIndex: annotationEndIndex,
      });
    }
    setShowAnnotationInput(false);
    setAnnotationText('');
  };

  const handlePageClick = () => {
    if (activeTool === 'bookmark' && quote) {
      toggleBookmark(quote.id);
    }
  };

  const handleHighlightClick = (highlightId: string) => {
    if (quote && activeTool === 'highlight') {
      removeHighlight(quote.id, highlightId);
    }
  };

  const handleAnnotationClick = (annotation: Annotation) => {
    setSelectedAnnotation(annotation);
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    if (quote) {
      removeAnnotation(quote.id, annotationId);
    }
    setSelectedAnnotation(null);
  };

  const pageBgClass =
    pageTemplate === 'ancient'
      ? 'bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100'
      : pageTemplate === 'notebook'
      ? 'bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50'
      : pageTemplate === 'newspaper'
      ? 'bg-gradient-to-br from-stone-100 via-gray-100 to-zinc-100'
      : 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50';

  const textColorClass =
    pageTemplate === 'ancient'
      ? 'text-amber-900'
      : pageTemplate === 'notebook'
      ? 'text-slate-800'
      : pageTemplate === 'newspaper'
      ? 'text-gray-900'
      : 'text-slate-900';

  const textLightClass =
    pageTemplate === 'ancient'
      ? 'text-amber-700'
      : pageTemplate === 'notebook'
      ? 'text-slate-600'
      : pageTemplate === 'newspaper'
      ? 'text-gray-600'
      : 'text-slate-600';

  const accentClass =
    pageTemplate === 'ancient'
      ? 'text-amber-600'
      : pageTemplate === 'notebook'
      ? 'text-blue-600'
      : pageTemplate === 'newspaper'
      ? 'text-red-700'
      : 'text-blue-800';

  const titleFontClass = pageTemplate === 'letter' ? 'font-kai' : 'font-serif';
  const bodyFontClass = pageTemplate === 'letter' ? 'font-kai' : pageTemplate === 'notebook' ? 'font-sans' : 'font-serif';

  const contentBgClass =
    pageTemplate === 'notebook'
      ? 'notebook-lines'
      : pageTemplate === 'letter'
      ? 'letter-header-line'
      : '';

  if (!quote) {
    return (
      <div
        className={`book-page paper-texture ${
          pageSide === 'left' ? 'book-page-left' : 'book-page-right'
        } ${pageBgClass} flex-1 h-full flex items-center justify-center`}
        style={pageStyle}
      >
        <div className="yellowing-overlay" />
        <p className={`${textLightClass} text-lg opacity-50 relative z-10`}>无内容</p>
      </div>
    );
  }

  return (
    <div
      className={`book-page paper-texture ${
        pageSide === 'left' ? 'book-page-left page-edge-left' : 'book-page-right page-edge-right'
      } ${pageBgClass} flex-1 h-full relative overflow-hidden flex flex-col ${
        quote && searchHighlightQuoteId === quote.id ? 'search-page-glow' : ''
      }`}
      style={pageStyle}
      onClick={handlePageClick}
      onMouseUp={handleMouseUp}
    >
      <div className="yellowing-overlay" />

      {quote.bookmarked && (
        <div className="bookmark-ribbon relative z-10" style={{ right: pageSide === 'left' ? '20px' : 'auto', left: pageSide === 'right' ? '20px' : 'auto' }}>
        </div>
      )}

      <div className="flex-1 flex flex-col relative z-10" style={{ padding: paddingValue }}>
        <div className={`mb-6 ${pageTemplate === 'newspaper' ? 'border-b-2 border-gray-400 pb-4' : ''}`}>
          <h2
            className={`text-xl md:text-2xl font-semibold ${textColorClass} ${titleFontClass} mb-2 text-shadow-soft`}
          >
            {quote.bookTitle}
          </h2>
          <p className={`${textLightClass} text-sm ${bodyFontClass}`}>
            {quote.author} · 第 {quote.pageNumber} 页
          </p>
        </div>

        <div
          ref={contentRef}
          className={`flex-1 ${textColorClass} ${bodyFontClass} text-base md:text-lg ${contentBgClass} select-text`}
        >
          <HighlightedText
            text={quote.content}
            highlights={quote.highlights}
            annotations={quote.annotations}
            annotationsVisible={annotationsVisible}
            searchQuery={searchQuery}
            onHighlightClick={handleHighlightClick}
            onAnnotationClick={handleAnnotationClick}
          />
        </div>

        {annotationsVisible &&
          quote.annotations.map((annotation: Annotation) => {
            const totalLength = quote.content.length || 1;
            const positionRatio = Math.min(Math.max(annotation.position / totalLength, 0.08), 0.85);
            const topPercent = 15 + positionRatio * 65;
            return (
              <div
                key={annotation.id}
                className="annotation-bubble cursor-pointer hover:scale-105 transition-transform"
                style={{
                  top: `${topPercent}%`,
                  left: pageSide === 'left' ? 'auto' : '90%',
                  right: pageSide === 'left' ? '90%' : 'auto',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAnnotation(annotation);
                }}
              >
                {annotation.content}
              </div>
            );
          })}

        <div className={`mt-6 text-center ${textLightClass} text-sm ${bodyFontClass} opacity-70`}>
          — {pageNumber} / {totalPages} —
        </div>
      </div>

      {showAnnotationInput && (
        <div
          className="absolute inset-0 bg-black/20 flex items-center justify-center z-50"
          onClick={() => setShowAnnotationInput(false)}
          onMouseUp={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white rounded-lg p-4 shadow-xl w-72"
            onClick={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
          >
            <h3 className={`text-sm font-medium mb-3 ${textColorClass}`}>添加批注</h3>
            <textarea
              ref={annotationInputRef}
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
              className={`w-full h-24 p-2 border rounded-md text-sm ${bodyFontClass} focus:outline-none focus:ring-2 ${
                pageTemplate === 'ancient' ? 'focus:ring-amber-300 border-amber-200' :
                pageTemplate === 'notebook' ? 'focus:ring-blue-300 border-blue-200' :
                pageTemplate === 'newspaper' ? 'focus:ring-red-300 border-red-200' :
                'focus:ring-blue-300 border-blue-200'
              }`}
              placeholder="写下你的想法..."
              onMouseUp={(e) => e.stopPropagation()}
            />
            <div className="flex justify-end gap-2 mt-3" onMouseUp={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowAnnotationInput(false)}
                className={`px-3 py-1 text-sm rounded ${textLightClass} hover:bg-gray-100`}
                onMouseUp={(e) => e.stopPropagation()}
              >
                取消
              </button>
              <button
                onClick={handleAddAnnotation}
                className={`px-3 py-1 text-sm rounded text-white ${accentClass.replace('text-', 'bg-')}`}
                onMouseUp={(e) => e.stopPropagation()}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAnnotation && (
        <div
          className="absolute inset-0 bg-black/20 flex items-center justify-center z-50"
          onClick={() => setSelectedAnnotation(null)}
          onMouseUp={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white rounded-lg p-4 shadow-xl w-80"
            onClick={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-medium ${textColorClass}`}>批注</h3>
              <button
                onClick={() => handleDeleteAnnotation(selectedAnnotation.id)}
                className="text-red-500 hover:text-red-600 text-xs hover:bg-red-50 px-2 py-1 rounded transition-colors"
                onMouseUp={(e) => e.stopPropagation()}
              >
                删除
              </button>
            </div>
            <div
              className={`text-sm ${textColorClass} ${bodyFontClass} leading-relaxed bg-amber-50 p-3 rounded-md border border-amber-200`}
            >
              {selectedAnnotation.content}
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={() => setSelectedAnnotation(null)}
                className={`px-4 py-1.5 text-sm rounded ${accentClass.replace('text-', 'bg-')} text-white hover:opacity-90 transition-opacity`}
                onMouseUp={(e) => e.stopPropagation()}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
