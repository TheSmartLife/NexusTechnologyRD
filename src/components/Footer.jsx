import { Instagram, Facebook } from 'lucide-react';

const SOCIAL_LINKS = [
  {
    label: 'WhatsApp',
    href: 'https://wa.link/wrvh4a',
    textColor: 'text-green-400',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 flex-shrink-0">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/nexus_technologyrd/',
    textColor: 'text-pink-400',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="url(#ig-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 flex-shrink-0">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="50%" stopColor="#ec4899"/>
            <stop offset="100%" stopColor="#8b5cf6"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://web.facebook.com/edwin.laradelarosa?locale=es_LA',
    textColor: 'text-blue-400',
    icon: <Facebook className="w-7 h-7 flex-shrink-0 text-blue-500" />,
  },
];

export default function Footer({ onCategoryClick }) {
  return (
    <footer className="relative mt-16 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 0%, #0f1e3b 0%, #050c1a 60%, #000510 100%)' }}>

      {/* ── Starfield ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
          {[...Array(120)].map((_, i) => {
            const cx = ((i * 137.508 + 23) % 100).toFixed(2);
            const cy = ((i * 97.3 + 11) % 100).toFixed(2);
            const r  = (((i * 3 + 1) % 3) === 0 ? 1.2 : ((i * 5 + 2) % 3) === 0 ? 0.8 : 0.5);
            const op = (0.3 + ((i * 7) % 7) * 0.1).toFixed(2);
            return <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r={r} fill="white" opacity={op} />;
          })}
        </svg>
      </div>

      {/* ── Main grid ── */}
      <div className="relative max-w-5xl mx-auto px-6 sm:px-10 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left — Brand */}
          <div className="flex flex-col items-center text-center">
            <img
              src="/logo.png"
              alt="Nexus Technology Rd"
              className="h-32 sm:h-40 w-auto object-contain mb-7"
              style={{ filter: 'drop-shadow(0 0 30px rgba(56,189,248,0.75)) drop-shadow(0 0 60px rgba(56,189,248,0.3))' }}
              onError={e => { e.target.onerror = null; e.target.parentElement.innerHTML = '<span style="font-size:2.5rem;font-weight:900;color:#fff;letter-spacing:0.05em;text-shadow:0 0 30px #38bdf8">NEXUS<br/><span style=\'font-size:0.8rem;letter-spacing:.3em\'>TECHNOLOGY RD</span></span>'; }}
            />
            <p className="text-slate-300 text-base leading-relaxed max-w-xs" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
              Tu tienda de tecnología de confianza.<br />
              Laptops, PCs, componentes y<br />
              accesorios al mejor precio.
            </p>
          </div>

          {/* Right — Contacto */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h3 className="text-white font-black text-2xl mb-8 tracking-wide">Contáctanos</h3>
            <ul className="flex flex-col gap-6 w-full items-center md:items-start">
              {SOCIAL_LINKS.map(({ label, href, icon, textColor }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-4 text-xl font-semibold text-slate-200 hover:${textColor} transition-all duration-200`}
                  >
                    {icon}
                    <span className="transition-colors duration-200 group-hover:text-white">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Glowing divider ── */}
      <div className="relative h-px mx-auto" style={{ maxWidth: '80%' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, #38bdf8 30%, #22d3ee 50%, #38bdf8 70%, transparent)' }} />
        <div className="absolute inset-0 blur-sm" style={{ background: 'linear-gradient(to right, transparent, #38bdf8 30%, #22d3ee 50%, #38bdf8 70%, transparent)', opacity: 0.8 }} />
        <div className="absolute inset-0 blur-lg" style={{ background: 'linear-gradient(to right, transparent, #38bdf8 40%, #22d3ee 50%, #38bdf8 60%, transparent)', opacity: 0.5 }} />
      </div>

      {/* ── Copyright bar ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Nexus Technology Rd · Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
