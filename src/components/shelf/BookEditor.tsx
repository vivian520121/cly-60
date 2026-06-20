import { useState, useEffect, useRef } from 'react';
import { X, Upload, Palette, BookOpen, Check, Image } from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';
import type { BookTemplate, CoverImage } from '../../types';
import {
  builtinCovers,
  templateNames,
  templatePreviews,
  getCoverStyle,
  getCoverPattern,
  getCoverTextColor,
  getCoverBorderColor,
} from '../../utils/bookCovers';

export function BookEditor() {
  const bookEditorOpen = useQuoteStore((state) => state.bookEditorOpen);
  const editingBookId = useQuoteStore((state) => state.editingBookId);
  const getBookById = useQuoteStore((state) => state.getBookById);
  const addBook = useQuoteStore((state) => state.addBook);
  const updateBook = useQuoteStore((state) => state.updateBook);
  const closeBookEditor = useQuoteStore((state) => state.closeBookEditor);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState<BookTemplate>('ancient');
  const [cover, setCover] = useState<CoverImage>({
    source: 'builtin',
    value: 'cover-ancient-1',
  });
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!editingBookId;

  useEffect(() => {
    if (bookEditorOpen && editingBookId) {
      const book = getBookById(editingBookId);
      if (book) {
        setName(book.name);
        setDescription(book.description);
        setTemplate(book.template);
        setCover(book.cover);
      }
    } else if (bookEditorOpen) {
      setName('');
      setDescription('');
      setTemplate('ancient');
      setCover({ source: 'builtin', value: 'cover-ancient-1' });
    }
  }, [bookEditorOpen, editingBookId, getBookById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && editingBookId) {
      updateBook(editingBookId, {
        name: name.trim(),
        description: description.trim(),
        template,
        cover,
      });
    } else {
      addBook({
        name: name.trim(),
        description: description.trim(),
        template,
        cover,
      });
    }

    closeBookEditor();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCover({
          source: 'upload',
          value: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBuiltinCoverSelect = (coverId: string) => {
    setCover({
      source: 'builtin',
      value: coverId,
    });
    setShowCoverPicker(false);
  };

  const previewCoverStyle = getCoverStyle(cover);
  const previewPattern = getCoverPattern(cover);
  const previewTextColor = getCoverTextColor(cover);
  const previewBorderColor = getCoverBorderColor(cover);

  if (!bookEditorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeBookEditor}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl animate-fade-in-up">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-ink-800 font-serif flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            {isEditing ? '编辑书本' : '创建新书本'}
          </h2>
          <button
            onClick={closeBookEditor}
            className="p-2 rounded-lg hover:bg-amber-100/50 transition-colors"
          >
            <X className="w-5 h-5 text-ink-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  书本名称 *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入书本名称..."
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 bg-white/80 text-ink-800 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-serif"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  书本描述
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="简单描述这本摘抄集..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 bg-white/80 text-ink-800 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all resize-none font-kai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-600" />
                  书页模板
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(templateNames) as BookTemplate[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTemplate(t)}
                      className={`relative p-3 rounded-lg border-2 transition-all ${
                        template === t
                          ? 'border-amber-500 bg-amber-50 shadow-md'
                          : 'border-amber-200 bg-white/60 hover:border-amber-300'
                      }`}
                    >
                      <div
                        className="h-16 rounded-md mb-2 shadow-inner"
                        style={{ background: templatePreviews[t] }}
                      />
                      <p className="text-xs font-medium text-ink-700">
                        {templateNames[t]}
                      </p>
                      {template === t && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-ink-700 mb-3 flex items-center gap-2">
                <Image className="w-4 h-4 text-amber-600" />
                封面设置
              </label>

              <div
                className="relative mx-auto rounded-r-md overflow-hidden shadow-xl cursor-pointer group"
                style={{
                  width: '180px',
                  aspectRatio: '3 / 4',
                  ...previewCoverStyle,
                  borderLeft: `6px solid ${previewBorderColor}`,
                }}
                onClick={() => setShowCoverPicker(!showCoverPicker)}
              >
                {previewPattern && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: previewPattern }}
                  />
                )}

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                  }}
                />

                <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                  <div
                    className="w-10 h-10 mb-3 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${previewBorderColor} 0%, ${previewTextColor} 100%)`,
                    }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: '#1a1a2e' }} />
                  </div>
                  <h3
                    className="font-serif text-base font-bold leading-tight mb-1"
                    style={{ color: previewTextColor }}
                  >
                    {name || '书本名称'}
                  </h3>
                  <p
                    className="text-xs opacity-80 font-kai"
                    style={{ color: previewTextColor }}
                  >
                    {description || '点击选择封面'}
                  </p>
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-sm font-medium">更换封面</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setShowCoverPicker(!showCoverPicker)}
                  className="px-4 py-2 text-sm rounded-lg border border-amber-200 bg-white/80 text-ink-700 hover:bg-amber-50 transition-all flex items-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  选择内置封面
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm rounded-lg border border-amber-200 bg-white/80 text-ink-700 hover:bg-amber-50 transition-all flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  上传封面
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {showCoverPicker && (
                <div className="absolute z-20 w-80 right-6 top-32 bg-white rounded-xl shadow-2xl p-4 border border-amber-200 animate-fade-in">
                  <h4 className="text-sm font-medium text-ink-700 mb-3">选择古籍封面</h4>
                  <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto scrollbar-thin">
                    {builtinCovers.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleBuiltinCoverSelect(c.id)}
                        className={`relative aspect-[3/4] rounded-md overflow-hidden border-2 transition-all ${
                          cover.source === 'builtin' && cover.value === c.id
                            ? 'border-amber-500 ring-2 ring-amber-300'
                            : 'border-transparent hover:border-amber-300'
                        }`}
                        style={{ background: c.gradient }}
                        title={c.name}
                      >
                        {c.pattern && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: c.pattern }}
                          />
                        )}
                        {cover.source === 'builtin' && cover.value === c.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-ink-500 mt-2 text-center">
                    共 {builtinCovers.length} 款内置古籍封面
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-200/50">
            <button
              type="button"
              onClick={closeBookEditor}
              className="px-6 py-2.5 rounded-lg border border-amber-200 text-ink-700 hover:bg-amber-50 transition-all font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-md hover:shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {isEditing ? '保存修改' : '创建书本'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
