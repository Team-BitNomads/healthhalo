import React, { useState, useEffect } from 'react';
import { ShieldCheck, Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100' 
        : 'bg-white/90 backdrop-blur-sm shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              <ShieldCheck className="h-8 w-8 text-emerald-600 group-hover:text-emerald-700 transition-all duration-300 group-hover:scale-110 drop-shadow-sm" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:to-emerald-500 transition-all duration-300">
              HealthHalo
            </span>
            <Sparkles className="h-4 w-4 text-emerald-400 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce" />
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {['Features', 'About Us', 'Contact'].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '')}`} 
                  className="relative text-slate-600 hover:text-emerald-600 px-4 py-2 rounded-lg text-base font-medium transition-all duration-300 hover:bg-emerald-50 group overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10">{item}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </a>
              ))}
              <a 
                href="#auth" 
                className="relative ml-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <div className="ml-2 w-2 h-2 bg-white rounded-full group-hover:animate-pulse"></div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </a>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 inline-flex items-center justify-center p-2.5 rounded-xl text-white hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 group"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Features', 'About Us', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '')}`}
                className="block text-slate-600 hover:text-emerald-600 px-4 py-2 rounded-lg text-base font-medium transition-all duration-300 hover:bg-emerald-50"
              >
                {item}
              </a>
            ))}
            <a
              href="#auth"
              className="block mt-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;