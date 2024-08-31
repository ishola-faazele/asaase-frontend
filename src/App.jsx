import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/NavBar';
import MintPage from './pages/MintPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"  element={<Home />} />
        <Route path="/about" />
        <Route path="/mint" element={<MintPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
