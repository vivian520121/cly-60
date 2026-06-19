export type BookTemplate = 'ancient' | 'notebook' | 'newspaper' | 'letter';

export interface PageSettings {
  yellowing: number;
  roughness: number;
  margin: number;
}

export type HighlightColor = 'yellow' | 'green' | 'pink' | 'blue';

export interface Highlight {
  id: string;
  startIndex: number;
  endIndex: number;
  color: HighlightColor;
}

export interface Annotation {
  id: string;
  content: string;
  position: number;
  startIndex: number;
  endIndex: number;
}

export interface Quote {
  id: string;
  content: string;
  bookTitle: string;
  author: string;
  pageNumber: string;
  tags: string[];
  template: BookTemplate;
  highlights: Highlight[];
  annotations: Annotation[];
  bookmarked: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type ActiveTool = 'none' | 'highlight' | 'annotation' | 'bookmark' | 'edit';

export interface QuoteStore {
  quotes: Quote[];
  tags: Tag[];
  currentQuoteIndex: number;
  currentTemplate: BookTemplate;
  activeTool: ActiveTool;
  sidebarOpen: boolean;
  filterTagId: string | null;
  highlightColor: HighlightColor;
  editorOpen: boolean;
  editingQuoteId: string | null;
  isFlipping: boolean;
  flipDirection: 'next' | 'prev' | null;
  pageSettings: PageSettings;
  pageSettingsOpen: boolean;
  annotationsVisible: boolean;
  importModalOpen: boolean;

  setCurrentTemplate: (template: BookTemplate) => void;
  toggleImportModal: () => void;
  setPageSettings: (settings: Partial<PageSettings>) => void;
  togglePageSettings: () => void;
  setActiveTool: (tool: ActiveTool) => void;
  setHighlightColor: (color: HighlightColor) => void;
  toggleAnnotations: () => void;
  toggleSidebar: () => void;
  setFilterTagId: (tagId: string | null) => void;
  openEditor: (quoteId?: string) => void;
  closeEditor: () => void;

  addQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  importQuotes: (quotes: Omit<Quote, 'id' | 'createdAt' | 'updatedAt' | 'order'>[]) => number;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;

  addHighlight: (quoteId: string, highlight: Omit<Highlight, 'id'>) => void;
  removeHighlight: (quoteId: string, highlightId: string) => void;

  addAnnotation: (quoteId: string, annotation: Omit<Annotation, 'id'>) => void;
  removeAnnotation: (quoteId: string, annotationId: string) => void;
  updateAnnotation: (quoteId: string, annotationId: string, content: string) => void;

  toggleBookmark: (quoteId: string) => void;

  addTag: (tag: Omit<Tag, 'id'>) => void;
  removeTag: (tagId: string) => void;

  nextPage: () => void;
  prevPage: () => void;
  goToPage: (index: number) => void;

  getFilteredQuotes: () => Quote[];
  getCurrentQuote: () => Quote | null;
  getNextQuote: () => Quote | null;
  getTagById: (id: string) => Tag | undefined;
}
