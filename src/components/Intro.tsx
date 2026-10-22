import React from 'react';
import { CORE_PRINCIPLES, SITE_METADATA } from '../content';

export const Intro: React.FC = () => {
  return (
    <section
      id="intro"
      className="relative z-20 py-28 md:py-36 bg-[#0A0E16] text-[#F4F6FA] border-t border-white/[0.04] overflow-hidden"
    >
      {/* Subtle Luminous Horizontal Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#63B3FF]/40 to-transparent"
        aria-hidden="true"
      />

      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#63B3FF]/5 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#65F4E8] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#65F4E8]" />
            <span>01 // PHILOSOPHY</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] text-white mb-6 text-balance">
            <span className="block text-white/90">{SITE_METADATA.introHeadline1}</span>
            <span className="block bg-gradient-to-r from-[#63B3FF] to-[#65F4E8] bg-clip-text text-transparent">
              {SITE_METADATA.introHeadline2}
            </span>
          </h2>

          <p className="font-body text-base sm:text-xl text-[#929BAA] leading-relaxed max-w-2xl font-light">
            {SITE_METADATA.introDescription}
          </p>
        </div>

        {/* Three Compact Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-6 border-t border-white/[0.08]">
          {CORE_PRINCIPLES.map((principle) => (
            <div
              key={principle.num}
              className="group p-6 sm:p-8 rounded-xl bg-[#101723]/40 hover:bg-[#101723]/80 border border-white/[0.06] hover:border-[#63B3FF]/30 transition-all duration-300 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-sm tracking-wider text-[#65F4E8]">
                    {principle.num}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-[#63B3FF] transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-lg sm:text-xl text-white mb-3 group-hover:text-[#65F4E8] transition-colors">
                  {principle.title}
                </h3>
                <p className="font-body text-sm text-[#929BAA] leading-relaxed">
                  {principle.desc}
                </p>
              </div>

              {/* Bottom decorative hairline */}
              <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono text-[#929BAA]/50 group-hover:text-[#929BAA] transition-colors">
                <span>STANDARD</span>
                <span className="text-[#63B3FF] opacity-0 group-hover:opacity-100 transition-opacity">
                  VERIFIED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
