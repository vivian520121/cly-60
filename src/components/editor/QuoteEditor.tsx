import { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';
import type { BookTemplate } from '../../types';
import { templateStyles } from '../../utils/templateStyles';

const templates: BookTemplate[] = ['ancient', 'notebook', 'newspaper', 'letter'];

export function QuoteEditor() {
  const {
    editorOpen,
    editingQuoteId,
    quotes,
    tags,
    currentTemplate,
    currentBookId,
    closeEditor,
    addQuote,
    updateQuote,
    getBookQuotes,
  } = useQuoteStore();

  const editingQuote = quotes.find((q) => q.id === editingQuoteId);

  const [formData, setFormData] = useState({
    content: '',
    bookTitle: '',
    author: '',
    pageNumber: '',
    tags: [] as string[],
    template: currentTemplate as BookTemplate,
  });

  const [pageError, setPageError] = useState('');

  useEffect(() => {
    if (editorOpen) {
      if (editingQuote) {
        setFormData({
          content: editingQuote.content,
          bookTitle: editingQuote.bookTitle,
          author: editingQuote.author,
          pageNumber: editingQuote.pageNumber,
          tags: [...editingQuote.tags],
          template: editingQuote.template,
        });
      } else {
        setFormData({
          content: '',
          bookTitle: '',
          author: '',
          pageNumber: '',
          tags: [],
          template: currentTemplate,
        });
      }
      setPageError('');
    }
  }, [editorOpen, editingQuoteId, editingQuote, currentTemplate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) return;

    const pageToCheck = formData.pageNumber.trim();
    if (pageToCheck && currentBookId) {
      const bookQuotes = getBookQuotes(currentBookId);
      const duplicate = bookQuotes.find(
        (q) => q.pageNumber === pageToCheck && q.id !== editingQuoteId
      );
      if (duplicate) {
        setPageError(`页码 ${pageToCheck} 已存在，请更换页码`);
        return;
      }
    }
    setPageError('');

    if (editingQuoteId) {
      updateQuote(editingQuoteId, {
        content: formData.content,
        bookTitle: formData.bookTitle,
        author: formData.author,
        pageNumber: formData.pageNumber,
        tags: formData.tags,
        template: formData.template,
      });
    } else {
      addQuote({
        bookId: currentBookId || 'default',
        content: formData.content,
        bookTitle: formData.bookTitle || '无题',
        author: formData.author || '佚名',
        pageNumber: formData.pageNumber || '1',
        tags: formData.tags,
        template: formData.template,
        highlights: [],
        annotations: [],
        bookmarked: false,
      });
    }

    closeEditor();
  };

  const toggleTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((t) => t !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  if (!editorOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-amber-200/50">
          <h2 className="text-xl font-serif text-amber-900">
            {editingQuoteId ? '编辑摘抄' : '新建摘抄'}
          </h2>
          <button
            onClick={closeEditor}
            className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 hover:bg-amber-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-thin">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                金句内容
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                className="w-full h-40 p-4 bg-white/70 border border-amber-200 rounded-xl text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent font-serif resize-none"
                placeholder="在这里写下你喜欢的句子..."
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  书名
                </label>
                <input
                  type="text"
                  value={formData.bookTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bookTitle: e.target.value }))
                  }
                  className="w-full p-3 bg-white/70 border border-amber-200 rounded-xl text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent font-serif"
                  placeholder="书名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  作者
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                  className="w-full p-3 bg-white/70 border border-amber-200 rounded-xl text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent font-serif"
                  placeholder="作者"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                页码
              </label>
              <input
                type="text"
                value={formData.pageNumber}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, pageNumber: e.target.value }));
                  if (pageError) setPageError('');
                }}
                className={`w-32 p-3 bg-white/70 border rounded-xl text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent font-serif ${
                  pageError ? 'border-red-400 focus:ring-red-300' : 'border-amber-200'
                }`}
                placeholder="1"
              />
              {pageError && (
                <p className="mt-1.5 text-sm text-red-500">{pageError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
                <Tag size={14} />
                标签
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = formData.tags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                        isSelected
                          ? 'text-white shadow-md scale-105'
                          : 'bg-white/70 text-amber-700 border border-amber-200 hover:bg-white'
                      }`}
                      style={isSelected ? { backgroundColor: tag.color } : {}}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                书页样式
              </label>
              <div className="flex gap-3">
                {templates.map((template) => {
                  const isSelected = formData.template === template;
                  const style = templateStyles[template];

                  const bgColor =
                    template === 'ancient'
                      ? 'bg-amber-100'
                      : template === 'notebook'
                      ? 'bg-slate-100'
                      : template === 'newspaper'
                      ? 'bg-stone-200'
                      : 'bg-gray-100';

                  return (
                    <button
                      key={template}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, template }))
                      }
                      className={`flex-1 p-3 rounded-xl transition-all duration-200 ${bgColor} ${
                        isSelected
                          ? 'ring-2 ring-amber-400 shadow-lg scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">
                          {template === 'ancient' && '📜'}
                          {template === 'notebook' && '📓'}
                          {template === 'newspaper' && '📰'}
                          {template === 'letter' && '✉️'}
                        </div>
                        <div className="text-xs font-medium text-gray-700">
                          {style.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={closeEditor}
              className="px-5 py-2.5 rounded-xl text-amber-700 bg-white/70 hover:bg-white transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
            >
              {editingQuoteId ? '保存修改' : '创建摘抄'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
