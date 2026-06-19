import { Highlighter, MessageSquare, Bookmark, Edit3, Plus, Menu } from 'lucide-react';
import { useQuoteStore } from '../../store/useQuoteStore';
import type { ActiveTool, HighlightColor } from '../../types';

const tools: { id: ActiveTool; icon: typeof Highlighter; label: string }[] = [
  { id: 'highlight', icon: Highlighter, label: '荧光笔' },
  { id: 'annotation', icon: MessageSquare, label: '批注' },
  { id: 'bookmark', icon: Bookmark, label: '书签' },
  { id: 'edit', icon: Edit3, label: '编辑' },
];

const colors: HighlightColor[] = ['yellow', 'green', 'pink', 'blue'];

const colorMap: Record<HighlightColor, string> = {
  yellow: 'bg-yellow-300',
  green: 'bg-green-300',
  pink: 'bg-pink-300',
  blue: 'bg-blue-300',
};

export function Toolbar() {
  const { activeTool, setActiveTool, highlightColor, setHighlightColor, toggleSidebar, openEditor, getCurrentQuote } = useQuoteStore();
  const currentQuote = getCurrentQuote();

  const handleToolClick = (tool: ActiveTool) => {
    if (tool === 'edit' && currentQuote) {
      openEditor(currentQuote.id);
      return;
    }
    setActiveTool(activeTool === tool ? 'none' : tool);
  };

  return (
    <>
      <div className="fixed top-6 left-6 z-40">
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-800 transition-all duration-300 hover:scale-105"
          title="打开侧边栏"
        >
          <Menu size={18} />
        </button>
      </div>

      <div className="fixed top-6 right-6 z-40">
        <div className="flex flex-col gap-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-gray-800'
                }`}
                title={tool.label}
              >
                <Icon size={18} />
              </button>
            );
          })}

          <button
            onClick={() => openEditor()}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg flex items-center justify-center hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105"
            title="新建摘抄"
          >
            <Plus size={20} />
          </button>
        </div>

        {activeTool === 'highlight' && (
          <div className="mt-3 flex flex-col gap-2 items-center bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setHighlightColor(color)}
                className={`w-6 h-6 rounded-full ${colorMap[color]} transition-all duration-200 hover:scale-110 ${
                  highlightColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                }`}
                title={`${color} 荧光笔`}
              />
            ))}
          </div>
        )}
      </div>

      {activeTool !== 'none' && activeTool !== 'edit' && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40">
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg text-sm text-gray-600">
            {activeTool === 'highlight' && '选择文字添加高亮，点击已有高亮可移除'}
            {activeTool === 'annotation' && '点击文字位置添加批注'}
            {activeTool === 'bookmark' && '点击页面切换书签标记'}
          </div>
        </div>
      )}
    </>
  );
}
