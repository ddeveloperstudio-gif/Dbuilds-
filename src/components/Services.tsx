import React from 'react';
import { SERVICES } from '../content';
import { Check, ArrowRight } from 'lucide-react';

interface ServicesProps {
  onSelectService?: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="relative py-28 md:py-36 bg-[#0A0E16] text-[#F4F6FA] border-t border-white/[0.04] overflow-hidden">
      {/* Subtle ambient lighting */}
      <div
        className="absolute top-1/3 -right-48 w-96 h-96 bg-[#63B3FF]/5 blur-[120px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#65F4E8] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#65F4E8]" />
            <span>CAPABILITIES / 002</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight text-white leading-tight text-balance mb-6">
            FROM IDEA TO <br />
            <span className="bg-gradient-to-r from-[#63B3FF] via-[#65F4E8] to-white bg-clip-text text-transparent">
              ONLINE PRESENCE.
            </span>
          </h2>
          <p className="font-body text-base text-[#929BAA] max-w-2xl leading-relaxed">
            Tailored engineering and creative direction for businesses seeking an uncompromising digital representation.
          </p>
        </div>

        {/* 3 Premium Service Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-2xl bg-[#101723]/60 hover:bg-[#101723] border border-white/[0.08] hover:border-[#63B3FF]/60 p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_40px_rgba(99,179,255,0.15)]"
            >
              {/* Top Row: Service Number and Geometric Visual */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-sm tracking-widest text-[#65F4E8]">
                    // {service.number}
                  </span>

                  {/* Geometric visual icon that shifts subtly in space on hover */}
                  <div className="w-12 h-12 rounded-xl bg-[#05070C] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[#63B3FF]/60 transition-transform duration-300">
                    {service.iconType === 'business' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#63B3FF]">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M9 21V9" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                    {service.iconType === 'ai' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#65F4E8]">
                        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.4" />
                      </svg>
                    )}
                    {service.iconType === 'creative' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#63B3FF]">
                        <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" stroke="currentColor" strokeWidth="1.5" />
                        <polygon points="12,6 18,10 18,14 12,18 6,14 6,10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 2" />
                      </svg>
                    )}
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-3 group-hover:text-[#65F4E8] transition-colors">
                  {service.title}
                </h3>

                <p className="font-body text-sm text-[#929BAA] leading-relaxed mb-8">
                  {service.description}
                </p>

                {/* Scope deliverables */}
                <div className="space-y-3 pt-6 border-t border-white/[0.06] mb-8">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#929BAA]/70 block">
                    Included Scope
                  </span>
                  {service.deliverables.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-xs text-[#F4F6FA]/90">
                      <Check className="w-3.5 h-3.5 text-[#65F4E8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-4 border-t border-white/[0.06]">
                <a
                  href="#contact"
                  onClick={() => onSelectService && onSelectService(service.title)}
                  className="w-full inline-flex items-center justify-between text-xs font-mono uppercase text-[#929BAA] group-hover:text-white transition-colors"
                >
                  <span>Inquire for {service.title}</span>
                  <ArrowRight className="w-4 h-4 text-[#63B3FF] group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
