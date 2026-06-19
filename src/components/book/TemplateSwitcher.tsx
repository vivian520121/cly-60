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
      <div className="flex items-center gap-1 bg-stone-50/70 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-stone-200/50">
        {templates.map((template) => {
          const isActive = currentTemplate === template;
          const style = templateStyles[template];

          return (
            <button
              key={template}
              onClick={() => setCurrentTemplate(template)}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-stone-200/60 text-stone-600'
                  : 'text-stone-400 hover:text-stone-500 hover:bg-stone-100/50'
              }`}
              title={style.name}
            >
              <span className="text-lg opacity-80">{templateIcons[template]}</span>
              <span className="text-xs font-normal hidden sm:block">{style.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
