import React from 'react';
import { PROCESS_STEPS } from '../content';
import { Check } from 'lucide-react';

export const Process: React.FC = () => {
  return (
    <section id="process" className="relative py-28 md:py-36 bg-[#0A0E16] text-[#F4F6FA] border-t border-white/[0.04] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#65F4E8] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#65F4E8]" />
            <span>THE METHOD / 004</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight text-white leading-tight text-balance mb-6">
            A CLEAR PROCESS. <br />
            <span className="bg-gradient-to-r from-[#63B3FF] via-[#65F4E8] to-white bg-clip-text text-transparent">
              A BETTER OUTCOME.
            </span>
          </h2>
          <p className="font-body text-base text-[#929BAA] max-w-2xl leading-relaxed">
            Every build follows a disciplined four-stage pipeline to ensure transparent collaboration, rapid execution, and zero surprises on launch day.
          </p>
        </div>

        {/* 4 Connected Steps with Animated Orbital Line */}
        <div className="relative">
          {/* Desktop Connecting Horizontal Line */}
          <div
            className="hidden lg:block absolute top-12 left-12 right-12 h-[2px] bg-gradient-to-r from-[#63B3FF] via-[#65F4E8] to-[#63B3FF]/30 z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="group relative p-6 sm:p-8 rounded-2xl bg-[#101723]/60 hover:bg-[#101723] border border-white/[0.08] hover:border-[#63B3FF]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step Node Circle */}
                  <div className="w-10 h-10 rounded-full bg-[#05070C] border-2 border-[#63B3FF] flex items-center justify-center font-mono text-xs font-bold text-white mb-6 group-hover:scale-110 group-hover:border-[#65F4E8] group-hover:shadow-[0_0_15px_rgba(101,244,232,0.4)] transition-all">
                    {step.step}
                  </div>

                  <span className="text-[11px] font-mono uppercase text-[#65F4E8] tracking-widest block mb-2">
                    {step.duration}
                  </span>

                  <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-[#63B3FF] transition-colors">
                    {step.title}
                  </h3>

                  <p className="font-body text-sm text-[#929BAA] leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#929BAA]/60 block mb-1">
                    Deliverables
                  </span>
                  {step.deliverables.map((d) => (
                    <div key={d} className="flex items-center gap-2 text-xs text-[#F4F6FA]/80">
                      <Check className="w-3 h-3 text-[#65F4E8] shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
