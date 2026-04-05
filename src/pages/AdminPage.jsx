import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useDarkMode } from '../context/DarkModeContext';
import { supabase } from '../lib/supabase';
import initialProducts from '../data/products.json';
import {
  ArrowLeft, Plus, Pencil, Trash2, CheckCircle, XCircle,
  Sun, Moon, ShieldCheck, X, Save, AlertTriangle, KeyRound, Crown, UploadCloud, Database
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PASSWORD
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = '63236';

const CATEGORIES = [
  { id: 'laptops', label: 'Laptops' },
  { id: 'celulares', label: 'Celulares' },
  { id: 'componentes', label: 'Componentes' },
  { id: 'accesorios', label: 'Accesorios' },
];

const EMPTY_FORM = {
  name: '',
  category: 'laptops',
  price: '',
  precio_mayorista: '',
  image: '',
  images: [],
  available: true,
  tags: [],
  specs: { description: '' },
};

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [uploading, setUploading] = useState(false);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleTag = (tag) => {
    set('tags', (form.tags || []).includes(tag)
      ? form.tags.filter(t => t !== tag)
      : [...(form.tags || []), tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    onSave({
      ...form,
      price: parseFloat(form.price),
      precio_mayorista: form.precio_mayorista ? parseFloat(form.precio_mayorista) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        {initial ? 'Editar producto' : 'Agregar nuevo producto'}
      </h2>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Nombre del producto *
        </label>
        <input className="input-field" required placeholder="Ej: Laptop Dell Inspiron 15"
          value={form.name} onChange={e => set('name', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Categoría
          </label>
          <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Precio público (RD$) *
          </label>
          <input className="input-field" type="number" min="0" required placeholder="0"
            value={form.price} onChange={e => set('price', e.target.value)} />
        </div>
      </div>

      {/* Wholesale price */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-900/10 p-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">
          <Crown size={14} className="text-amber-500" />
          Precio al por mayor (RD$)
          <span className="text-xs font-normal text-amber-600/70 dark:text-amber-500/70 ml-1">Solo visible para mayoristas</span>
        </label>
        <input
          className="input-field border-amber-200 dark:border-amber-700/40 focus:ring-amber-400/30"
          type="number"
          min="0"
          placeholder="Dejar vacío si no aplica"
          value={form.precio_mayorista || ''}
          onChange={e => set('precio_mayorista', e.target.value)}
        />
        {form.price && form.precio_mayorista && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 font-medium">
            Descuento: {Math.round((1 - form.precio_mayorista / form.price) * 100)}% menos que el precio público
          </p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Imágenes del producto (Supabase Storage)
        </label>
        <div className="flex flex-col gap-3">
          {/* File input con soporte para Supabase */}
          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={async (e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                  setUploading(true);
                  const newImagesUrls = [];
                  for (const file of files) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                    
                    const { error } = await supabase.storage.from('images').upload(fileName, file);
                    if (error) { 
                      console.error("Error subiendo la imagen", error); 
                      continue; 
                    }
                    
                    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                    newImagesUrls.push(data.publicUrl);
                  }
                  const newImages = [...(form.images || []), ...newImagesUrls];
                  set('images', newImages);
                  if (!form.image) set('image', newImagesUrls[0] || '');
                  setUploading(false);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className={`py-4 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-colors
              ${uploading ? 'bg-slate-100 border-slate-300 dark:bg-dark-600 text-slate-500' : 'bg-brand-50 border-brand-200 dark:bg-brand-900/10 dark:border-brand-500/30 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/20'}`}>
              {uploading ? (
                 <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Subiendo a Supabase...</span>
              ) : (
                 <span className="flex items-center gap-2"><UploadCloud size={18} /> Haz clic o arrastra imágenes aquí</span>
              )}
            </div>
          </div>
          
          {/* Opcion URL */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">o pega una URL externa:</span>
            <input 
              className="input-field py-2 text-sm" 
              type="url" 
              placeholder="https://..."
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (e.target.value) {
                    const newImages = [...(form.images || []), e.target.value];
                    set('images', newImages);
                    if (!form.image) set('image', e.target.value);
                    e.target.value = '';
                  }
                }
              }} 
            />
          </div>
        </div>
        
        {/* Previews */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {(form.images?.length > 0 ? form.images : (form.image ? [form.image] : [])).map((imgUrl, i) => (
            <div key={i} className="relative group/preview">
              <img src={imgUrl} alt="preview" className="h-24 w-full object-cover rounded-xl border border-slate-200 dark:border-dark-600 shadow-sm" />
              <button
                type="button"
                onClick={() => {
                  const arr = (form.images || []).filter((_, idx) => idx !== i);
                  set('images', arr);
                  if (i === 0) set('image', arr[0] || '');
                }}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover/preview:opacity-100 hover:bg-black/80 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Specs / Descripcion */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Descripción del producto
        </label>
        <textarea
          className="input-field resize-y min-h-[120px]"
          placeholder="Escribe la descripción o detalles del producto..."
          value={form.specs?.description || ''}
          onChange={e => set('specs', { ...form.specs, description: e.target.value })}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Etiquetas
        </label>
        <div className="flex gap-2">
          {['Nuevo', 'Oferta'].map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors
                ${(form.tags || []).includes(tag)
                  ? tag === 'Nuevo' ? 'bg-brand-600 border-brand-600 text-white' : 'bg-amber-500 border-amber-500 text-white'
                  : 'border-slate-300 dark:border-dark-600 text-slate-500 dark:text-slate-400'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative flex-shrink-0">
          <input type="checkbox" className="sr-only" checked={form.available}
            onChange={e => set('available', e.target.checked)} />
          <div className={`w-11 h-6 rounded-full transition-colors ${form.available ? 'bg-green-500' : 'bg-slate-300 dark:bg-dark-600'}`} />
          <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.available ? 'translate-x-5' : ''}`} />
        </div>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {form.available ? 'Disponible' : 'Agotado'}
        </span>
      </label>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {initial ? 'Guardar cambios' : 'Agregar producto'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors font-semibold"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ─── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { onLogin(); }
    else { setError(true); setTimeout(() => setError(false), 2000); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-800 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-dark-700 rounded-2xl shadow-card border border-slate-100 dark:border-dark-600 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 flex items-center justify-center shadow-glow mb-4">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Panel de Administración</h1>
          <p className="text-sm text-slate-400 mt-1">Ingresa la contraseña para continuar</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="admin-password"
            type="password"
            placeholder="Contraseña"
            value={pw}
            onChange={e => setPw(e.target.value)}
            className={`input-field ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertTriangle size={13} /> Contraseña incorrecta
            </p>
          )}
          <button
            id="admin-login-btn"
            type="submit"
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Wholesale Code Config Panel ─────────────────────────────────────────────
function WholesaleCodePanel() {
  const [code, setCode] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('config').select('value').eq('id', 'wholesale_code').single().then(({data}) => {
       if (data) setCode(data.value);
    });
  }, []);

  const handleSave = async () => {
    if (!code.trim()) return;
    await supabase.from('config').upsert({ id: 'wholesale_code', value: code.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/40 rounded-2xl p-5 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <KeyRound size={18} className="text-amber-500" />
        <h3 className="font-bold text-amber-800 dark:text-amber-300">Código de Acceso Mayorista</h3>
      </div>
      <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
        Este es el código que los clientes deben ingresar para obtener precios especiales. Se guarda en Supabase.
      </p>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" size={16} />
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            style={{ paddingLeft: '40px' }}
            className="input-field font-mono tracking-widest border-amber-200 dark:border-amber-700/40 focus:ring-amber-400/30"
            placeholder="Escribe el código mayorista"
          />
        </div>
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {saved ? '✓ Guardado' : 'Guardar'}
        </button>
      </div>
      <p className="text-xs text-amber-600/70 dark:text-amber-500/70 mt-2">
        Código actual guardado: <code className="font-mono font-bold">{code || '...'}</code>
      </p>
    </div>
  );
}

// ─── Migrator Panel ─────────────────────────────────────────────────────────────
function MigratorPanel({ products }) {
  const [migrando, setMigrando] = useState(false);
  const [completado, setCompletado] = useState(false);

  // Ocultar si ya hay productos migrados
  if (products.length > 0 || completado) return null;

  const migrarDatos = async () => {
    setMigrando(true);
    // Inserta los datos del JSON
    for (const prod of initialProducts) {
       const { id, ...payload } = prod; // Quitamos el ID local para que Supabase use UUID
       await supabase.from('products').insert([payload]);
    }
    setMigrando(false);
    setCompletado(true);
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700/40 rounded-2xl p-5 mb-8 flex justify-between items-center animate-fade-in">
       <div className="flex gap-4 items-center">
         <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-500 rounded-full flex justify-center items-center">
           <Database size={24} />
         </div>
         <div>
           <h3 className="font-bold text-blue-800 dark:text-blue-300">Empezar con productos de prueba</h3>
           <p className="text-sm text-blue-700 dark:text-blue-400">Inserta los productos iniciales a la nueva base de datos Supabase de forma muy rápida.</p>
         </div>
       </div>
       <button onClick={migrarDatos} disabled={migrando} className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-md">
         {migrando ? 'Migrando...' : 'Migrar datos iniciales'}
       </button>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const { rawProducts: products, loading, addProduct, editProduct, deleteProduct, toggleAvailability } = useProducts();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [authed, setAuthed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add mode
  const [deleteId, setDeleteId] = useState(null);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const openAdd = () => { setEditTarget(null); setShowForm(true); };
  const openEdit = (p) => { setEditTarget(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTarget(null); };

  const handleSave = (data) => {
    if (editTarget) { editProduct({ ...editTarget, ...data }); }
    else { addProduct(data); }
    closeForm();
  };

  const confirmDelete = (id) => setDeleteId(id);
  const handleDelete = () => { deleteProduct(deleteId); setDeleteId(null); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-800">
      {/* Admin Navbar */}
      <header className="glass border-b border-slate-200 dark:border-dark-600 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-brand-500" />
              Panel de Administración
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              id="add-product-btn"
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors shadow-md"
            >
              <Plus size={16} /> Agregar producto
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <WholesaleCodePanel />
        {!loading && <MigratorPanel products={products} />}

        {/* Slide-in form panel */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
            <div className="w-full max-w-lg bg-white dark:bg-dark-700 h-full overflow-y-auto p-6 shadow-2xl animate-slide-up">
              <ProductForm
                initial={editTarget ? { ...editTarget, price: editTarget.price, precio_mayorista: editTarget.precio_mayorista ?? '', specs: editTarget.specs ?? {} } : undefined}
                onSave={handleSave}
                onCancel={closeForm}
              />
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <div className="relative bg-white dark:bg-dark-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-dark-600 animate-fade-in">
              <AlertTriangle size={32} className="text-red-500 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">¿Eliminar producto?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Esta acción no se puede deshacer de Supabase.</p>
              <div className="flex gap-3">
                <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
                  Eliminar
                </button>
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-dark-600 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-dark-600 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total productos', value: products.length },
            { label: 'Disponibles', value: products.filter(p => p.available).length },
            { label: 'Agotados', value: products.filter(p => !p.available).length },
            { label: 'Categorías', value: [...new Set(products.map(p => p.category))].length },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-dark-700 rounded-2xl p-4 border border-slate-100 dark:border-dark-600 shadow-card">
              <div className="text-2xl font-black gradient-text">
                {loading ? '-' : s.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Product table */}
        <div className="bg-white dark:bg-dark-700 rounded-2xl border border-slate-100 dark:border-dark-600 shadow-card overflow-hidden min-h-[300px]">
          {loading ? (
            <div className="flex h-full items-center justify-center p-12 text-slate-400">
               <div className="flex flex-col items-center">
                 <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
                 <p>Cargando productos de Supabase...</p>
               </div>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-dark-600 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Precio público</th>
                  <th className="px-4 py-3">
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <Crown size={11} /> P. Mayorista
                    </span>
                  </th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-600">
                {products.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-slate-400">No hay productos en tu base de datos Supabase todavía.</td></tr>
                ) : products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-dark-600/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-dark-600 flex-shrink-0"
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&q=60'; }}
                        />
                        <span className="font-medium text-slate-900 dark:text-white line-clamp-1 max-w-[180px]">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 capitalize">{p.category}</td>
                    <td className="px-4 py-3 font-bold gradient-text">RD${p.price.toLocaleString('es-DO')}</td>
                    <td className="px-4 py-3">
                      {p.precio_mayorista
                        ? <span className="font-bold text-amber-600 dark:text-amber-400">RD${p.precio_mayorista.toLocaleString('es-DO')}</span>
                        : <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvailability(p.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105
                          ${p.available
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}
                      >
                        {p.available ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {p.available ? 'Disponible' : 'Agotado'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {(p.tags ?? []).map(t => (
                          <span key={t} className={`px-2 py-0.5 rounded-full text-[10px] font-bold
                            ${t === 'Nuevo' ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => confirmDelete(p.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </main>
    </div>
  );
}
