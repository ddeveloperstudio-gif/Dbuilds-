import React, { useState, useEffect } from 'react';
import { BrandSymbol } from './BrandSymbol';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenAiConsultant?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAiConsultant, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Lab', href: '#lab' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0E16]/85 backdrop-blur-md border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63B3FF] rounded-lg p-1 shrink-0"
            aria-label="DBUILDS 2.0 Home"
          >
            <BrandSymbol size={28} />
            <span className="font-display font-bold tracking-tight text-lg text-[#F4F6FA] group-hover:text-white transition-colors whitespace-nowrap">
              DBUILDS <span className="text-[#63B3FF] font-mono text-sm tracking-normal">2.0</span>
            </span>
          </a>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#929BAA]"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="hover:text-[#F4F6FA] transition-colors whitespace-nowrap relative py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#63B3FF] rounded"
              >
                {link.label}
              </a>
            ))}

            {onOpenAiConsultant && (
              <button
                type="button"
                onClick={onOpenAiConsultant}
                className="text-xs font-mono text-[#65F4E8] hover:text-white border border-[#65F4E8]/30 hover:border-[#65F4E8] px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                title="Launch DBuilds Studio AI Consultant"
              >
                Studio AI
              </button>
            )}
          </nav>

          {/* Zone 3: Primary CTA & Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wide uppercase font-mono text-[#05070C] bg-[#F4F6FA] hover:bg-white rounded hover:shadow-[0_0_20px_rgba(99,179,255,0.4)] transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63B3FF]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#929BAA] hover:text-[#F4F6FA] rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63B3FF]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0E16]/98 border-b border-white/[0.08] backdrop-blur-xl px-4 pt-4 pb-6 mt-3 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-base font-medium text-[#929BAA] hover:text-[#F4F6FA] px-2 py-2 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}

            {onOpenAiConsultant && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAiConsultant();
                }}
                className="text-left text-sm font-mono text-[#65F4E8] px-2 py-2 flex items-center justify-between"
              >
                <span>Launch Studio AI Consultant</span>
                <span className="text-xs text-[#929BAA]">Interactive</span>
              </button>
            )}

            <div className="pt-2 border-t border-white/[0.08]">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#contact');
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide uppercase font-mono text-[#05070C] bg-[#F4F6FA] rounded hover:bg-white transition-colors"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
