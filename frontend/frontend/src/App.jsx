import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import CustomCursor from './components/CustomCursor';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <div className="min-h-screen bg-black text-white selection:bg-white/30">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
