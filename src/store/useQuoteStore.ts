import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Quote,
  Tag,
  BookTemplate,
  HighlightColor,
  ActiveTool,
  QuoteStore,
  Highlight,
  Annotation,
  PageSettings,
} from '../types';

const generateId = () => Math.random().toString(36).substring(2, 11);

const defaultPageSettings: PageSettings = {
  yellowing: 30,
  roughness: 30,
  margin: 50,
};

const defaultTags: Tag[] = [
  { id: 'tag-1', name: '治愈', color: '#7cb342' },
  { id: 'tag-2', name: '哲学', color: '#5c6bc0' },
  { id: 'tag-3', name: '诗歌', color: '#ec407a' },
  { id: 'tag-4', name: '小说', color: '#ff7043' },
  { id: 'tag-5', name: '散文', color: '#26a69a' },
];

const defaultQuotes: Quote[] = [
  {
    id: 'quote-1',
    content: '生活不可能像你想象的那么好，但也不会像你想象的那么糟。我觉得人的脆弱和坚强都超乎自己的想象。有时，我可能脆弱得一句话就泪流满面；有时，也发现自己咬着牙走了很长的路。',
    bookTitle: '羊脂球',
    author: '莫泊桑',
    pageNumber: '47',
    tags: ['tag-1', 'tag-2'],
    template: 'ancient',
    highlights: [
      { id: 'h1', startIndex: 0, endIndex: 16, color: 'yellow' },
      { id: 'h2', startIndex: 45, endIndex: 62, color: 'pink' },
    ],
    annotations: [
      { id: 'a1', content: '生活总是在好与坏之间摇摆', position: 30, startIndex: 28, endIndex: 44 },
    ],
    bookmarked: true,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'quote-2',
    content: '我们都在阴沟里，但仍有人仰望星空。我们都在阴沟里，但仍有人仰望星空。',
    bookTitle: '温夫人的扇子',
    author: '奥斯卡·王尔德',
    pageNumber: '12',
    tags: ['tag-2', 'tag-3'],
    template: 'notebook',
    highlights: [
      { id: 'h3', startIndex: 0, endIndex: 14, color: 'blue' },
    ],
    annotations: [],
    bookmarked: false,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'quote-3',
    content: '从前的日色变得慢，车、马、邮件都慢，一生只够爱一个人。',
    bookTitle: '从前慢',
    author: '木心',
    pageNumber: '23',
    tags: ['tag-3', 'tag-1'],
    template: 'letter',
    highlights: [
      { id: 'h4', startIndex: 0, endIndex: 12, color: 'green' },
    ],
    annotations: [
      { id: 'a2', content: '喜欢这种慢生活的意境', position: 10, startIndex: 0, endIndex: 12 },
    ],
    bookmarked: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'quote-4',
    content: '人最宝贵的是生命，生命对人来说只有一次。人的一生应当这样度过：当回忆往事的时候，他不会因为虚度年华而悔恨，也不会因为碌碌无为而羞愧。',
    bookTitle: '钢铁是怎样炼成的',
    author: '奥斯特洛夫斯基',
    pageNumber: '89',
    tags: ['tag-2', 'tag-4'],
    template: 'newspaper',
    highlights: [
      { id: 'h5', startIndex: 0, endIndex: 18, color: 'yellow' },
    ],
    annotations: [],
    bookmarked: false,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'quote-5',
    content: '愿你所有的快乐，无需假装；愿你此生尽兴，赤诚善良。愿时光能缓，愿故人不散；愿有人陪你颠沛流离，愿你惦念的人能和你道早安，愿你独闯的日子里不觉得孤单。',
    bookTitle: '愿你',
    author: '佚名',
    pageNumber: '15',
    tags: ['tag-1', 'tag-3'],
    template: 'ancient',
    highlights: [],
    annotations: [],
    bookmarked: false,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'quote-6',
    content: '满地都是六便士，他却抬头看见了月亮。',
    bookTitle: '月亮与六便士',
    author: '毛姆',
    pageNumber: '56',
    tags: ['tag-4', 'tag-2'],
    template: 'notebook',
    highlights: [
      { id: 'h6', startIndex: 0, endIndex: 14, color: 'yellow' },
    ],
    annotations: [
      { id: 'a3', content: '理想与现实的抉择', position: 5, startIndex: 0, endIndex: 14 },
    ],
    bookmarked: true,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      quotes: defaultQuotes,
      tags: defaultTags,
      currentQuoteIndex: 0,
      currentTemplate: 'ancient',
      activeTool: 'none',
      sidebarOpen: false,
      filterTagId: null,
      highlightColor: 'yellow',
      editorOpen: false,
      editingQuoteId: null,
      isFlipping: false,
      flipDirection: null,
      pageSettings: defaultPageSettings,
      pageSettingsOpen: false,
      annotationsVisible: true,

      setCurrentTemplate: (template: BookTemplate) => set({ currentTemplate: template }),

      setPageSettings: (settings: Partial<PageSettings>) =>
        set((state) => ({
          pageSettings: { ...state.pageSettings, ...settings },
        })),

      togglePageSettings: () =>
        set((state) => ({ pageSettingsOpen: !state.pageSettingsOpen })),

      setActiveTool: (tool: ActiveTool) => set({ activeTool: tool }),

      setHighlightColor: (color: HighlightColor) => set({ highlightColor: color }),

      toggleAnnotations: () =>
        set((state) => ({ annotationsVisible: !state.annotationsVisible })),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setFilterTagId: (tagId: string | null) => {
        set({ filterTagId: tagId, currentQuoteIndex: 0 });
      },

      openEditor: (quoteId?: string) => {
        set({
          editorOpen: true,
          editingQuoteId: quoteId || null,
        });
      },

      closeEditor: () => {
        set({
          editorOpen: false,
          editingQuoteId: null,
        });
      },

      addQuote: (quoteData) => {
        const newQuote: Quote = {
          ...quoteData,
          id: generateId(),
          order: get().quotes.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          quotes: [...state.quotes, newQuote],
        }));
      },

      updateQuote: (id, updates) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id
              ? { ...q, ...updates, updatedAt: new Date().toISOString() }
              : q
          ),
        }));
      },

      deleteQuote: (id) => {
        set((state) => {
          const filtered = state.quotes.filter((q) => q.id !== id);
          const currentIndex = Math.min(state.currentQuoteIndex, Math.max(0, filtered.length - 1));
          return {
            quotes: filtered,
            currentQuoteIndex: currentIndex,
          };
        });
      },

      addHighlight: (quoteId, highlight) => {
        const newHighlight: Highlight = {
          ...highlight,
          id: generateId(),
        };
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === quoteId
              ? {
                  ...q,
                  highlights: [...q.highlights, newHighlight],
                  updatedAt: new Date().toISOString(),
                }
              : q
          ),
        }));
      },

      removeHighlight: (quoteId, highlightId) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === quoteId
              ? {
                  ...q,
                  highlights: q.highlights.filter((h) => h.id !== highlightId),
                  updatedAt: new Date().toISOString(),
                }
              : q
          ),
        }));
      },

      addAnnotation: (quoteId, annotation) => {
        const newAnnotation: Annotation = {
          ...annotation,
          id: generateId(),
        };
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === quoteId
              ? {
                  ...q,
                  annotations: [...q.annotations, newAnnotation],
                  updatedAt: new Date().toISOString(),
                }
              : q
          ),
        }));
      },

      removeAnnotation: (quoteId, annotationId) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === quoteId
              ? {
                  ...q,
                  annotations: q.annotations.filter((a) => a.id !== annotationId),
                  updatedAt: new Date().toISOString(),
                }
              : q
          ),
        }));
      },

      updateAnnotation: (quoteId, annotationId, content) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === quoteId
              ? {
                  ...q,
                  annotations: q.annotations.map((a) =>
                    a.id === annotationId ? { ...a, content } : a
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : q
          ),
        }));
      },

      toggleBookmark: (quoteId) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === quoteId
              ? { ...q, bookmarked: !q.bookmarked, updatedAt: new Date().toISOString() }
              : q
          ),
        }));
      },

      addTag: (tag) => {
        const newTag: Tag = {
          ...tag,
          id: generateId(),
        };
        set((state) => ({
          tags: [...state.tags, newTag],
        }));
      },

      removeTag: (tagId) => {
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== tagId),
          quotes: state.quotes.map((q) => ({
            ...q,
            tags: q.tags.filter((t) => t !== tagId),
          })),
          filterTagId: state.filterTagId === tagId ? null : state.filterTagId,
        }));
      },

      nextPage: () => {
        const state = get();
        const filtered = state.getFilteredQuotes();
        if (state.currentQuoteIndex < filtered.length - 1) {
          set({ isFlipping: true, flipDirection: 'next' });
          setTimeout(() => {
            set((s) => ({
              currentQuoteIndex: s.currentQuoteIndex + 1,
              isFlipping: false,
              flipDirection: null,
            }));
          }, 500);
        }
      },

      prevPage: () => {
        const state = get();
        if (state.currentQuoteIndex > 0) {
          set({ isFlipping: true, flipDirection: 'prev' });
          setTimeout(() => {
            set((s) => ({
              currentQuoteIndex: s.currentQuoteIndex - 1,
              isFlipping: false,
              flipDirection: null,
            }));
          }, 500);
        }
      },

      goToPage: (index) => {
        const filtered = get().getFilteredQuotes();
        if (index >= 0 && index < filtered.length) {
          set({ currentQuoteIndex: index });
        }
      },

      getFilteredQuotes: () => {
        const state = get();
        if (!state.filterTagId) {
          return [...state.quotes].sort((a, b) => a.order - b.order);
        }
        return state.quotes
          .filter((q) => q.tags.includes(state.filterTagId!))
          .sort((a, b) => a.order - b.order);
      },

      getCurrentQuote: () => {
        const filtered = get().getFilteredQuotes();
        return filtered[get().currentQuoteIndex] || null;
      },

      getNextQuote: () => {
        const filtered = get().getFilteredQuotes();
        const nextIndex = get().currentQuoteIndex + 1;
        return filtered[nextIndex] || null;
      },

      getTagById: (id) => {
        return get().tags.find((t) => t.id === id);
      },
    }),
    {
      name: 'quote-book-storage',
      partialize: (state) => ({
        quotes: state.quotes,
        tags: state.tags,
        currentTemplate: state.currentTemplate,
        pageSettings: state.pageSettings,
      }),
    }
  )
);
