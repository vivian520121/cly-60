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
      `;

      const title = document.createElement('h2');
      title.style.cssText = `
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 8px;
        color: ${textColor};
      `;
      title.textContent = quote.bookTitle;
      page.appendChild(title);

      const meta = document.createElement('p');
      meta.style.cssText = `
        font-size: 14px;
        color: ${textColor};
        opacity: 0.7;
        margin-bottom: 32px;
      `;
      meta.textContent = `${quote.author} · 第 ${quote.pageNumber} 页`;
      page.appendChild(meta);

      const content = document.createElement('div');
      content.style.cssText = `
        font-size: 16px;
        line-height: 2;
        color: ${textColor};
        text-indent: 2em;
      `;
      content.textContent = quote.content;
      page.appendChild(content);

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

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
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
