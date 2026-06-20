import { useMemo } from 'react';
import { Plus, Archive, BookMarked, Search } from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';
import { BookCover } from './BookCover';
import { ArchiveSection } from './ArchiveSection';

export function Bookshelf() {
  const books = useQuoteStore((state) => state.books);
  const showArchive = useQuoteStore((state) => state.showArchive);
  const toggleShowArchive = useQuoteStore((state) => state.toggleShowArchive);
  const openBookEditor = useQuoteStore((state) => state.openBookEditor);

  const activeBooks = useMemo(() => books.filter((b) => !b.archived), [books]);
  const archivedBooks = useMemo(() => books.filter((b) => b.archived), [books]);

  const displayBooks = useMemo(() => {
    return showArchive ? archivedBooks : activeBooks;
  }, [showArchive, activeBooks, archivedBooks]);

  const activeCount = activeBooks.length;
  const archivedCount = archivedBooks.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-amber-200/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-amber-300/40 to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-30 backdrop-blur-md bg-amber-50/80 border-b border-amber-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-ink-800 font-serif">我的藏书阁</h1>
                  <p className="text-sm text-ink-500 font-kai">收藏每一段触动心弦的文字</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    type="text"
                    placeholder="搜索书本..."
                    className="pl-10 pr-4 py-2 w-64 rounded-lg border border-amber-200 bg-white/80 text-sm text-ink-700 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  />
                </div>

                <button
                  onClick={toggleShowArchive}
                  className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                    showArchive
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                      : 'bg-white/80 text-ink-700 border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <Archive className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {showArchive ? '归档' : '归档'}
                    <span className="ml-1 opacity-70">({archivedCount})</span>
                  </span>
                </button>

                <button
                  onClick={() => openBookEditor()}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-md hover:shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>新建书本</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-ink-700 font-serif flex items-center gap-2">
                {showArchive ? (
                  <>
                    <Archive className="w-5 h-5 text-amber-600" />
                    归档区
                  </>
                ) : (
                  <>
                    <BookMarked className="w-5 h-5 text-amber-600" />
                    我的书架
                  </>
                )}
              </h2>
              <p className="text-sm text-ink-500">
                共 {displayBooks.length} 本{showArchive ? '归档' : ''}书籍
              </p>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          </div>

          {!showArchive && <ArchiveSection />}

          {displayBooks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
                <BookMarked className="w-12 h-12 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-ink-700 mb-2 font-serif">
                {showArchive ? '暂无归档书籍' : '还没有创建任何书本'}
              </h3>
              <p className="text-ink-500 mb-6 font-kai">
                {showArchive ? '归档的书籍会显示在这里' : '点击右上角按钮创建你的第一本摘抄集'}
              </p>
              {!showArchive && (
                <button
                  onClick={() => openBookEditor()}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  创建第一本
                </button>
              )}
            </div>
          ) : (
            <div className="bookshelf-container">
              <div className="bookshelf-row mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-4">
                  {displayBooks.map((book, index) => (
                    <BookCover
                      key={book.id}
                      book={book}
                      index={index}
                      onEdit={() => openBookEditor(book.id)}
                    />
                  ))}
                </div>
                <div className="shelf-board h-4 rounded-b-lg shadow-lg" />
              </div>

              <div className="shelf-support-left" />
              <div className="shelf-support-right" />
            </div>
          )}
        </main>

        <footer className="relative z-10 py-8 text-center text-ink-500 text-sm font-kai border-t border-amber-200/50">
          <p>旧书页 · 让阅读更有仪式感</p>
        </footer>
      </div>
    </div>
  );
}
