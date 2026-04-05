import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Search, Menu, X, ShieldCheck, LogOut, Crown } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'celulares', label: 'Celulares' },
  { id: 'accesorios', label: 'Accesorios' },
  { id: 'componentes', label: 'Componentes' },
];

export default function Navbar({ activeCategory, onCategoryChange, search, onSearchChange }) {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { isWholesale, cerrarAcceso } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

      <header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-dark-600">
        {/* ─── Top bar ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 sm:gap-4 flex-shrink-0 group mr-2 sm:mr-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center group-hover:scale-110 transition-transform overflow-visible drop-shadow-md">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" onError={e => { e.target.onerror = null; e.target.parentElement.innerHTML = '<span class="text-xs font-bold text-slate-800 dark:text-white">NTR</span>'; }} />
              </div>
              <span className="font-black flex flex-col justify-center -translate-y-[2px]">
                <span className="gradient-text text-lg sm:text-2xl leading-tight">Nexus</span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-0.5">Technology Rd</span>
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="navbar-search"
                type="text"
                placeholder="Buscar productos…"
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                className="input-field !pl-10"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                id="dark-mode-toggle"
                onClick={toggleDarkMode}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors"
                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                id="admin-btn"
                onClick={() => navigate('/admin')}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors"
                title="Panel de administración"
              >
                <ShieldCheck size={18} />
              </button>

              {/* F11 button — wholesale access */}
              {isWholesale ? (
                <div className="relative">
                  <button
                    id="f11-btn"
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all"
                  >
                    <Crown size={15} className="text-amber-500 flex-shrink-0" />
                    <span className="text-sm font-bold hidden sm:block">F11</span>
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-dark-700 rounded-2xl shadow-xl border border-slate-100 dark:border-dark-600 overflow-hidden z-50 animate-fade-in">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-dark-600">
                          <div className="flex items-center gap-1.5">
                            <Crown size={13} className="text-amber-500" />
                            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Acceso Mayorista</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">Precios especiales activos</p>
                        </div>
                        <button
                          id="cerrar-acceso-btn"
                          onClick={() => { cerrarAcceso(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold"
                        >
                          <LogOut size={15} />
                          Cerrar acceso
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  id="f11-btn"
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-all shadow-md hover:shadow-lg hover:scale-[1.03]"
                >
                  F11
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                id="mobile-menu-toggle"
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {menuOpen && (
            <div className="md:hidden pb-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar productos…"
                  value={search}
                  onChange={e => onSearchChange(e.target.value)}
                  className="input-field !pl-10"
                />
              </div>
            </div>
          )}
        </div>

        {/* ─── Category nav ─── */}
        <div className="border-t border-slate-100 dark:border-dark-700 bg-white dark:bg-dark-800/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Desktop categories */}
            <div className="hidden sm:flex gap-2 py-2.5 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  onClick={() => { onCategoryChange(cat.id); setMenuOpen(false); }}
                  className={`cat-pill whitespace-nowrap ${activeCategory === cat.id ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}

              {/* Wholesale banner pill (desktop) */}
              {isWholesale && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 text-xs font-bold whitespace-nowrap ml-auto animate-fade-in">
                  <Crown size={11} /> ✓ Precios mayorista activos &mdash; ¡Bienvenido!
                </span>
              )}
            </div>

            {/* Mobile categories dropdown */}
            <div className="sm:hidden py-3 flex items-center gap-3">
              <select
                className="input-field py-2 text-sm font-semibold flex-1 border-slate-300 dark:border-dark-600 bg-slate-50 dark:bg-dark-700"
                value={activeCategory}
                onChange={(e) => {
                  onCategoryChange(e.target.value);
                  setMenuOpen(false);
                }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>

              {/* Wholesale banner icon (mobile) */}
              {isWholesale && (
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700/50 text-amber-600 dark:text-amber-400">
                  <Crown size={16} />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
