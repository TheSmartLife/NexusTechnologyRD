import { useEffect, useCallback, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Download } from 'lucide-react';

async function downloadImage(src, filename) {
  try {
    if (src.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = src;
      a.download = filename;
      a.click();
    } else {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  } catch {
    window.open(src, '_blank');
  }
}

/**
 * Lightbox — full-screen image gallery overlay for wholesale users.
 * Props:
 *   images      — string[]
 *   current     — number (index)
 *   onChange    — (newIndex: number) => void
 *   onClose     — () => void
 *   productName — string (optional)
 *   specs       — object (optional)
 */
export default function Lightbox({ images, current, onChange, onClose, productName = '', specs = {} }) {
  const total = images.length;
  const [showSpecs, setShowSpecs] = useState(false);

  const prev = useCallback(() => onChange((current - 1 + total) % total), [current, total, onChange]);
  const next = useCallback(() => onChange((current + 1) % total), [current, total, onChange]);

  const specEntries = Object.entries(specs || {});

  const handleDownload = () => {
    const src = images[current];
    if (src) downloadImage(src, `${productName.replace(/\s+/g, '-').toLowerCase() || 'imagen'}.jpg`);
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/96 backdrop-blur-xl animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Galería de imágenes"
    >
      {/* ─── Top bar ─── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent z-10">
        {/* Product name */}
        <span className="text-white font-bold text-sm truncate max-w-[50%]">{productName}</span>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Counter */}
          <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium">
            {current + 1} / {total}
          </span>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            title="Descargar imagen"
          >
            <Download size={14} /> Descargar
          </button>

          {/* Specs toggle */}
          {specEntries.length > 0 && (
            <button
              onClick={() => setShowSpecs(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                showSpecs
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              📋 Specs
            </button>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Cerrar galería"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ─── Main content ─── */}
      <div className="flex w-full h-full">
        {/* Main image */}
        <div className={`flex items-center justify-center transition-all duration-300 ${showSpecs ? 'flex-1' : 'w-full'} px-16 py-20`}>
          <img
            src={images[current]}
            alt={`${productName} - imagen ${current + 1}`}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl select-none"
            draggable={false}
          />
        </div>

        {/* Specs panel */}
        {showSpecs && specEntries.length > 0 && (
          <div className="w-72 bg-dark-700/80 backdrop-blur-sm border-l border-white/10 flex flex-col py-20 px-5 overflow-y-auto">
            <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
              📋 Especificaciones
            </h3>
            <div className="space-y-2">
              {specEntries.map(([key, value]) => (
                <div key={key} className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-0.5">{key}</div>
                  <div className="text-white font-bold text-sm">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Prev / Next ─── */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all hover:scale-110"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all hover:scale-110"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* ─── Thumbnail strip ─── */}
      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${
                i === current
                  ? 'border-brand-400 shadow-lg shadow-brand-500/30'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}

      {/* ─── Wholesale badge ─── */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
        <ZoomIn size={13} />
        Vista Mayorista
      </div>
    </div>
  );
}
