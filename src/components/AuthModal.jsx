import { useState } from 'react';
import { X, KeyRound, Crown, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const { verificarCodigo, isWholesale } = useAuth();
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 300));

    const result = verificarCodigo(codigo);

    if (result.ok) {
      onClose();
    } else {
      setError(result.error);
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // ── Si ya es mayorista, mostrar pantalla de confirmación ──
  if (isWholesale) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-white dark:bg-dark-700 rounded-3xl shadow-2xl border border-slate-100 dark:border-dark-600 overflow-hidden animate-fade-in">
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-green-400 to-amber-400" />
          <div className="p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-green-500 flex items-center justify-center shadow-lg">
                <CheckCircle size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">¡Acceso Activo!
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Ya tienes los <span className="font-bold text-amber-600 dark:text-amber-400">precios de mayorista</span> activos en esta sesión.
                  Todos los productos muestran sus precios especiales.
                </p>
              </div>
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-bold">
                <Crown size={14} /> Modo Mayorista Activo
              </span>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-green-500 hover:from-amber-600 hover:to-green-600 text-white font-bold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Entendido, continuar comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      {/* Card */}
      <div className={`relative w-full max-w-sm bg-white dark:bg-dark-700 rounded-3xl shadow-2xl border border-slate-100 dark:border-dark-600 overflow-hidden animate-fade-in ${shake ? 'animate-bounce' : ''}`}>

        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-brand-500 to-amber-400" />

        <div className="p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>

          {/* Icon + Title */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-brand-600 flex items-center justify-center shadow-lg mb-4">
              <Crown size={30} className="text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Acceso Mayorista
            </h2>
            <p className="text-sm text-slate-400 mt-1 text-center">
              Ingresa tu código para ver los precios especiales
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Code input */}
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
              <input
                id="access-code-input"
                type="text"
                placeholder="Ingresa tu código"
                value={codigo}
                onChange={e => { setCodigo(e.target.value); setError(''); }}
                autoFocus
                style={{ paddingLeft: '40px' }}
                className="input-field text-center font-mono tracking-widest border-amber-200 dark:border-amber-700/40 focus:ring-amber-400/40"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2 text-center">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              id="access-code-submit"
              type="submit"
              disabled={loading || !codigo.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 text-white font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Crown size={16} /> Acceder</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
