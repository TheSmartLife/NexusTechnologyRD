import { Package } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400 dark:text-slate-500">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-medium text-slate-600 dark:text-slate-300">Cargando catálogo...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400 dark:text-slate-500">
        <Package size={56} strokeWidth={1} />
        <p className="text-lg font-medium">No se encontraron productos</p>
        <p className="text-sm">Intenta con otra búsqueda o categoría</p>
      </div>
    );
  }

  return (
    <div
      id="catalogo"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
