import React from 'react';
import { ABOUT_CREATOR, SITE_METADATA } from '../content';
import { Compass, Users, Sparkles, ArrowUpRight } from 'lucide-react';

export const About: React.FC = () => {
  const principleIcons = [
    <Compass className="w-5 h-5 text-[#63B3FF]" key="compass" />,
    <Users className="w-5 h-5 text-[#65F4E8]" key="users" />,
    <Sparkles className="w-5 h-5 text-[#63B3FF]" key="sparkles" />,
  ];

  return (
    <section id="about" className="relative py-28 md:py-36 bg-[#05070C] text-[#F4F6FA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#101723] shadow-2xl">
              <img
                src={ABOUT_CREATOR.image}
                alt="Dhanush - Creative Developer workspace visual"
                className="w-full h-[460px] sm:h-[520px] object-cover object-center filter contrast-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070C] via-transparent to-transparent opacity-80" />

              {/* Lower Badge Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0A0E16]/90 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-[#65F4E8] block uppercase">
                      Creator Identity
                    </span>
                    <span className="font-display font-bold text-white text-base">
                      {SITE_METADATA.creator}
                    </span>
                  </div>
                  <a
                    href={SITE_METADATA.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#929BAA] hover:text-white transition-colors"
                  >
                    <span>{SITE_METADATA.instagram}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#63B3FF]" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copy Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#63B3FF] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#63B3FF]" />
              <span>{ABOUT_CREATOR.sectionLabel}</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight text-white leading-tight mb-6 text-balance">
              CURIOUS BY NATURE. <br />
              <span className="bg-gradient-to-r from-[#63B3FF] via-[#65F4E8] to-white bg-clip-text text-transparent">
                PRECISE BY DESIGN.
              </span>
            </h2>

            <p className="font-body text-base sm:text-lg text-[#929BAA] leading-relaxed mb-10 font-normal">
              {ABOUT_CREATOR.bio}
            </p>

            {/* Three Concise Working Principles */}
            <div className="space-y-6 pt-4 border-t border-white/[0.08]">
              {ABOUT_CREATOR.principles.map((p, i) => (
                <div
                  key={p.title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[#0A0E16]/60 border border-white/[0.04] hover:border-white/10 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-[#101723] shrink-0 mt-0.5">
                    {principleIcons[i]}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-base text-white mb-1">
                      {p.title}
                    </h3>
                    <p className="font-body text-sm text-[#929BAA] leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono text-[#929BAA]">
              <span>DOMAIN // {SITE_METADATA.domain}</span>
              <span>·</span>
              <span>DEV ENVIRONMENT // ASIA-SOUTHEAST1</span>
              <span>·</span>
              <span>STATUS // OPEN FOR COMMISSIONS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
