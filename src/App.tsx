import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Reader from "@/pages/Reader";
import { Bookshelf } from "@/components/shelf/Bookshelf";
import { BookEditor } from "@/components/shelf/BookEditor";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Bookshelf />} />
        <Route path="/read" element={<Reader />} />
        <Route path="/book/:bookId" element={<Reader />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
      <BookEditor />
    </Router>
  );
}
