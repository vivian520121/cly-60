import { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { useQuoteStore } from '../store/useQuoteStore';
import type { Quote } from '../types';

export function useExportImage() {
  const [isExporting, setIsExporting] = useState(false);
  const exportContainerRef = useRef<HTMLDivElement>(null);

  const { quotes, getTagById } = useQuoteStore();

  const createExportContainer = useCallback((quoteList: Quote[]) => {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 600px;
      background: #f5e6c8;
      padding: 0;
    `;

    const highlightColorMap: Record<string, string> = {
      yellow: 'linear-gradient(120deg, rgba(253, 224, 71, 0.6) 0%, rgba(253, 224, 71, 0.4) 100%)',
      green: 'linear-gradient(120deg, rgba(134, 239, 172, 0.6) 0%, rgba(134, 239, 172, 0.4) 100%)',
      pink: 'linear-gradient(120deg, rgba(249, 168, 212, 0.6) 0%, rgba(249, 168, 212, 0.4) 100%)',
      blue: 'linear-gradient(120deg, rgba(147, 197, 253, 0.6) 0%, rgba(147, 197, 253, 0.4) 100%)',
    };

    quoteList.forEach((quote, index) => {
      const page = document.createElement('div');
      
      const bgColor =
        quote.template === 'ancient'
          ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)'
          : quote.template === 'notebook'
          ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
          : quote.template === 'newspaper'
          ? 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 50%, #d6d3d1 100%)'
          : 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #e5e5e5 100%)';

      const textColor =
        quote.template === 'ancient'
          ? '#78350f'
          : quote.template === 'notebook'
          ? '#1e293b'
          : quote.template === 'newspaper'
          ? '#171717'
          : '#0f172a';

      page.style.cssText = `
        width: 100%;
        min-height: 800px;
        padding: 60px;
        background: ${bgColor};
        position: relative;
        break-inside: avoid;
        font-family: 'Noto Serif SC', 'Songti SC', serif;
        color: ${textColor};
        box-sizing: border-box;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        overflow: hidden;
      `;

      if (quote.bookmarked) {
        const bookmark = document.createElement('div');
        bookmark.style.cssText = `
          position: absolute;
          top: 0;
          right: 40px;
          width: 32px;
          height: 56px;
          background: linear-gradient(180deg, #dc2626 0%, #991b1b 100%);
          z-index: 10;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
          box-shadow: 2px 2px 6px rgba(0,0,0,0.2);
        `;
        page.appendChild(bookmark);
      }

      const title = document.createElement('h2');
      title.style.cssText = `
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 8px;
        color: ${textColor};
        margin: 0 0 8px 0;
      `;
      title.textContent = quote.bookTitle;
      page.appendChild(title);

      const meta = document.createElement('p');
      meta.style.cssText = `
        font-size: 14px;
        color: ${textColor};
        opacity: 0.7;
        margin-bottom: 32px;
        margin-top: 0;
      `;
      meta.textContent = `${quote.author} · 第 ${quote.pageNumber} 页`;
      page.appendChild(meta);

      const content = document.createElement('div');
      content.style.cssText = `
        font-size: 16px;
        line-height: 2;
        color: ${textColor};
        text-indent: 2em;
        position: relative;
      `;

      const text = quote.content;
      if (quote.highlights.length > 0) {
        const sortedHighlights = [...quote.highlights].sort((a, b) => a.startIndex - b.startIndex);
        let lastIndex = 0;

        sortedHighlights.forEach((highlight) => {
          if (highlight.startIndex > lastIndex) {
            const normalText = document.createElement('span');
            normalText.textContent = text.slice(lastIndex, highlight.startIndex);
            content.appendChild(normalText);
          }

          if (highlight.startIndex < text.length && highlight.endIndex > lastIndex) {
            const start = Math.max(highlight.startIndex, lastIndex);
            const end = Math.min(highlight.endIndex, text.length);
            const highlightSpan = document.createElement('span');
            highlightSpan.textContent = text.slice(start, end);
            const bgGradient = highlightColorMap[highlight.color] || highlightColorMap.yellow;
            highlightSpan.style.cssText = `
              background: ${bgGradient};
              padding: 2px 2px;
              border-radius: 2px;
              box-decoration-break: clone;
              -webkit-box-decoration-break: clone;
            `;
            content.appendChild(highlightSpan);
            lastIndex = end;
          }
        });

        if (lastIndex < text.length) {
          const tailText = document.createElement('span');
          tailText.textContent = text.slice(lastIndex);
          content.appendChild(tailText);
        }
      } else {
        content.textContent = text;
      }
      page.appendChild(content);

      quote.annotations.forEach((annotation, aIndex) => {
        const bubble = document.createElement('div');
        bubble.style.cssText = `
          position: absolute;
          top: ${Math.min(35 + aIndex * 22, 70)}%;
          right: 10px;
          max-width: 140px;
          padding: 8px 12px;
          background: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.5;
          color: #78350f;
          box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
          font-family: 'Ma Shan Zheng', 'KaiTi', cursive;
          z-index: 5;
        `;

        const tail = document.createElement('div');
        tail.style.cssText = `
          position: absolute;
          right: -8px;
          top: 12px;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 8px solid #fcd34d;
        `;
        bubble.appendChild(tail);

        const tailInner = document.createElement('div');
        tailInner.style.cssText = `
          position: absolute;
          right: -6px;
          top: 13px;
          width: 0;
          height: 0;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 7px solid #fffbeb;
        `;
        bubble.appendChild(tailInner);

        const bubbleText = document.createElement('div');
        bubbleText.textContent = annotation.content;
        bubble.appendChild(bubbleText);

        page.appendChild(bubble);
      });

      if (quote.tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.style.cssText = `
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 40px;
        `;

        quote.tags.forEach((tagId) => {
          const tag = getTagById(tagId);
          if (tag) {
            const tagEl = document.createElement('span');
            tagEl.style.cssText = `
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 12px;
              color: white;
              background: ${tag.color};
            `;
            tagEl.textContent = tag.name;
            tagsContainer.appendChild(tagEl);
          }
        });

        page.appendChild(tagsContainer);
      }

      const pageNum = document.createElement('div');
      pageNum.style.cssText = `
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        color: ${textColor};
        opacity: 0.5;
      `;
      pageNum.textContent = `— ${index + 1} / ${quoteList.length} —`;
      page.appendChild(pageNum);

      container.appendChild(page);
    });

    document.body.appendChild(container);
    return container;
  }, [getTagById]);

  const exportAllQuotes = useCallback(async () => {
    if (quotes.length === 0) return;

    setIsExporting(true);

    try {
      const container = createExportContainer(quotes);

      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        windowWidth: container.scrollWidth,
        windowHeight: container.scrollHeight,
      });

      document.body.removeChild(container);

      const link = document.createElement('a');
      link.download = `我的摘抄本_${new Date().toLocaleDateString('zh-CN')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  }, [quotes, createExportContainer]);

  return {
    isExporting,
    exportAllQuotes,
    exportContainerRef,
  };
}
