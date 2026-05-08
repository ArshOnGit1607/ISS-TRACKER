import React, { useState } from 'react';
import { Satellite, Newspaper, BarChart3, Moon, Sun, Menu, X, Rocket } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function Navbar() {
  const { theme, toggleTheme } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'tracker', label: 'Telemetry', icon: Satellite },
    { id: 'news', label: 'Briefings', icon: Newspaper },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <nav className="bg-white/80 dark:bg-space-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-white/10 sticky top-0 z-40 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="flex-shrink-0 flex items-center space-x-2 text-blue-600 dark:text-blue-400 group">
              <Rocket size={28} className="group-hover:text-blue-500 transition-colors" />
              <span className="font-bold text-xl tracking-tight hidden sm:block uppercase tracking-wider">AstroDash</span>
            </a>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8 h-full">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <a
                    key={tab.id}
                    href={`#${tab.id}`}
                    className="inline-flex items-center space-x-2 px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-blue-600 hover:border-blue-500 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:border-blue-400 transition-all duration-200 h-full uppercase tracking-wider"
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-space-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} className="hover:text-yellow-400 transition-colors" /> : <Moon size={20} className="hover:text-blue-600 transition-colors" />}
            </button>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-space-800 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-space-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 shadow-lg absolute w-full">
          <div className="pt-2 pb-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center space-x-3 pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-space-800 dark:hover:border-blue-400 dark:hover:text-blue-400 uppercase tracking-wider transition-all"
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
