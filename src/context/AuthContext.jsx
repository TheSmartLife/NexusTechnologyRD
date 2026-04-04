import { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const STORAGE_KEY_WS_ACTIVE  = 'techstore-wholesale-active';

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  // Persistir si el acceso mayorista ya fue activado en esta sesión
  const [isWholesale, setIsWholesale] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_WS_ACTIVE) === 'true';
  });

  /**
   * verificarCodigo(codigo) → { ok: boolean, error?: string }
   * Si el código coincide activa el modo mayorista leyendo de Supabase.
   */
  const verificarCodigo = async (codigo) => {
    try {
      const { data, error } = await supabase
        .from('config')
        .select('value')
        .eq('id', 'wholesale_code')
        .single();
        
      if (error) throw error;
      
      if (codigo.trim() === data.value) {
        localStorage.setItem(STORAGE_KEY_WS_ACTIVE, 'true');
        setIsWholesale(true);
        return { ok: true };
      }
      return { ok: false, error: 'Código incorrecto. Verifica e intenta de nuevo.' };
    } catch (e) {
      console.error(e);
      return { ok: false, error: 'Ocurrió un error. Verifica tu conexión.' };
    }
  };

  const cerrarAcceso = () => {
    localStorage.removeItem(STORAGE_KEY_WS_ACTIVE);
    setIsWholesale(false);
  };

  return (
    <AuthContext.Provider value={{ isWholesale, verificarCodigo, cerrarAcceso }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
