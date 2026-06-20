import { useMemo } from 'react';
import { Archive, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useQuoteStore } from '../../store/useQuoteStore';
import { BookCover } from './BookCover';

export function ArchiveSection() {
  const books = useQuoteStore((state) => state.books);
  const openBookEditor = useQuoteStore((state) => state.openBookEditor);
  const [expanded, setExpanded] = useState(false);

  const archivedBooks = useMemo(() => books.filter((b) => b.archived), [books]);
  const hasArchivedBooks = archivedBooks.length > 0;

  if (!hasArchivedBooks) return null;

  const displayBooks = useMemo(() => {
    return expanded ? archivedBooks : archivedBooks.slice(0, 6);
  }, [expanded, archivedBooks]);

  return (
    <div className="mb-8">
      <div
        className="flex items-center justify-between mb-4 cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Archive className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-ink-600 font-serif">归档区</h3>
          <span className="text-sm text-ink-400">({archivedBooks.length} 本)</span>
        </div>
        <button className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 transition-colors">
          {expanded ? (
            <>
              <span>收起</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>展开全部</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <div className="bg-amber-100/50 rounded-2xl p-6 border border-amber-200/50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayBooks.map((book, index) => (
            <BookCover
              key={book.id}
              book={book}
              index={index}
              onEdit={() => openBookEditor(book.id)}
            />
          ))}
        </div>

        {!expanded && archivedBooks.length > 6 && (
          <div className="mt-4 text-center">
            <button
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              onClick={() => setExpanded(true)}
            >
              还有 {archivedBooks.length - 6} 本归档书籍，点击展开查看
            </button>
          </div>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent mt-8" />
    </div>
  );
}
