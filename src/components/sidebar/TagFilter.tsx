import { useQuoteStore } from '../../store/useQuoteStore';

export function TagFilter() {
  const { tags, filterTagId, setFilterTagId, quotes } = useQuoteStore();

  const getTagCount = (tagId: string) => {
    return quotes.filter((q) => q.tags.includes(tagId)).length;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setFilterTagId(null)}
        className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
          filterTagId === null
            ? 'bg-amber-600 text-white shadow-md'
            : 'bg-white/60 text-amber-700 hover:bg-white border border-amber-200'
        }`}
      >
        全部
      </button>
      {tags.map((tag) => {
        const count = getTagCount(tag.id);
        const isActive = filterTagId === tag.id;

        return (
          <button
            key={tag.id}
            onClick={() => setFilterTagId(isActive ? null : tag.id)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
              isActive
                ? 'text-white shadow-md'
                : 'bg-white/60 hover:bg-white border border-amber-200'
            }`}
            style={isActive ? { backgroundColor: tag.color } : { color: tag.color }}
          >
            {tag.name}
            <span className={`ml-1 text-xs ${isActive ? 'text-white/80' : 'opacity-60'}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
