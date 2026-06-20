import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Tag, FileText, Calendar, MoreVertical, Copy, Archive, Trash2, Edit3 } from 'lucide-react';
import type { Book } from '../../types';
import { useQuoteStore } from '../../store/useQuoteStore';
import {
  getCoverStyle,
  getCoverPattern,
  getCoverTextColor,
  getCoverBorderColor,
  formatDate,
} from '../../utils/bookCovers';

interface BookCoverProps {
  book: Book;
  index: number;
  onEdit?: () => void;
}

export function BookCover({ book, index, onEdit }: BookCoverProps) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [hovered, setHovered] = useState(false);

  const quotes = useQuoteStore((state) => state.quotes);
  const setCurrentBookId = useQuoteStore((state) => state.setCurrentBookId);
  const duplicateBook = useQuoteStore((state) => state.duplicateBook);
  const archiveBook = useQuoteStore((state) => state.archiveBook);
  const unarchiveBook = useQuoteStore((state) => state.unarchiveBook);
  const deleteBook = useQuoteStore((state) => state.deleteBook);

  const quoteCount = useMemo(() => {
    return quotes.filter((q) => q.bookId === book.id).length;
  }, [quotes, book.id]);

  const tagCount = useMemo(() => {
    const bookQuotes = quotes.filter((q) => q.bookId === book.id);
    const tagSet = new Set<string>();
    bookQuotes.forEach((q) => q.tags.forEach((t) => tagSet.add(t)));
    return tagSet.size;
  }, [quotes, book.id]);

  const coverStyle = useMemo(() => getCoverStyle(book.cover), [book.cover]);
  const pattern = useMemo(() => getCoverPattern(book.cover), [book.cover]);
  const textColor = useMemo(() => getCoverTextColor(book.cover), [book.cover]);
  const borderColor = useMemo(() => getCoverBorderColor(book.cover), [book.cover]);

  const handleClick = () => {
    if (showMenu) return;
    setCurrentBookId(book.id);
    navigate('/read');
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateBook(book.id);
    setShowMenu(false);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.archived) {
      unarchiveBook(book.id);
    } else {
      archiveBook(book.id);
    }
    setShowMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`确定要删除《${book.name}》吗？所有摘抄内容将一并删除。`)) {
      deleteBook(book.id);
    }
    setShowMenu(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
    setShowMenu(false);
  };

  const animationDelay = `${index * 0.05}s`;

  return (
    <div
      className="relative group animate-fade-in-up"
      style={{ animationDelay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowMenu(false);
      }}
    >
      <div
        className="book-cover-container relative cursor-pointer transform transition-all duration-300 ease-out"
        style={{
          perspective: '1000px',
          transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        }}
        onClick={handleClick}
      >
        <div
          className="book-cover-3d relative w-full rounded-r-md overflow-hidden shadow-book"
          style={{
            aspectRatio: '3 / 4',
            ...coverStyle,
            borderLeft: `8px solid ${borderColor}`,
            boxShadow: `
              inset -4px 0 8px rgba(0, 0, 0, 0.2),
              inset 4px 0 8px rgba(255, 255, 255, 0.1),
              8px 8px 24px rgba(0, 0, 0, 0.3),
              0 4px 12px rgba(0, 0, 0, 0.2)
            `,
          }}
        >
          {pattern && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: pattern }}
            />
          )}

          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 30%, rgba(0,0,0,0.1) 100%)',
            }}
          />

          <div className="relative z-10 h-full flex flex-col items-center justify-between py-6 px-4">
            <div className="text-center">
              <div
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${borderColor} 0%, ${textColor} 100%)`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                <BookOpen className="w-6 h-6" style={{ color: '#1a1a2e' }} />
              </div>

              <h3
                className="font-serif text-lg font-bold leading-tight mb-1 line-clamp-2"
                style={{ color: textColor, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {book.name}
              </h3>

              {book.description && (
                <p
                  className="text-xs line-clamp-2 opacity-80 font-kai"
                  style={{ color: textColor }}
                >
                  {book.description}
                </p>
              )}
            </div>

            <div className="w-full space-y-1.5">
              <div className="flex items-center justify-between text-xs" style={{ color: textColor }}>
                <div className="flex items-center gap-1 opacity-80">
                  <FileText className="w-3 h-3" />
                  <span>{quoteCount} 段</span>
                </div>
                <div className="flex items-center gap-1 opacity-80">
                  <Tag className="w-3 h-3" />
                  <span>{tagCount} 标签</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 text-xs opacity-70" style={{ color: textColor }}>
                <Calendar className="w-3 h-3" />
                <span>{formatDate(book.createdAt)}</span>
              </div>
            </div>
          </div>

          <div
            className="absolute top-0 right-0 w-0 h-0 pointer-events-none"
            style={{
              borderTop: `24px solid ${borderColor}`,
              borderLeft: '24px solid transparent',
              opacity: 0.8,
            }}
          />

          {book.archived && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-r-md">
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium transform -rotate-3">
                已归档
              </div>
            </div>
          )}
        </div>

        <div
          className="absolute -top-1 left-0 w-full h-2 rounded-t-sm"
          style={{
            background: `linear-gradient(to bottom, ${borderColor}, transparent)`,
            boxShadow: '0 -1px 3px rgba(0,0,0,0.2)',
          }}
        />

        <div
          className="absolute -bottom-1 left-0 w-full h-2 rounded-b-sm"
          style={{
            background: `linear-gradient(to top, ${borderColor}, transparent)`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>

      <div
        className={`absolute top-2 right-2 transition-all duration-200 z-20 ${
          hovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <button
          className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <MoreVertical className="w-4 h-4 text-white" />
        </button>

        {showMenu && (
          <div
            className="absolute top-full right-0 mt-1 w-36 bg-white rounded-lg shadow-xl py-1 z-30 animate-fade-in"
            style={{ animationDuration: '0.2s' }}
          >
            <button
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              onClick={handleEdit}
            >
              <Edit3 className="w-4 h-4" />
              编辑
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              onClick={handleDuplicate}
            >
              <Copy className="w-4 h-4" />
              复制
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              onClick={handleArchive}
            >
              <Archive className="w-4 h-4" />
              {book.archived ? '恢复' : '归档'}
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
