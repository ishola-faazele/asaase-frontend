import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ account, onConnect, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            Asaase NFT
          </Link>
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/" className="text-white hover:text-gray-400">
              Home
            </Link>
            <Link to="/dashboard" className="text-white hover:text-gray-400">
              Dashboard
            </Link>
            <Link to="/mint" className="text-white hover:text-gray-400">
              Mint
            </Link>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Token"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            {account ? (
              <span className="text-white">{account}</span>
            ) : (
              <button
                onClick={onConnect}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Connect Wallet
              </button>
            )}
          </div>
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <Link to="/" className="block text-white hover:text-gray-400 py-2">
              Home
            </Link>
            <Link to="/dashboard" className="block text-white hover:text-gray-400 py-2">
              Dashboard
            </Link>
            <Link to="/mint" className="block text-white hover:text-gray-400 py-2">
              Mint
            </Link>
            <div className="relative mt-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Search
              </button>
            </div>
            <div className="mt-4">
              {account ? (
                <span className="text-white">{account}</span>
              ) : (
                <button
                  onClick={onConnect}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;