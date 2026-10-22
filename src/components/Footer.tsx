import React from 'react';
import { BrandSymbol } from './BrandSymbol';
import { SITE_METADATA } from '../content';
import { ArrowUp, Instagram, Mail } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Interaction Lab', href: '#lab' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative bg-[#05070C] text-[#F4F6FA] border-t border-white/[0.06] pt-20 pb-12 overflow-hidden">
      {/* Background glow and subtle orbital horizon */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-gradient-to-t from-[#63B3FF]/5 via-transparent to-transparent pointer-events-none blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/[0.06]">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <BrandSymbol size={32} glow />
              <span className="font-display font-bold tracking-tight text-xl text-white">
                DBUILDS <span className="text-[#63B3FF] font-mono text-sm">2.0</span>
              </span>
            </div>

            <p className="font-display text-lg sm:text-xl text-white/90 max-w-sm font-medium">
              “Building ideas into digital reality.”
            </p>

            <p className="font-body text-xs text-[#929BAA] max-w-sm leading-relaxed">
              Independent digital creator studio led by Dhanush. Specializing in modern business websites, AI-assisted development, and cinematic digital experiences.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#929BAA]">
              <span>DOMAIN // {SITE_METADATA.domain}</span>
              <span>·</span>
              <span>CREATOR // {SITE_METADATA.creator}</span>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#65F4E8] block mb-2">
              Navigation Index
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#929BAA]">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-white transition-colors py-1 focus:outline-none focus-visible:text-[#63B3FF]"
                >
                  {link.label}
                </a>
              ))}
              {onOpenAdmin ? (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="text-left text-[#63B3FF] hover:text-[#65F4E8] transition-colors py-1 focus:outline-none flex items-center gap-1"
                >
                  <span>Admin CRM</span>
                </button>
              ) : (
                <a
                  href="/admin"
                  className="text-[#63B3FF] hover:text-[#65F4E8] transition-colors py-1 focus:outline-none"
                >
                  Admin CRM
                </a>
              )}
            </div>
          </div>

          {/* Connect Column */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#63B3FF] block mb-2">
              Connect
            </span>
            <div className="space-y-2 text-xs font-mono">
              <a
                href={SITE_METADATA.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#929BAA] hover:text-white transition-colors py-1"
              >
                <Instagram className="w-4 h-4 text-[#65F4E8]" />
                <span>Instagram // {SITE_METADATA.instagram}</span>
              </a>

              <a
                href={`mailto:${SITE_METADATA.email}`}
                className="flex items-center gap-2 text-[#929BAA] hover:text-white transition-colors py-1"
              >
                <Mail className="w-4 h-4 text-[#63B3FF]" />
                <span>Email // Inquire</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#929BAA]/60">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} DBUILDS 2.0. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex items-center gap-4">
            <span>THE DIGITAL FRONTIER</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-[#929BAA] hover:text-white transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
