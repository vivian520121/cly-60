import { BookReader } from '../components/book/BookReader';
import { TemplateSwitcher } from '../components/book/TemplateSwitcher';
import { Toolbar } from '../components/editor/Toolbar';
import { Sidebar } from '../components/sidebar/Sidebar';
import { QuoteEditor } from '../components/editor/QuoteEditor';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {/* 主内容 */}
      <div className="relative z-10">
        <BookReader />
      </div>

      {/* 工具栏 */}
      <Toolbar />

      {/* 侧边栏 */}
      <Sidebar />

      {/* 模板切换器 */}
      <TemplateSwitcher />

      {/* 编辑器弹窗 */}
      <QuoteEditor />
    </div>
  );
}