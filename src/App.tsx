import { useState, useEffect } from 'react';
import { useReducedMotion } from './hooks/useReducedMotion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { About } from './components/About';
import { Process } from './components/Process';
import { InteractionLab } from './components/InteractionLab';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [currentView, setCurrentView] = useState<'portfolio' | 'admin'>(() => {
    return window.location.pathname.startsWith('/admin') ? 'admin' : 'portfolio';
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string>('Business Website');

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(window.location.pathname.startsWith('/admin') ? 'admin' : 'portfolio');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentView(path.startsWith('/admin') ? 'admin' : 'portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (serviceTitle: string) => {
    setSelectedServiceForContact(serviceTitle);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If viewing private admin dashboard
  if (currentView === 'admin') {
    return <AdminDashboard onBackToPortfolio={() => navigateTo('/')} />;
  }

  return (
    <div className="min-h-screen bg-[#05070C] text-[#F4F6FA] font-body selection:bg-[#63B3FF]/30 selection:text-[#65F4E8] relative">
      {/* Global Navigation */}
      <Header
        onOpenAiConsultant={() => setIsAiModalOpen(true)}
        onOpenAdmin={() => navigateTo('/admin')}
      />

      {/* Main Experience Stream */}
      <main id="main-content">
        {/* 01. Cinematic Hero */}
        <Hero prefersReducedMotion={prefersReducedMotion} />

        {/* 02. Scroll-Driven Brand Reveal & Philosophy */}
        <Intro />

        {/* 03. Selected Work Gallery */}
        <Projects prefersReducedMotion={prefersReducedMotion} />

        {/* 04. Capabilities & Services */}
        <Services onSelectService={handleSelectService} />

        {/* 05. The Creator - Dhanush */}
        <About />

        {/* 06. The Method - 4 Stage Process */}
        <Process />

        {/* 07. The Interaction Lab - Wireframe vs Render & AI Audit */}
        <InteractionLab />

        {/* 08. Client Conversion - Start a Project */}
        <Contact initialProjectType={selectedServiceForContact} />
      </main>

      {/* Cinematic Footer */}
      <Footer onOpenAdmin={() => navigateTo('/admin')} />

      {/* Discrete Floating Studio AI Launch Button */}
      <button
        type="button"
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-3.5 py-2.5 rounded-full bg-[#101723]/90 hover:bg-[#192438] text-white border border-[#63B3FF]/40 hover:border-[#65F4E8] shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-200 flex items-center gap-2 text-xs font-mono group cursor-pointer"
        aria-label="Open Studio AI Assistant"
      >
        <div className="w-2 h-2 rounded-full bg-[#65F4E8] animate-pulse" />
        <Bot className="w-4 h-4 text-[#63B3FF] group-hover:text-[#65F4E8] transition-colors" />
        <span className="hidden sm:inline text-white/90">Studio AI</span>
        <Sparkles className="w-3 h-3 text-[#65F4E8]" />
      </button>

      {/* Multi-turn Gemini Studio AI Consultant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
