import { useState, useRef, useCallback } from 'react';
import { X, Upload, FileText, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';
import { parseNotes, readFileAsText, convertToQuoteData } from '../../utils/importNotes';
import type { ParsedQuote } from '../../utils/importNotes';
import type { BookTemplate } from '../types';
import { templateStyles } from '../../utils/templateStyles';

const templates: BookTemplate[] = ['ancient', 'notebook', 'newspaper', 'letter'];

interface EditableQuote extends ParsedQuote {
  selected: boolean;
  expanded: boolean;
}

export function ImportNotesModal() {
  const { importModalOpen, toggleImportModal, importQuotes, currentTemplate } = useQuoteStore();
  const [file, setFile] = useState<File | null>(null);
  const [parsedQuotes, setParsedQuotes] = useState<EditableQuote[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<BookTemplate>(currentTemplate);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    const validTypes = ['.txt', '.md', '.markdown', 'text/plain', 'text/markdown'];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = validTypes.some(type => 
      fileName.endsWith(type) || selectedFile.type === type
    );

    if (!isValid) {
      setError('请选择 TXT 或 Markdown 格式的文件');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('文件大小不能超过 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsParsing(true);
    setImportSuccess(false);

    try {
      const content = await readFileAsText(selectedFile);
      const parsed = parseNotes(content, selectedTemplate);
      const editable: EditableQuote[] = parsed.map(q => ({
        ...q,
        template: selectedTemplate,
        selected: true,
        expanded: false,
      }));
      setParsedQuotes(editable);
    } catch {
      setError('文件解析失败，请检查文件格式');
    } finally {
      setIsParsing(false);
    }
  }, [selectedTemplate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const toggleSelectAll = () => {
    const allSelected = parsedQuotes.every(q => q.selected);
    setParsedQuotes(prev => prev.map(q => ({ ...q, selected: !allSelected })));
  };

  const toggleQuoteSelect = (index: number) => {
    setParsedQuotes(prev => prev.map((q, i) => 
      i === index ? { ...q, selected: !q.selected } : q
    ));
  };

  const toggleExpand = (index: number) => {
    setParsedQuotes(prev => prev.map((q, i) => 
      i === index ? { ...q, expanded: !q.expanded } : q
    ));
  };

  const updateQuoteField = (index: number, field: keyof EditableQuote, value: string) => {
    setParsedQuotes(prev => prev.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    ));
  };

  const removeQuote = (index: number) => {
    setParsedQuotes(prev => prev.filter((_, i) => i !== index));
  };

  const handleTemplateChange = (template: BookTemplate) => {
    setSelectedTemplate(template);
    setParsedQuotes(prev => prev.map(q => ({ ...q, template })));
  };

  const handleImport = () => {
    const selected = parsedQuotes.filter(q => q.selected);
    if (selected.length === 0) {
      setError('请至少选择一条摘抄');
      return;
    }

    const quoteData = selected.map(q => convertToQuoteData(q));
    const count = importQuotes(quoteData);
    setImportedCount(count);
    setImportSuccess(true);

    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setFile(null);
    setParsedQuotes([]);
    setError(null);
    setImportSuccess(false);
    setImportedCount(0);
    setSelectedTemplate(currentTemplate);
    toggleImportModal();
  };

  const handleReset = () => {
    setFile(null);
    setParsedQuotes([]);
    setError(null);
    setImportSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!importModalOpen) return null;

  const selectedCount = parsedQuotes.filter(q => q.selected).length;
  const allSelected = parsedQuotes.length > 0 && parsedQuotes.every(q => q.selected);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in-up flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-amber-200/50">
          <h2 className="text-xl font-serif text-amber-900">
            导入读书笔记
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 hover:bg-amber-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {importSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <Check size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-serif text-amber-900 mb-2">导入成功！</h3>
            <p className="text-amber-600">已成功导入 {importedCount} 条摘抄</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {!file ? (
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
                    isDragging
                      ? 'border-amber-400 bg-amber-100/50'
                      : 'border-amber-300 hover:border-amber-400 hover:bg-amber-50/50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.markdown,text/plain,text/markdown"
                    className="hidden"
                    onChange={handleInputChange}
                  />
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                    <Upload size={32} className="text-amber-600" />
                  </div>
                  <h3 className="text-lg font-serif text-amber-900 mb-2">
                    拖拽文件到此处，或点击选择
                  </h3>
                  <p className="text-amber-600 text-sm mb-4">
                    支持 TXT、Markdown 格式，最大 10MB
                  </p>
                  <div className="flex items-center justify-center gap-2 text-amber-500 text-xs">
                    <FileText size={14} />
                    <span>.txt</span>
                    <span className="mx-1">·</span>
                    <span>.md</span>
                    <span className="mx-1">·</span>
                    <span>.markdown</span>
                  </div>
                </div>
              ) : !isParsing && parsedQuotes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                    <FileText size={32} className="text-amber-600" />
                  </div>
                  <h3 className="text-lg font-serif text-amber-900 mb-2">
                    未解析到有效内容
                  </h3>
                  <p className="text-amber-600 text-sm mb-6">
                    请检查文件内容是否包含可识别的文本段落
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl text-amber-700 bg-white/70 hover:bg-white transition-colors font-medium"
                  >
                    重新选择文件
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-amber-600" />
                        <span className="text-amber-900 font-medium">{file.name}</span>
                        <span className="text-amber-500 text-sm">({parsedQuotes.length} 条)</span>
                      </div>
                      <button
                        onClick={handleReset}
                        className="text-amber-500 hover:text-amber-700 text-sm"
                      >
                        重新选择
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-amber-700">
                        已选择 {selectedCount}/{parsedQuotes.length} 条
                      </div>
                      <button
                        onClick={toggleSelectAll}
                        className="text-sm text-amber-600 hover:text-amber-800"
                      >
                        {allSelected ? '取消全选' : '全选'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      页面样式
                    </label>
                    <div className="flex gap-3">
                      {templates.map((template) => {
                        const isSelected = selectedTemplate === template;
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
                            onClick={() => handleTemplateChange(template)}
                            className={`flex-1 p-2 rounded-xl transition-all duration-200 ${bgColor} ${
                              isSelected
                                ? 'ring-2 ring-amber-400 shadow-lg scale-105'
                                : 'opacity-70 hover:opacity-100'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-xl mb-1">
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

                  <div className="space-y-3">
                    {isParsing ? (
                      <div className="text-center py-12">
                        <div className="animate-spin w-10 h-10 mx-auto mb-4 rounded-full border-4 border-amber-300 border-t-amber-600" />
                        <p className="text-amber-700">正在解析文件...</p>
                      </div>
                    ) : (
                      parsedQuotes.map((quote, index) => (
                        <div
                          key={index}
                          className={`bg-white/70 rounded-xl border transition-all duration-200 ${
                            quote.selected
                              ? 'border-amber-400 shadow-md'
                              : 'border-amber-200 opacity-70'
                          }`}
                        >
                          <div className="flex items-start gap-3 p-4">
                            <button
                              onClick={() => toggleQuoteSelect(index)}
                              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                quote.selected
                                  ? 'bg-amber-500 border-amber-500 text-white'
                                  : 'border-amber-300 hover:border-amber-400'
                              }`}
                            >
                              {quote.selected && <Check size={12} />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-sm text-amber-700">
                                  <span className="font-medium">#{index + 1}</span>
                                  <span className="text-amber-500">·</span>
                                  <span>{quote.content.length} 字</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => toggleExpand(index)}
                                    className="p-1 rounded hover:bg-amber-100 text-amber-500"
                                  >
                                    {quote.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                  </button>
                                  <button
                                    onClick={() => removeQuote(index)}
                                    className="p-1 rounded hover:bg-red-100 text-red-400 hover:text-red-500"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                              <p className="text-amber-900 font-serif text-sm line-clamp-3">
                                {quote.content}
                              </p>

                              {quote.expanded && (
                                <div className="mt-4 space-y-4 pt-4 border-t border-amber-200/50">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-medium text-amber-700 mb-1">
                                        书名
                                      </label>
                                      <input
                                        type="text"
                                        value={quote.bookTitle}
                                        onChange={(e) => updateQuoteField(index, 'bookTitle', e.target.value)}
                                        className="w-full p-2 bg-white/70 border border-amber-200 rounded-lg text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent font-serif"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-amber-700 mb-1">
                                        作者
                                      </label>
                                      <input
                                        type="text"
                                        value={quote.author}
                                        onChange={(e) => updateQuoteField(index, 'author', e.target.value)}
                                        className="w-full p-2 bg-white/70 border border-amber-200 rounded-lg text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent font-serif"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-medium text-amber-700 mb-1">
                                        页码
                                      </label>
                                      <input
                                        type="text"
                                        value={quote.pageNumber}
                                        onChange={(e) => updateQuoteField(index, 'pageNumber', e.target.value)}
                                        className="w-full p-2 bg-white/70 border border-amber-200 rounded-lg text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent font-serif"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-amber-700 mb-1">
                                        样式
                                      </label>
                                      <select
                                        value={quote.template}
                                        onChange={(e) => updateQuoteField(index, 'template', e.target.value as BookTemplate)}
                                        className="w-full p-2 bg-white/70 border border-amber-200 rounded-lg text-sm text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent font-serif"
                                      >
                                        {templates.map((t) => (
                                          <option key={t} value={t}>
                                            {templateStyles[t].name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-amber-700 mb-1">
                                      内容
                                    </label>
                                    <textarea
                                      value={quote.content}
                                      onChange={(e) => updateQuoteField(index, 'content', e.target.value)}
                                      className="w-full h-32 p-2 bg-white/70 border border-amber-200 rounded-lg text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent font-serif resize-none"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-6 border-t border-amber-200/50">
              <div className="text-amber-600 text-sm">
                {parsedQuotes.length > 0 && (
                  <>将导入 <span className="font-semibold text-amber-800">{selectedCount}</span> 条摘抄</>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl text-amber-700 bg-white/70 hover:bg-white transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleImport}
                  disabled={parsedQuotes.length === 0 || selectedCount === 0 || isParsing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  导入摘抄
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
