import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookReader } from '../components/book/BookReader';
import { TemplateSwitcher } from '../components/book/TemplateSwitcher';
import { PageSettings } from '../components/book/PageSettings';
import { Toolbar } from '../components/editor/Toolbar';
import { Sidebar } from '../components/sidebar/Sidebar';
import { QuoteEditor } from '../components/editor/QuoteEditor';
import { ImportNotesModal } from '../components/editor/ImportNotesModal';
import { SearchModal } from '../components/search/SearchModal';
import { useQuoteStore } from '../store/useQuoteStore';
import { ArrowLeft, BookMarked } from 'lucide-react';

export default function Reader() {
  const navigate = useNavigate();
  const params = useParams<{ bookId: string }>();
  const currentBookId = useQuoteStore((state) => state.currentBookId);
  const setCurrentBookId = useQuoteStore((state) => state.setCurrentBookId);
  const getBookById = useQuoteStore((state) => state.getBookById);

  useEffect(() => {
    if (params.bookId && params.bookId !== currentBookId) {
      setCurrentBookId(params.bookId);
    }
  }, [params.bookId, currentBookId, setCurrentBookId]);

  const currentBook = currentBookId ? getBookById(currentBookId) : null;

  const handleBack = () => {
    navigate('/');
  };

  if (!currentBook && !currentBookId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-200 flex items-center justify-center">
            <BookMarked className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-ink-700 mb-3 font-serif">请先选择一本书</h2>
          <p className="text-ink-500 mb-6 font-kai">从书架中选择一本摘抄集开始阅读</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            返回书架
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-amber-200 text-ink-700 hover:bg-amber-50 transition-all shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">返回书架</span>
        </button>
      </div>

      {currentBook && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
          <div className="px-6 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-amber-200 shadow-lg">
            <h2 className="text-ink-700 font-serif font-bold text-lg">
              {currentBook.name}
            </h2>
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 pt-20">
        <BookReader />
      </div>

      <Toolbar />

      <Sidebar />

      <TemplateSwitcher />

      <PageSettings />

      <QuoteEditor />

      <ImportNotesModal />

      <SearchModal />
    </div>
  );
}
