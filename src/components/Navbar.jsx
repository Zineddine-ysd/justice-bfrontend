import { Scale, Gavel, Menu, X, LogIn, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 shadow-2xl border-b-4 border-amber-500 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Scale className="w-8 h-8 md:w-10 md:h-10 text-amber-400" />
              <Gavel className="w-6 h-6 md:w-8 md:h-8 text-amber-300" />
            </div>
            <Link to="/home" className="hover:opacity-90 transition-all duration-200">
              <h1 className="text-xl md:text-2xl font-bold text-amber-100 tracking-wide">
                Justice<span className="text-amber-400">DZ</span>
              </h1>
              <p className="text-xs text-blue-200 hidden sm:block">Votre assistant juridique</p>
            </Link>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/home/marcher" 
              className="flex items-center space-x-2 text-blue-200 hover:text-amber-300 transition-all duration-300 hover:scale-105"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">Comment ça marche ?</span>
            </Link>

            <Link to="/home/se-connecter">
              <button className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-blue-900 font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                <LogIn className="w-5 h-5" />
                <span>Se connecter</span>
              </button>
            </Link>
          </div>

          {/* Bouton hamburger mobile */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-amber-300 hover:text-amber-400 transition-colors p-2"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-blue-600 pt-4">
            <Link
              to="/home/marcher"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 text-blue-200 hover:text-amber-300 transition-colors py-2"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">Comment ça marche ?</span>
            </Link>

            <Link 
              to="/home/se-connecter"
              onClick={() => setIsMenuOpen(false)}
            >
              <button className="w-full flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-400 text-blue-900 font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-300">
                <LogIn className="w-5 h-5" />
                <span>Se connecter</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;