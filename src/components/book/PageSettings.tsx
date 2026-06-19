import { Settings, X } from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';

export function PageSettings() {
  const { pageSettings, pageSettingsOpen, togglePageSettings, setPageSettings } = useQuoteStore();

  if (!pageSettingsOpen) {
    return (
      <button
        onClick={togglePageSettings}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-stone-100/80 backdrop-blur-sm text-stone-600 hover:bg-stone-200/80 transition-all duration-300 border border-stone-200/50 shadow-sm"
        title="书页设置"
      >
        <Settings size={18} />
        <span className="text-sm font-medium hidden sm:inline">书页设置</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-72 bg-stone-50/95 backdrop-blur-sm rounded-2xl shadow-lg border border-stone-200/60 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200/60">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-stone-500" />
          <span className="text-sm font-medium text-stone-700">书页设置</span>
        </div>
        <button
          onClick={togglePageSettings}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/60 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-stone-600">纸张泛黄程度</label>
            <span className="text-xs text-stone-400">{pageSettings.yellowing}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={pageSettings.yellowing}
            onChange={(e) => setPageSettings({ yellowing: Number(e.target.value) })}
            className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-amber-500/70"
          />
          <div className="flex justify-between text-xs text-stone-400">
            <span>洁白</span>
            <span>泛黄</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-stone-600">纸张粗糙度</label>
            <span className="text-xs text-stone-400">{pageSettings.roughness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={pageSettings.roughness}
            onChange={(e) => setPageSettings({ roughness: Number(e.target.value) })}
            className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-stone-500/70"
          />
          <div className="flex justify-between text-xs text-stone-400">
            <span>光滑</span>
            <span>粗糙</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-stone-600">页边距宽窄</label>
            <span className="text-xs text-stone-400">{pageSettings.margin}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={pageSettings.margin}
            onChange={(e) => setPageSettings({ margin: Number(e.target.value) })}
            className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-stone-500/70"
          />
          <div className="flex justify-between text-xs text-stone-400">
            <span>窄边</span>
            <span>宽边</span>
          </div>
        </div>
      </div>
    </div>
  );
}
