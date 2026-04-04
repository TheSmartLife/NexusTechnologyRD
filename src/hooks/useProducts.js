import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

/**
 * useProducts — hook for full product CRUD backed by Supabase.
 *
 * Returns:
 *   products              — array sanitised for the current user role
 *                           (precio_mayorista is STRIPPED for non-wholesale users)
 *   rawProducts           — full array (use ONLY inside Admin)  
 *   loading               — boolean indicating if initial fetch is running
 *   addProduct(p)         — add a new product via Supabase
 *   editProduct(p)        — replace product with matching id
 *   deleteProduct(id)     — remove product by id
 *   toggleAvailability(id)— flip available flag
 */
export function useProducts() {
  const { isWholesale } = useAuth();
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch and Realtime subscription
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
         setRawProducts(data);
      } else if (error) {
         console.error("Error cargando productos de Supabase:", error);
      }
      setLoading(false);
    }
    
    fetchProducts();
    
    const subscription = supabase
      .channel('products-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
         if (payload.eventType === 'INSERT') {
            setRawProducts(prev => [payload.new, ...prev]);
         } else if (payload.eventType === 'UPDATE') {
            setRawProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
         } else if (payload.eventType === 'DELETE') {
            setRawProducts(prev => prev.filter(p => p.id !== payload.old.id));
         }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    }
  }, []);

  // ── Sanitise: strip precio_mayorista from non-wholesale users ────────────────
  const products = useMemo(() => {
    if (isWholesale) return rawProducts;
    // Remove precio_mayorista entirely so it never reaches the DOM
    return rawProducts.map(({ precio_mayorista, ...rest }) => rest);
  }, [rawProducts, isWholesale]);

  const addProduct = async (product) => {
    const { id, created_at, ...payload } = product; 
    const { error } = await supabase.from('products').insert([payload]);
    if (error) console.error("Error adding product:", error);
  };

  const editProduct = async (updated) => {
    const { id, created_at, ...payload } = updated;
    const { error } = await supabase.from('products').update(payload).eq('id', id);
    if (error) console.error("Error editing product:", error);
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error("Error deleting product:", error);
  };

  const toggleAvailability = async (id) => {
    const p = rawProducts.find(x => x.id === id);
    if (!p) return;
    const { error } = await supabase.from('products').update({ available: !p.available }).eq('id', id);
    if (error) console.error("Error toggling product availability:", error);
  };

  return { products, rawProducts, loading, addProduct, editProduct, deleteProduct, toggleAvailability };
}
