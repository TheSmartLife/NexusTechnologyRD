import { Zap, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#060B19] py-12 sm:py-20 flex flex-col items-center justify-center min-h-[70vh]">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-brand-600/10 blur-[100px]" />
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-accent-500/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center z-10">
        
        {/* Main Logo & Glow */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-brand-400/30 blur-2xl rounded-full scale-110 opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
          <img 
            src="/logo.png" 
            alt="Nexus Technology Rd" 
            className="relative w-full max-w-[280px] sm:max-w-[450px] md:max-w-[550px] h-auto object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.4)] animate-float"
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentElement.innerHTML = '<span class="text-5xl font-black text-white px-8 py-4 bg-brand-600/20 rounded-2xl border border-brand-500/30">NEXUS</span>';
            }}
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#102A4C]/50 border border-brand-500/30 text-slate-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm animate-fade-in">
          <Zap size={14} className="text-brand-400" />
          Los mejores precios en tecnología
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.2] mb-4 animate-slide-up max-w-4xl mx-auto">
          Tu tienda de{' '}
          <span className="text-brand-400 drop-shadow-[0_2px_10px_rgba(56,189,248,0.3)]">tecnología</span> de confianza
        </h1>

        {/* Sub */}
        <p className="text-slate-400 text-sm sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 font-light leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
          Laptops, PCs de escritorio, componentes y accesorios. Consulta disponibilidad y precios directamente por WhatsApp.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up w-full sm:w-auto" style={{ animationDelay: '200ms' }}>
          <a
            href="#catalogo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-500 text-white font-semibold flex-shrink-0 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            Ver catálogo
            <ArrowRight size={18} />
          </a>
          
          <a
            href="https://wa.link/wrvh4a"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#0F172A]/80 hover:bg-[#1E293B] border border-slate-700 hover:border-slate-500 text-white font-semibold flex-shrink-0 transition-all duration-300 backdrop-blur-md"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-400">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
