import { useEffect, useRef } from 'react';
import { Search, X, FileText, MessageSquare, Bookmark, ChevronRight } from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';
import type { SearchMatch, SearchMatchType } from '../../types';

const typeConfig: Record<SearchMatchType, { icon: typeof FileText; label: string; color: string; bgColor: string }> = {
  content: { icon: FileText, label: '摘抄内容', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  annotation: { icon: MessageSquare, label: '手写批注', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  bookmark: { icon: Bookmark, label: '书签标记', color: 'text-red-700', bgColor: 'bg-red-100' },
};

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const parts: Array<{ text: string; isMatch: boolean }> = [];
  let lastIndex = 0;
  let idx = lowerText.indexOf(lowerQuery);

  while (idx !== -1) {
    if (idx > lastIndex) {
      parts.push({ text: text.slice(lastIndex, idx), isMatch: false });
    }
    parts.push({ text: text.slice(idx, idx + query.length), isMatch: true });
    lastIndex = idx + query.length;
    idx = lowerText.indexOf(lowerQuery, lastIndex);
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isMatch: false });
  }

  if (parts.length === 0) {
    return text;
  }

  return parts.map((part, i) =>
    part.isMatch ? (
      <mark key={i} className="bg-yellow-300 rounded px-0.5 text-amber-900 font-medium">
        {part.text}
      </mark>
    ) : (
      part.text
    )
  );
}

function getSnippet(text: string, startIndex: number, endIndex: number, query: string) {
  const contextLength = 20;
  const snippetStart = Math.max(0, startIndex - contextLength);
  const snippetEnd = Math.min(text.length, endIndex + contextLength);

  let snippet = '';
  if (snippetStart > 0) snippet += '...';
  snippet += text.slice(snippetStart, snippetEnd);
  if (snippetEnd < text.length) snippet += '...';

  return snippet;
}

export function SearchModal() {
  const {
    searchOpen,
    toggleSearch,
    searchQuery,
    setSearchQuery,
    performSearch,
    searchResults,
    clearSearch,
    jumpToSearchResult,
    getQuoteById,
  } = useQuoteStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        handleClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        if (!searchOpen) {
          toggleSearch();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, toggleSearch]);

  const handleClose = () => {
    clearSearch();
    toggleSearch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    performSearch(value);
  };

  const handleResultClick = (match: SearchMatch) => {
    jumpToSearchResult(match);
  };

  if (!searchOpen) return null;

  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.quoteId]) {
      acc[result.quoteId] = [];
    }
    acc[result.quoteId].push(result);
    return acc;
  }, {} as Record<string, SearchMatch[]>);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      <div className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-16 md:top-24 w-full md:w-[640px] max-h-[70vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Search size={20} className="text-amber-600" />
            </div>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="搜索摘抄内容、批注、书签..."
                className="w-full px-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    performSearch('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span>
              共找到 <span className="font-semibold text-amber-600">{searchResults.length}</span> 条匹配结果
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">ESC</kbd> 关闭
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchQuery.trim() === '' ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                <Search size={32} className="text-amber-300" />
              </div>
              <p className="text-gray-600 font-medium">输入关键词开始搜索</p>
              <p className="text-gray-400 text-sm mt-1">可搜索摘抄文字、手写批注、书签</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <FileText size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-600 font-medium">未找到相关内容</p>
              <p className="text-gray-400 text-sm mt-1">试试其他关键词吧</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {Object.entries(groupedResults).map(([quoteId, matches]) => {
                const quote = getQuoteById(quoteId);
                if (!quote) return null;

                return (
                  <div
                    key={quoteId}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-serif font-semibold text-gray-800">{quote.bookTitle}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {quote.author} · 第 {quote.pageNumber} 页
                        </p>
                      </div>
                      {quote.bookmarked && (
                        <Bookmark size={16} className="text-red-500 fill-red-500 flex-shrink-0" />
                      )}
                    </div>

                    <div className="space-y-2">
                      {matches.map((match, idx) => {
                        const config = typeConfig[match.type];
                        const Icon = config.icon;
                        const snippet = getSnippet(
                          match.type === 'annotation' && match.annotationContent
                            ? match.annotationContent
                            : match.text,
                          match.type === 'annotation' ? 0 : match.startIndex,
                          match.type === 'annotation' ? match.matchedText.length : match.endIndex,
                          searchQuery
                        );

                        return (
                          <button
                            key={idx}
                            onClick={() => handleResultClick(match)}
                            className="w-full text-left group"
                          >
                            <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-white transition-colors">
                              <div className={`w-6 h-6 rounded-md ${config.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                <Icon size={14} className={config.color} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-medium ${config.color}`}>
                                    {config.label}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                                  {highlightText(snippet, searchQuery)}
                                </p>
                              </div>
                              <ChevronRight
                                size={16}
                                className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1"
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
