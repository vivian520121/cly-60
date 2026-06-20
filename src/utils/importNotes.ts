import type { Quote, BookTemplate } from '../types';

export interface ParsedQuote {
  content: string;
  bookTitle: string;
  author: string;
  pageNumber: string;
  template: BookTemplate;
}

const BOOK_TITLE_PATTERNS = [
  /《([^》]+)》/,
  /「([^」]+)」/,
  /\[([^\]]+)\]/,
  /书名[:：]\s*([^\n]+)/,
  /title[:：]\s*([^\n]+)/i,
  /#\s*([^\n]+)/,
];

const AUTHOR_PATTERNS = [
  /作者[:：]\s*([^\n]+)/,
  /author[:：]\s*([^\n]+)/i,
  /——\s*([^\n，。；！？]+)/,
  /—\s*([^\n，。；！？]+)/,
  /by\s+([^\n]+)/i,
];

const PAGE_PATTERNS = [
  /第\s*(\d+)\s*页/,
  /page\s*(\d+)/i,
  /p\.?\s*(\d+)/i,
  /页码[:：]\s*(\d+)/,
];

const CHAPTER_PATTERNS = [
  /^##\s+(.+)$/m,
  /^###\s+(.+)$/m,
  /^\d+\.\s+(.+)$/m,
  /^第[一二三四五六七八九十百千\d]+章\s*(.+)$/m,
];

function extractByPattern(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

function extractTitle(text: string): string | null {
  return extractByPattern(text, BOOK_TITLE_PATTERNS);
}

function extractAuthor(text: string): string | null {
  return extractByPattern(text, AUTHOR_PATTERNS);
}

function extractPageNumber(text: string): string | null {
  return extractByPattern(text, PAGE_PATTERNS);
}

function removeMetadata(text: string): string {
  let cleaned = text;
  cleaned = cleaned.replace(/书名[:：][^\n]*\n?/g, '');
  cleaned = cleaned.replace(/作者[:：][^\n]*\n?/g, '');
  cleaned = cleaned.replace(/页码[:：][^\n]*\n?/g, '');
  cleaned = cleaned.replace(/title[:：][^\n]*\n?/gi, '');
  cleaned = cleaned.replace(/author[:：][^\n]*\n?/gi, '');
  cleaned = cleaned.replace(/page[:：][^\n]*\n?/gi, '');
  cleaned = cleaned.replace(/^#\s+[^\n]+\n?/gm, '');
  cleaned = cleaned.replace(/^##\s+[^\n]+\n?/gm, '');
  cleaned = cleaned.replace(/^###\s+[^\n]+\n?/gm, '');
  cleaned = cleaned.replace(/《[^》]*》/g, '');
  cleaned = cleaned.replace(/「[^」]*」/g, '');
  cleaned = cleaned.replace(/——[^\n，。；！？]*$/gm, '');
  cleaned = cleaned.replace(/—[^\n，。；！？]*$/gm, '');
  cleaned = cleaned.replace(/by\s+[^\n]+$/gim, '');
  cleaned = cleaned.replace(/第\s*\d+\s*页/g, '');
  cleaned = cleaned.replace(/p\.?\s*\d+/gi, '');
  cleaned = cleaned.replace(/^\d+\.\s+/gm, '');
  cleaned = cleaned.replace(/^第[一二三四五六七八九十百千\d]+章[^\n]*\n?/gm, '');
  return cleaned.trim();
}

function splitIntoSegments(content: string): string[] {
  const segments: string[] = [];
  
  const markdownQuotePattern = /^>\s*(.+)$/gm;
  const quotes: string[] = [];
  let match;
  
  while ((match = markdownQuotePattern.exec(content)) !== null) {
    quotes.push(match[1].trim());
  }
  
  if (quotes.length > 0) {
    return quotes.filter(q => q.length >= 5);
  }
  
  const paragraphPattern = /\n\s*\n/;
  const paragraphs = content.split(paragraphPattern);
  
  function matchesChapterPattern(text: string): boolean {
    return CHAPTER_PATTERNS.some(pattern => pattern.test(text));
  }

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (trimmed.length >= 5 && !matchesChapterPattern(trimmed)) {
      const sentences = trimmed.split(/(?<=[。！？!?])\s+/);
      let currentSegment = '';
      
      for (const sentence of sentences) {
        if (currentSegment.length + sentence.length <= 300) {
          currentSegment += (currentSegment ? ' ' : '') + sentence;
        } else {
          if (currentSegment.trim()) {
            segments.push(currentSegment.trim());
          }
          currentSegment = sentence;
        }
      }
      
      if (currentSegment.trim()) {
        segments.push(currentSegment.trim());
      }
    }
  }
  
  return segments.filter(s => s.length >= 5);
}

export function parseNotes(content: string, defaultTemplate: BookTemplate = 'ancient'): ParsedQuote[] {
  const normalizedContent = content.replace(/\r\n/g, '\n').trim();
  
  const globalBookTitle = extractTitle(normalizedContent);
  const globalAuthor = extractAuthor(normalizedContent);
  
  const quoteBlocks = normalizedContent.split(/^---\s*$/m);
  
  const parsedQuotes: ParsedQuote[] = [];
  
  for (const block of quoteBlocks) {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) continue;
    
    const segments = splitIntoSegments(trimmedBlock);
    
    for (const segment of segments) {
      const cleanedSegment = removeMetadata(segment);
      if (!cleanedSegment || cleanedSegment.length < 5) continue;
      
      const bookTitle = extractTitle(segment) || globalBookTitle || '';
      const author = extractAuthor(segment) || globalAuthor || '';
      const pageNumber = extractPageNumber(segment) || '1';
      
      parsedQuotes.push({
        content: cleanedSegment,
        bookTitle: bookTitle || '无题',
        author: author || '佚名',
        pageNumber,
        template: defaultTemplate,
      });
    }
  }
  
  return parsedQuotes;
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    reader.readAsText(file);
  });
}

export function convertToQuoteData(parsed: ParsedQuote, bookId: string): Omit<Quote, 'id' | 'createdAt' | 'updatedAt' | 'order'> {
  return {
    bookId,
    content: parsed.content,
    bookTitle: parsed.bookTitle,
    author: parsed.author,
    pageNumber: parsed.pageNumber,
    tags: [],
    template: parsed.template,
    highlights: [],
    annotations: [],
    bookmarked: false,
  };
}
