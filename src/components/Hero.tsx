import React, { useEffect, useRef, useState } from 'react';
import { BrandSymbol } from './BrandSymbol';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SITE_METADATA } from '../content';

interface HeroProps {
  prefersReducedMotion?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ prefersReducedMotion }) => {
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parallax scroll listener
  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  // Fine ambient drifting particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 45 subtle particles
    const particleCount = prefersReducedMotion ? 15 : 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.4 - 0.1,
      opacity: Math.random() * 0.6 + 0.2,
      cyan: Math.random() > 0.6,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.cyan
          ? `rgba(101, 244, 232, ${p.opacity * 0.6})`
          : `rgba(99, 179, 255, ${p.opacity * 0.5})`;
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  const scrollToSection = (id: string) => {
    const elem = document.querySelector(id);
    if (elem) {
      const topOffset = 80;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const bgTranslate = prefersReducedMotion ? 0 : scrollY * 0.3;
  const contentTranslate = prefersReducedMotion ? 0 : scrollY * 0.15;
  const contentOpacity = prefersReducedMotion ? 1 : Math.max(0, 1 - scrollY / 700);

  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#05070C] pt-20 pb-16">
      {/* Background Image: Deep Space Digital Sphere with Parallax */}
      <div
        className="absolute inset-0 z-0 pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(0, ${bgTranslate}px, 0)`,
        }}
      >
        <img
          src="/src/assets/images/hero_digital_frontier_1792579443343.jpg"
          alt="Digital Frontier Sphere horizon"
          className="w-full h-full object-cover object-center opacity-40 scale-105 filter brightness-90 contrast-110"
          loading="eager"
          referrerPolicy="no-referrer"
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070C] via-[#05070C]/60 to-[#05070C]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070C] via-transparent to-[#05070C]" />
      </div>

      {/* Atmospheric Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Electric Blue Beam of Light revealing the center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#63B3FF]/15 via-[#65F4E8]/5 to-transparent blur-3xl pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Fine technical coordinate lines & labels */}
      <div className="absolute top-28 left-6 sm:left-12 z-20 hidden sm:flex flex-col text-[10px] font-mono text-[#929BAA]/60 tracking-wider">
        <span>LOC // DIGITAL FRONTIER</span>
        <span>LAT: 28.6139° N · LON: 77.2090° E</span>
      </div>

      <div className="absolute top-28 right-6 sm:right-12 z-20 hidden sm:flex flex-col items-end text-[10px] font-mono text-[#929BAA]/60 tracking-wider">
        <span>STATUS // DEPLOYED ONLINE</span>
        <span>SYS // BUILDBYD.COM · 2026</span>
      </div>

      {/* Foreground Content */}
      <div
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center will-change-transform"
        style={{
          transform: `translate3d(0, ${contentTranslate}px, 0)`,
          opacity: contentOpacity,
        }}
      >
        {/* Floating Brand Symbol */}
        <div className="mb-6 animate-subtle-float">
          <div className="p-3 rounded-2xl bg-[#101723]/80 border border-white/10 shadow-[0_0_30px_rgba(99,179,255,0.2)] backdrop-blur-md">
            <BrandSymbol size={44} glow />
          </div>
        </div>

        {/* Technical Label */}
        <div className="mb-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#65F4E8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#65F4E8]" />
          <span>{SITE_METADATA.heroLabel}</span>
        </div>

        {/* Oversized Headline */}
        <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] text-[#F4F6FA] mb-6 max-w-4xl text-balance">
          <span className="block text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            {SITE_METADATA.heroHeadline1}
          </span>
          <span className="block bg-gradient-to-r from-[#63B3FF] via-[#65F4E8] to-[#F4F6FA] bg-clip-text text-transparent">
            {SITE_METADATA.heroHeadline2}
          </span>
        </h1>

        {/* Supporting copy */}
        <p className="font-body text-base sm:text-lg md:text-xl text-[#929BAA] max-w-2xl mb-10 leading-relaxed font-normal">
          {SITE_METADATA.heroDescription}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => scrollToSection('#work')}
            className="w-full sm:w-auto px-7 py-3.5 text-xs font-mono uppercase font-semibold tracking-wider text-[#05070C] bg-[#F4F6FA] hover:bg-white rounded hover:shadow-[0_0_25px_rgba(99,179,255,0.45)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63B3FF]"
          >
            <span>Explore My Work</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('#contact')}
            className="w-full sm:w-auto px-7 py-3.5 text-xs font-mono uppercase font-semibold tracking-wider text-[#F4F6FA] bg-[#101723]/90 hover:bg-[#192438] border border-white/10 hover:border-[#63B3FF]/40 rounded transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#65F4E8]"
          >
            <span>Let's Build Together</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#65F4E8]" />
          </button>
        </div>
      </div>

      {/* Gentle Looping Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-center pointer-events-auto">
        <button
          type="button"
          onClick={() => scrollToSection('#intro')}
          className="group flex flex-col items-center gap-1.5 text-[11px] font-mono text-[#929BAA] hover:text-[#65F4E8] transition-colors focus:outline-none"
          aria-label="Scroll to introduction"
        >
          <span className="tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1 group-hover:border-[#63B3FF] transition-colors">
            <div className="w-1 h-2 rounded-full bg-[#65F4E8] animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
