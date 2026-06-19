import { useQuoteStore } from '../../store/useQuoteStore';
import { BookOpen, Trash2, Edit2, Bookmark } from 'lucide-react';

export function QuoteList() {
  const {
    getFilteredQuotes,
    currentQuoteIndex,
    goToPage,
    toggleSidebar,
    openEditor,
    deleteQuote,
    getTagById,
  } = useQuoteStore();

  const filteredQuotes = getFilteredQuotes();

  const handleQuoteClick = (index: number) => {
    goToPage(index);
    toggleSidebar();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这条摘抄吗？')) {
      deleteQuote(id);
    }
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    openEditor(id);
  };

  if (filteredQuotes.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <BookOpen size={48} className="text-amber-300 mb-4" />
        <p className="text-amber-600 text-sm">暂无摘抄</p>
        <p className="text-amber-400 text-xs mt-1">点击 + 开始记录你的第一条金句</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-4 space-y-2">
      {filteredQuotes.map((quote, index) => {
        const isActive = index === currentQuoteIndex;

        const bgColor =
          quote.template === 'ancient'
            ? 'bg-amber-50'
            : quote.template === 'notebook'
            ? 'bg-slate-50'
            : quote.template === 'newspaper'
            ? 'bg-stone-100'
            : 'bg-gray-50';

        const textColor =
          quote.template === 'ancient'
            ? 'text-amber-800'
            : quote.template === 'notebook'
            ? 'text-slate-700'
            : quote.template === 'newspaper'
            ? 'text-gray-800'
            : 'text-slate-700';

        return (
          <div
            key={quote.id}
            onClick={() => handleQuoteClick(index)}
            className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              isActive
                ? `${bgColor} shadow-md ring-2 ring-amber-300 scale-[1.02]`
                : 'bg-white/50 hover:bg-white hover:shadow-sm'
            }`}
          >
            {quote.bookmarked && (
              <div className="absolute top-0 right-3">
                <Bookmark size={16} className="text-red-500 fill-red-500" />
              </div>
            )}

            <h4 className={`font-medium text-sm ${textColor} mb-1 pr-5 line-clamp-1 font-serif`}>
              {quote.bookTitle}
            </h4>

            <p className={`text-xs ${textColor} opacity-70 mb-2 line-clamp-2`}>
              {quote.content}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-500">
                {quote.author} · p.{quote.pageNumber}
              </span>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleEdit(e, quote.id)}
                  className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-amber-600 hover:bg-amber-100 transition-colors"
                  title="编辑"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, quote.id)}
                  className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                  title="删除"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {quote.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {quote.tags.slice(0, 3).map((tagId) => {
                  const tag = getTagById(tagId);
                  if (!tag) return null;
                  return (
                    <span
                      key={tagId}
                      className="px-2 py-0.5 rounded-full text-xs text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  );
                })}
                {quote.tags.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full text-xs text-amber-500 bg-amber-50">
                    +{quote.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
