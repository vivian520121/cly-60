import { useQuoteStore } from '../../store/useQuoteStore';
import { templateStyles } from '../../utils/templateStyles';
import type { BookTemplate } from '../../types';

const templates: BookTemplate[] = ['ancient', 'notebook', 'newspaper', 'letter'];

const templateIcons: Record<BookTemplate, string> = {
  ancient: '📜',
  notebook: '📓',
  newspaper: '📰',
  letter: '✉️',
};

export function TemplateSwitcher() {
  const { currentTemplate, setCurrentTemplate } = useQuoteStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
        {templates.map((template) => {
          const isActive = currentTemplate === template;
          const style = templateStyles[template];

          const bgColor =
            template === 'ancient'
              ? 'bg-amber-100'
              : template === 'notebook'
              ? 'bg-slate-100'
              : template === 'newspaper'
              ? 'bg-stone-200'
              : 'bg-gray-100';

          const textColor =
            template === 'ancient'
              ? 'text-amber-800'
              : template === 'notebook'
              ? 'text-slate-700'
              : template === 'newspaper'
              ? 'text-gray-800'
              : 'text-slate-700';

          return (
            <button
              key={template}
              onClick={() => setCurrentTemplate(template)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-full transition-all duration-300 ${
                isActive
                  ? `${bgColor} ${textColor} shadow-md scale-105`
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
              title={style.name}
            >
              <span className="text-xl">{templateIcons[template]}</span>
              <span className="text-xs font-medium hidden sm:block">{style.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
