import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import { SlidersHorizontal } from 'lucide-react';

export default function HomePage() {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState('laptops');
  const [search, setSearch] = useState('');
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  // Priority order for "Todos" category
  const CATEGORY_ORDER = { laptops: 0, celulares: 1, accesorios: 2, componentes: 3 };

  const filtered = useMemo(() => {
    let result = products;

    // Filter by category
    if (activeCategory !== 'todos') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by availability
    if (!showOutOfStock) {
      result = result.filter(p => p.available);
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => {
        const inName = p.name.toLowerCase().includes(q);
        const inSpecs = Object.values(p.specs || {}).some(v =>
          String(v).toLowerCase().includes(q)
        );
        return inName || inSpecs;
      });
    }

    // Sort by category priority when in "todos" mode
    if (activeCategory === 'todos') {
      result = [...result].sort((a, b) => {
        const oa = CATEGORY_ORDER[a.category] ?? 99;
        const ob = CATEGORY_ORDER[b.category] ?? 99;
        return oa - ob;
      });
    }

    return result;
  }, [products, activeCategory, search, showOutOfStock]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-800">
      <Navbar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        search={search}
        onSearchChange={setSearch}
      />

      <Hero />

      {/* ─── Catalog section ─── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Catálogo de productos
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Toggle out-of-stock */}
          <label
            htmlFor="show-oos"
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <SlidersHorizontal size={16} className="text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-300">Mostrar agotados</span>
            <div className="relative">
              <input
                id="show-oos"
                type="checkbox"
                className="sr-only"
                checked={showOutOfStock}
                onChange={e => setShowOutOfStock(e.target.checked)}
              />
              <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${showOutOfStock ? 'bg-brand-600' : 'bg-slate-300 dark:bg-dark-600'}`} />
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${showOutOfStock ? 'translate-x-5' : ''}`} />
            </div>
          </label>
        </div>

        <ProductGrid products={filtered} loading={loading} />
      </main>

      <Footer onCategoryClick={(id) => {
        setActiveCategory(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
