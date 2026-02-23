import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-dark/80 backdrop-blur-md border-b border-border px-8 py-4 sticky top-0 z-50 flex justify-between items-center">
      <Link to="/home" className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        AI CodeReviewer
      </Link>
      <nav>
        <Link 
          to="/home" 
          className={`ml-8 font-medium transition-colors ${
            location.pathname === '/home' ? 'text-white' : 'text-muted hover:text-white'
          }`}
        >
          Review
        </Link>
        <Link 
          to="/history" 
          className={`ml-8 font-medium transition-colors ${
            location.pathname === '/history' ? 'text-white' : 'text-muted hover:text-white'
          }`}
        >
          History
        </Link>
      </nav>
    </header>
  );
};

export default Header;