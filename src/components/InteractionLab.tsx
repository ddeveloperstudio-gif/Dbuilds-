import React, { useState, useRef } from 'react';
import { Sliders, Upload, Sparkles, Check, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export const InteractionLab: React.FC = () => {
  // Slider position (0 = wireframe, 100 = final experience)
  const [sliderPos, setSliderPos] = useState<number>(55);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // AI Wireframe Analyzer State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Slider drag handling
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  // Image Upload Handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAnalysisError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setAnalysisResult(null);
      setAnalysisError(null);
    };
    reader.readAsDataURL(file);
  };

  // Run AI Audit
  const handleRunAudit = async () => {
    const imageToSend = uploadedImage || '/src/assets/images/project_beauty_trendz_1792579443841.jpg';
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await fetch('/api/analyze-wireframe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageToSend,
          mimeType: 'image/jpeg',
          notes: userNotes || 'Critique this website layout and provide DBuilds 2.0 modernization advice.',
          modelChoice: 'gemini-4-argon',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete design audit.');
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setAnalysisError(err?.message || 'Error communicating with design audit engine.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="lab" className="relative py-28 md:py-36 bg-[#05070C] text-[#F4F6FA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#63B3FF] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#63B3FF]" />
            <span>INTERACTION LAB / EXPERIMENT</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight text-white leading-tight text-balance mb-6">
            STRUCTURE BECOMES <br />
            <span className="bg-gradient-to-r from-[#63B3FF] via-[#65F4E8] to-white bg-clip-text text-transparent">
              EXPERIENCE.
            </span>
          </h2>
          <p className="font-body text-base text-[#929BAA] max-w-2xl leading-relaxed">
            Drag the comparison divider to see how raw wireframe geometry transforms into a finished, atmospheric digital experience with depth, controlled lighting, and refined typography.
          </p>
        </div>

        {/* 1. Interactive Comparison Split-Screen Container */}
        <div className="relative rounded-2xl bg-[#0A0E16] border border-white/10 p-4 sm:p-6 shadow-2xl mb-16">
          {/* Quick Preset Buttons */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#929BAA]">
              <Sliders className="w-3.5 h-3.5 text-[#63B3FF]" />
              <span>Interactive Scrubber</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSliderPos(15)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  sliderPos <= 20 ? 'bg-white/15 text-white' : 'text-[#929BAA] hover:text-white'
                }`}
              >
                Wireframe
              </button>
              <button
                type="button"
                onClick={() => setSliderPos(50)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  sliderPos > 20 && sliderPos < 80 ? 'bg-white/15 text-white' : 'text-[#929BAA] hover:text-white'
                }`}
              >
                Split 50/50
              </button>
              <button
                type="button"
                onClick={() => setSliderPos(85)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  sliderPos >= 80 ? 'bg-white/15 text-white' : 'text-[#929BAA] hover:text-white'
                }`}
              >
                Final Render
              </button>
            </div>
          </div>

          {/* Dual Layer Viewport */}
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full h-[360px] sm:h-[480px] lg:h-[540px] rounded-xl overflow-hidden cursor-ew-resize select-none border border-white/[0.08]"
          >
            {/* UNDER LAYER: Left Side (Wireframe Structural Blueprint) */}
            <div className="absolute inset-0 bg-[#070A10] flex flex-col p-6 sm:p-10 font-mono text-xs text-[#929BAA]/80">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-white/40 rounded" />
                  <span className="text-white/60 uppercase tracking-widest text-[11px]">WIRE_STRUCT // RAW</span>
                </div>
                <div className="flex gap-4 text-[10px] text-white/40">
                  <span>GRID: 12-COL</span>
                  <span>FLOW: LINEAR</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-5 flex flex-col justify-center space-y-4">
                  <div className="w-24 h-3 bg-white/10 rounded" />
                  <div className="w-full h-8 bg-white/15 rounded border border-dashed border-white/20" />
                  <div className="w-3/4 h-8 bg-white/10 rounded" />
                  <div className="space-y-2 pt-2">
                    <div className="w-full h-2 bg-white/10 rounded" />
                    <div className="w-5/6 h-2 bg-white/10 rounded" />
                    <div className="w-4/6 h-2 bg-white/10 rounded" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <div className="w-28 h-8 rounded border border-white/30 flex items-center justify-center text-[10px]">
                      BTN // PRIMARY
                    </div>
                    <div className="w-28 h-8 rounded border border-dashed border-white/20 flex items-center justify-center text-[10px]">
                      BTN // SECOND
                    </div>
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-7 rounded-lg border-2 border-dashed border-white/15 flex items-center justify-center relative p-6 bg-white/[0.01]">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded border border-white/20 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-white/30" />
                    </div>
                    <span className="block text-[11px] text-white/40">HERO_MEDIA_CANVAS // VIEWPORT</span>
                    <span className="text-[10px] text-white/20">ASPECT: 16:9 · LAYER: BG_0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* OVER LAYER: Right Side (Finished Polished Experience) clipped by sliderPos */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
              }}
            >
              <img
                src="/src/assets/images/project_digital_frontier_lab_1792579445534.jpg"
                alt="Finished dimensional digital interface"
                className="w-full h-full object-cover object-center filter brightness-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070C]/80 via-transparent to-transparent pointer-events-none" />

              {/* Polished Label overlay */}
              <div className="absolute top-6 right-6 px-3 py-1.5 rounded bg-[#05070C]/80 border border-[#65F4E8]/40 backdrop-blur-md text-xs font-mono text-[#65F4E8] flex items-center gap-1.5 shadow-lg">
                <Check className="w-3.5 h-3.5 text-[#65F4E8]" />
                <span>FINAL CINEMATIC RENDER</span>
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#63B3FF] via-[#65F4E8] to-[#63B3FF] z-30 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#05070C] border-2 border-[#65F4E8] shadow-[0_0_15px_rgba(101,244,232,0.6)] flex items-center justify-center text-white">
                <Sliders className="w-3.5 h-3.5 text-[#65F4E8]" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. AI Wireframe & Design Audit Tool */}
        <div className="rounded-2xl bg-[#0A0E16] border border-white/10 p-6 sm:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#65F4E8] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI WIREFRAME & DESIGN AUDIT ENGINE (GEMINI 4 ARGON · HIGH THINKING)</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                Submit a Wireframe or Mockup for Architectural Analysis
              </h3>
            </div>
            <div className="text-xs font-mono text-[#929BAA] max-w-xs">
              Upload a design snapshot, wireframe sketch, or website mockup for instant UX critique & DBuilds 2.0 modernization advice.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Upload & Options Column */}
            <div className="lg:col-span-5 space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-44 rounded-xl border-2 border-dashed border-white/20 hover:border-[#63B3FF] bg-[#101723]/50 hover:bg-[#101723] transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
              >
                {uploadedImage ? (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                    <img
                      src={uploadedImage}
                      alt="Uploaded wireframe for audit"
                      className="max-h-full max-w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-mono text-white">
                      Click to Replace Image
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[#63B3FF] mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono uppercase text-white tracking-wider block mb-1">
                      Upload Wireframe / Mockup
                    </span>
                    <span className="text-[11px] text-[#929BAA]">
                      PNG, JPG, or WebP. Or use our default studio reference.
                    </span>
                  </>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#929BAA] mb-2">
                  Optional Questions or Specific Goals
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. How can we improve conversion and mobile legibility?"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#101723] border border-white/10 text-xs text-white placeholder:text-[#929BAA]/50 focus:outline-none focus:border-[#63B3FF]"
                />
              </div>

              <button
                type="button"
                onClick={handleRunAudit}
                disabled={isAnalyzing}
                className="w-full py-3 px-4 text-xs font-mono uppercase font-semibold tracking-wider text-[#05070C] bg-[#65F4E8] hover:bg-[#65F4E8]/90 disabled:opacity-50 rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(101,244,232,0.3)]"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Architectural Structure...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Gemini Design Audit</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 min-h-[260px] rounded-xl bg-[#101723]/60 border border-white/10 p-6 flex flex-col justify-between">
              {analysisError && (
                <div className="p-4 rounded bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{analysisError}</span>
                </div>
              )}

              {analysisResult ? (
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-mono text-[#65F4E8] uppercase tracking-wider">
                      Audit Report // DBuilds 2.0 Studio
                    </span>
                    <span className="text-[10px] font-mono text-[#929BAA]">
                      MODEL: GEMINI 4 ARGON (THINKING: HIGH)
                    </span>
                  </div>
                  <div className="text-xs text-[#F4F6FA]/90 whitespace-pre-line leading-relaxed font-mono">
                    {analysisResult}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#929BAA]">
                  <Sparkles className="w-8 h-8 text-white/20 mb-3" />
                  <span className="text-sm font-display font-medium text-white mb-1">
                    Ready for Architectural Analysis
                  </span>
                  <p className="text-xs max-w-sm">
                    Upload your wireframe or test with our sample mockup to receive an automated audit on layout hierarchy, responsive resilience, and DBuilds 2.0 visual upgrades.
                  </p>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#929BAA]/60">
                <span>VERIFIED DESIGN PRINCIPLES</span>
                <span>DBUILDS 2.0 ENGINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
