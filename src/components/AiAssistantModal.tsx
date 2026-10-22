import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { BrandSymbol } from './BrandSymbol';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Welcome to the DBuilds 2.0 Studio. I'm your digital design consultant representing Dhanush.
      
How can I assist your business today? I can help scope your website project, recommend tech stacks, explain our 4-stage build method, or explore creative directions.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelChoice, setModelChoice] = useState<'gemini-3.8-flash' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [enableThinking, setEnableThinking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: promptText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          modelChoice,
          enableThinking,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reach AI Studio engine.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: data.text }]);
    } catch (err: any) {
      setError(err?.message || 'Error communicating with assistant.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I ran into a temporary connection issue. You can also contact Dhanush directly via Instagram @dbuilds.2.0 or submit a project enquiry below.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterPrompts = [
    'What website structure works best for a local service business?',
    'How do the 4 project stages (Discover to Launch) work?',
    'What are the advantages of AI-assisted web development?',
    'I want to commission a modern business website. How do we start?',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-title"
    >
      <div className="relative w-full max-w-2xl h-[640px] max-h-[92vh] bg-[#0A0E16] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#101723] border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <BrandSymbol size={26} glow />
            <div>
              <h3 id="assistant-title" className="font-display font-semibold text-sm sm:text-base text-white">
                DBUILDS Studio AI Consultant
              </h3>
              <span className="text-[10px] font-mono text-[#65F4E8] block">
                REPRESENTING DHANUSH · BUILD BY D
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Model Selector */}
            <select
              value={modelChoice}
              onChange={(e) => setModelChoice(e.target.value as any)}
              className="hidden sm:block text-[11px] font-mono bg-[#05070C] border border-white/15 text-[#929BAA] rounded px-2 py-1 focus:outline-none focus:border-[#63B3FF]"
              aria-label="Select Gemini model"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Standard)</option>
              <option value="gemini-4-argon">gemini-4-argon (Thinking)</option>
            </select>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#929BAA] hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thinking & Status bar */}
        <div className="px-5 py-2 bg-[#05070C] border-b border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-[#929BAA]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#65F4E8]" />
            <span>MODEL: {modelChoice}</span>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={enableThinking}
              onChange={(e) => setEnableThinking(e.target.checked)}
              className="rounded bg-[#101723] border-white/20 text-[#63B3FF] focus:ring-0"
            />
            <span>High Thinking Mode</span>
          </label>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-mono ${
                  m.role === 'user'
                    ? 'bg-[#63B3FF] text-[#05070C]'
                    : 'bg-[#101723] border border-white/10 text-[#65F4E8]'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#63B3FF]/20 border border-[#63B3FF]/40 text-white font-body'
                    : 'bg-[#101723]/90 border border-white/[0.08] text-[#F4F6FA] font-body'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#101723] border border-white/10 text-[#65F4E8] flex items-center justify-center shrink-0">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="rounded-xl px-4 py-3 bg-[#101723]/70 border border-white/[0.08] text-xs font-mono text-[#929BAA] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#65F4E8] animate-pulse" />
                <span>Formulating studio response...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompts */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-[#05070C]/90 border-t border-white/[0.04] flex gap-2 overflow-x-auto text-[11px] font-mono scrollbar-none">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded bg-[#101723] hover:bg-[#192438] text-[#929BAA] hover:text-white border border-white/10 transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#101723] border-t border-white/[0.08]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about website scope, stack, or custom features..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#05070C] border border-white/10 text-xs sm:text-sm text-white placeholder:text-[#929BAA]/50 focus:outline-none focus:border-[#63B3FF]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-lg bg-[#63B3FF] hover:bg-white text-[#05070C] disabled:opacity-40 transition-colors focus:outline-none"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
