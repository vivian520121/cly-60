import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';
import { BookPage } from './BookPage';

export function BookReader() {
  const {
    getFilteredQuotes,
    currentQuoteIndex,
    currentTemplate,
    nextPage,
    prevPage,
    isFlipping,
    flipDirection,
    toggleSidebar,
  } = useQuoteStore();

  const [isLoaded, setIsLoaded] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const filteredQuotes = getFilteredQuotes();
  const totalPages = filteredQuotes.length;

  const leftPageQuote = filteredQuotes[currentQuoteIndex] || null;
  const rightPageQuote = filteredQuotes[currentQuoteIndex + 1] || null;

  const leftPageNum = currentQuoteIndex + 1;
  const rightPageNum = currentQuoteIndex + 2;

  const hasPrev = currentQuoteIndex > 0;
  const hasNext = currentQuoteIndex + 1 < totalPages;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || isFlipping) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext) {
        nextPage();
      } else if (diff < 0 && hasPrev) {
        prevPage();
      }
    }
    
    setTouchStartX(null);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isFlipping) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevPage();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextPage();
        break;
      case 'Escape':
        toggleSidebar();
        break;
    }
  }, [isFlipping, prevPage, nextPage, toggleSidebar]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handlePrevClick = () => {
    if (hasPrev && !isFlipping) {
      prevPage();
    }
  };

  const handleNextClick = () => {
    if (hasNext && !isFlipping) {
      nextPage();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
      <div
        className={`relative transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* 书本容器 */}
        <div
          className="relative flex page-flip-container"
          style={{ perspective: '2000px' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 左页翻页动画层 */}
          {flipDirection === 'prev' && isFlipping && rightPageQuote && (
            <div className="page-flip flipping-prev active absolute z-20 w-1/2 h-full left-0">
              <div className="page-flip-front w-full h-full">
                <BookPage
                  quote={leftPageQuote}
                  pageSide="left"
                  pageNumber={leftPageNum}
                  totalPages={totalPages}
                  template={currentTemplate}
                />
              </div>
              <div className="page-flip-back w-full h-full">
                <BookPage
                  quote={rightPageQuote}
                  pageSide="right"
                  pageNumber={rightPageNum}
                  totalPages={totalPages}
                  template={currentTemplate}
                />
              </div>
            </div>
          )}

          {/* 左页 */}
          <div className="w-[40vw] md:w-[38vw] lg:w-[35vw] xl:w-[32vw] h-[70vh] md:h-[75vh] lg:h-[80vh] min-h-[500px]">
            <BookPage
              quote={leftPageQuote}
              pageSide="left"
              pageNumber={leftPageNum}
              totalPages={totalPages}
              template={currentTemplate}
            />
          </div>

          {/* 书脊 */}
          <div
            className="w-4 md:w-6 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 flex-shrink-0 shadow-inner"
            style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)' }}
          />

          {/* 右页 */}
          <div className="w-[40vw] md:w-[38vw] lg:w-[35vw] xl:w-[32vw] h-[70vh] md:h-[75vh] lg:h-[80vh] min-h-[500px]">
            <BookPage
              quote={rightPageQuote}
              pageSide="right"
              pageNumber={rightPageNum}
              totalPages={totalPages}
              template={currentTemplate}
            />
          </div>

          {/* 右页翻页动画层 */}
          {flipDirection === 'next' && isFlipping && rightPageQuote && (
            <div className="page-flip flipping-next active absolute z-20 w-1/2 h-full right-0">
              <div className="page-flip-front w-full h-full">
                <BookPage
                  quote={rightPageQuote}
                  pageSide="right"
                  pageNumber={rightPageNum}
                  totalPages={totalPages}
                  template={currentTemplate}
                />
              </div>
              <div className="page-flip-back w-full h-full">
                <BookPage
                  quote={filteredQuotes[currentQuoteIndex + 2] || null}
                  pageSide="left"
                  pageNumber={rightPageNum + 1}
                  totalPages={totalPages}
                  template={currentTemplate}
                />
              </div>
            </div>
          )}
        </div>

        {/* 翻页按钮 - 左 */}
        <button
          onClick={handlePrevClick}
          disabled={!hasPrev || isFlipping}
          className={`hidden md:flex absolute left-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center transition-all duration-300 ${
            hasPrev && !isFlipping
              ? 'bg-white/80 text-amber-700 hover:bg-white hover:scale-110 shadow-lg'
              : 'bg-white/30 text-amber-400 cursor-not-allowed'
          }`}
          title="上一页"
        >
          <ChevronLeft size={24} />
        </button>

        {/* 翻页按钮 - 右 */}
        <button
          onClick={handleNextClick}
          disabled={!hasNext || isFlipping}
          className={`hidden md:flex absolute right-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center transition-all duration-300 ${
            hasNext && !isFlipping
              ? 'bg-white/80 text-amber-700 hover:bg-white hover:scale-110 shadow-lg'
              : 'bg-white/30 text-amber-400 cursor-not-allowed'
          }`}
          title="下一页"
        >
          <ChevronRight size={24} />
        </button>

        {/* 移动端翻页按钮 */}
        <div className="md:hidden flex justify-center gap-8 mt-6">
          <button
            onClick={handlePrevClick}
            disabled={!hasPrev || isFlipping}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              hasPrev && !isFlipping
                ? 'bg-white/80 text-amber-700 shadow-lg'
                : 'bg-white/30 text-amber-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNextClick}
            disabled={!hasNext || isFlipping}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              hasNext && !isFlipping
                ? 'bg-white/80 text-amber-700 shadow-lg'
                : 'bg-white/30 text-amber-400 cursor-not-allowed'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 页码指示器 */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-amber-700/60 text-sm font-serif">
          {leftPageNum} — {Math.min(rightPageNum, totalPages)} / {totalPages}
        </div>
      </div>
    </div>
  );
}
