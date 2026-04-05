import { useState } from 'react';
import { ChevronLeft, ChevronRight, Crown, ZoomIn, Download, AlignLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Lightbox from './Lightbox';

// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '8295314928';

const TAG_STYLES = {
  Nuevo: 'bg-brand-600 text-white',
  Oferta: 'bg-amber-500 text-white',
};

const CATEGORY_LABELS = {
  celulares: 'Celular',
  laptops: 'Laptop',
  pcs: 'PC',
  componentes: 'Componente',
  accesorios: 'Accesorio',
};

function buildWhatsAppUrl(product, isWholesale) {
  const mainImage = (product.images?.length > 0 ? product.images[0] : product.image) || '';
  const hasValidLink = mainImage.startsWith('http');
  const priceLabel = isWholesale && product.precio_mayorista
    ? `RD$${product.precio_mayorista.toLocaleString('es-DO')} (precio mayorista)`
    : `RD$${product.price.toLocaleString('es-DO')}`;

  const specEntries = Object.entries(product.specs || {}).filter(([k]) => k !== 'description');
  const details = product.specs?.description
    ? product.specs.description
    : specEntries.map(([k, v]) => `• ${k}: ${v}`).join('\n');

  let text = `Hola! Acabo de ver esto en tu tienda y me interesa comprarlo:\n*${product.name}*\n💰 Precio: ${priceLabel}`;
  if (details) text += `\n\n📋 Detalles:\n${details}`;
  if (hasValidLink) text += `\n\n🖼️ Ver imagen: ${mainImage}`;
  text += `\n\n¿Tienen disponibles?`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Download image helper
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

export default function ProductCard({ product }) {
  const { name, price, precio_mayorista, category, image, images, specs, available, tags } = product;
  const { isWholesale } = useAuth();

  const allImages = images?.length > 0 ? images : (image ? [image] : []);
  const [imgIdx, setImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const specEntries = Object.entries(specs || {});

  const nextImg = (e) => { e.preventDefault(); e.stopPropagation(); setImgIdx(i => (i + 1) % allImages.length); };
  const prevImg = (e) => { e.preventDefault(); e.stopPropagation(); setImgIdx(i => (i - 1 + allImages.length) % allImages.length); };

  const openLightbox = (e) => {
    e.preventDefault();
    if (isWholesale) setLightboxOpen(true);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const src = allImages[imgIdx] || allImages[0];
    if (src) downloadImage(src, `${name.replace(/\s+/g, '-').toLowerCase()}.jpg`);
  };

  return (
    <>
      {lightboxOpen && (
        <Lightbox
          images={allImages}
          current={imgIdx}
          onChange={setImgIdx}
          onClose={() => setLightboxOpen(false)}
          productName={name}
          specs={specs}
        />
      )}

      <article className="product-card group relative flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-dark-700 shadow-card border border-slate-100 dark:border-dark-600 animate-fade-in">

        {/* ─── Image ─── */}
        <div
          className={`relative w-full aspect-[4/3] sm:aspect-[4/3] max-sm:aspect-square bg-transparent p-0 group/gallery ${isWholesale ? 'cursor-zoom-in' : ''}`}
          onClick={isWholesale ? openLightbox : undefined}
        >
          <img
            src={allImages[imgIdx] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'}
            alt={name}
            loading="lazy"
            className="w-full h-full object-contain p-2 transition-transform duration-500 hover:scale-105 max-sm:scale-110 mix-blend-multiply dark:mix-blend-normal"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'; }}
          />

          {/* Regular gallery controls (non-wholesale) */}
          {allImages.length > 1 && !isWholesale && (
            <>
              <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover/gallery:opacity-100 transition-opacity">
                <ChevronLeft size={18} />
              </button>
              <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover/gallery:opacity-100 transition-opacity">
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
                {allImages.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-500'}`} />
                ))}
              </div>
            </>
          )}

          {/* Wholesale hint overlay */}
          {isWholesale && allImages.length > 0 && (
            <div className="absolute inset-0 flex items-end justify-between px-2 pb-2 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 text-white text-[10px] font-medium backdrop-blur-sm">
                <ZoomIn size={11} /> Ver galería
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 hover:bg-black/70 text-white text-[10px] font-medium backdrop-blur-sm transition-colors"
                title="Descargar imagen"
              >
                <Download size={11} /> Descargar
              </button>
            </div>
          )}

          {/* Download button for regular users too */}
          {!isWholesale && allImages.length > 0 && (
            <button
              onClick={handleDownload}
              className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 hover:bg-black/70 text-white text-[10px] font-medium backdrop-blur-sm opacity-0 group-hover/gallery:opacity-100 transition-opacity"
              title="Descargar imagen"
            >
              <Download size={11} /> Descargar
            </button>
          )}

          {/* Category label */}
          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
            {CATEGORY_LABELS[category] ?? category}
          </span>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="absolute top-3 right-3 flex flex-col gap-1">
              {tags.map(tag => (
                <span key={tag} className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${TAG_STYLES[tag] ?? 'bg-slate-600 text-white'}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Out of stock overlay */}
          {!available && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <span className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold tracking-wide shadow-lg">
                AGOTADO
              </span>
            </div>
          )}
        </div>

        {/* ─── Body ─── */}
        <div className="flex flex-col flex-1 p-4 gap-3">

          {/* Name */}
          <h2 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2">
            {name}
          </h2>

          {/* Price section */}
          <div className="flex flex-col gap-1">
            {isWholesale && precio_mayorista ? (
              <>
                <div className="flex items-center gap-2">
                  <Crown size={14} className="text-amber-500 flex-shrink-0" />
                  <span className="text-2xl font-black text-amber-500">
                    RD${precio_mayorista.toLocaleString('es-DO')}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                    Mayorista
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                    RD${price.toLocaleString('es-DO')}
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                    Ahorra RD${(price - precio_mayorista).toLocaleString('es-DO')}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-2xl font-black gradient-text">
                RD${price.toLocaleString('es-DO')}
              </span>
            )}
          </div>

          {/* ─── DESCRIPTION / SPECS ─── */}
          {(specs?.description || specEntries.length > 0) && (
            <div className="mt-1 p-3 rounded-xl bg-slate-50 dark:bg-dark-600/50 border border-slate-100 dark:border-dark-500 shadow-sm">
              {specs?.description ? (
                <div className="flex gap-2 relative">
                  <AlignLeft size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap line-clamp-5">
                    {specs.description}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 text-[13px] font-medium leading-relaxed">
                  {specEntries.slice(0, 3).map(([k, v], i) => (
                    <p key={i} className="break-words flex gap-2">
                      <span className="text-slate-400 dark:text-slate-500 min-w-max font-semibold">{k}:</span> 
                      <span className="text-slate-700 dark:text-slate-300">{v}</span>
                    </p>
                  ))}
                  {specEntries.length > 3 && (
                    <p className="text-brand-600 dark:text-brand-400 text-xs font-bold pt-1.5">
                      +{specEntries.length - 3} más detalles…
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Availability badge */}
          <div>
            {available ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
                Disponible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 dark:text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Agotado
              </span>
            )}
          </div>

          {/* WhatsApp button */}
          <a
            id={`wa-btn-${product.id}`}
            href={buildWhatsAppUrl(product, isWholesale)}
            target="_blank"
            rel="noopener noreferrer"
            className={`wa-btn mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${available
                ? isWholesale
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]'
                : 'bg-slate-200 dark:bg-dark-600 text-slate-400 dark:text-slate-500 cursor-not-allowed pointer-events-none'
              }`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {available
              ? isWholesale ? 'Consultar precio mayorista' : 'Consultar por WhatsApp'
              : 'No disponible'}
          </a>
        </div>
      </article>
    </>
  );
}
