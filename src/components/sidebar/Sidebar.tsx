import { X, Download, Plus, Upload } from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';
import { TagFilter } from './TagFilter';
import { QuoteList } from './QuoteList';
import { useExportImage } from '../../hooks/useExportImage';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, quotes, tags, addTag, getFilteredQuotes, toggleImportModal } = useQuoteStore();
  const { exportAllQuotes, isExporting } = useExportImage();
  const filteredQuotes = getFilteredQuotes();

  const handleAddTag = () => {
    const name = prompt('输入新标签名称：');
    if (name?.trim()) {
      const colors = ['#7cb342', '#5c6bc0', '#ec407a', '#ff7043', '#26a69a', '#ffa726', '#ab47bc'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      addTag({ name: name.trim(), color: randomColor });
    }
  };

  return (
    <>
      {/* 遮罩 */}
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* 侧边栏 */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-amber-50 to-orange-50 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="p-6 border-b border-amber-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif text-amber-900">我的摘抄本</h2>
              <button
                onClick={toggleSidebar}
                className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 hover:bg-amber-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-amber-600 mt-1">
              共 {quotes.length} 条摘抄 · {tags.length} 个标签
            </p>
          </div>

          {/* 标签区 */}
          <div className="p-4 border-b border-amber-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-amber-800">标签</h3>
              <button
                onClick={handleAddTag}
                className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 hover:bg-amber-200 transition-colors"
                title="添加标签"
              >
                <Plus size={14} />
              </button>
            </div>
            <TagFilter />
          </div>

          {/* 摘抄列表 */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 pb-2">
              <h3 className="text-sm font-medium text-amber-800">
                摘抄列表 ({filteredQuotes.length})
              </h3>
            </div>
            <QuoteList />
          </div>

          {/* 底部操作 */}
          <div className="p-4 border-t border-amber-200/50 space-y-2">
            <button
              onClick={toggleImportModal}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 text-amber-700 font-medium hover:bg-white transition-all border border-amber-200"
            >
              <Upload size={18} />
              导入读书笔记
            </button>
            <button
              onClick={exportAllQuotes}
              disabled={isExporting || quotes.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              {isExporting ? '导出中...' : '导出高清长图'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
