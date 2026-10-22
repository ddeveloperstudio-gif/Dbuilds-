import React, { useState } from 'react';
import { PROJECTS, ProjectItem } from '../content';
import { ArrowUpRight, X, Layers, CheckCircle2, Eye } from 'lucide-react';

interface ProjectsProps {
  prefersReducedMotion?: boolean;
}

export const Projects: React.FC<ProjectsProps> = ({ prefersReducedMotion }) => {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  return (
    <section id="work" className="relative py-28 md:py-36 bg-[#05070C] text-[#F4F6FA] overflow-hidden">
      {/* Background architectural grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#63B3FF] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#63B3FF]" />
              <span>SELECTED PROJECTS / 001—003</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight text-white leading-tight text-balance">
              DESIGNED TO <br />
              <span className="bg-gradient-to-r from-[#63B3FF] via-[#65F4E8] to-white bg-clip-text text-transparent">
                MAKE AN IMPACT.
              </span>
            </h2>
          </div>

          <p className="font-body text-sm sm:text-base text-[#929BAA] max-w-md leading-relaxed">
            Curated website concepts demonstrating bespoke typography, responsive e-commerce architecture, and cinematic dimensional interactions.
          </p>
        </div>

        {/* Project Cards List */}
        <div className="space-y-16 lg:space-y-24">
          {PROJECTS.map((project, idx) => (
            <article
              key={project.id}
              className={`group relative rounded-2xl bg-[#0A0E16] border border-white/[0.08] hover:border-[#63B3FF]/40 transition-all duration-300 overflow-hidden ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              } flex flex-col lg:flex-row items-stretch`}
            >
              {/* Media Container with perspective reflection */}
              <div className="lg:w-7/12 relative overflow-hidden bg-[#101723] min-h-[280px] sm:min-h-[380px] lg:min-h-[460px] flex items-center justify-center p-4 sm:p-8">
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:shadow-[0_20px_60px_rgba(99,179,255,0.2)] transition-shadow duration-300">
                  <img
                    src={project.image}
                    alt={`${project.title} - ${project.category} mockup preview`}
                    className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                      prefersReducedMotion ? '' : 'group-hover:scale-[1.03]'
                    }`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle Light Reflection overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Quick Expand Button on Image */}
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    className="absolute bottom-4 right-4 z-20 px-3.5 py-1.5 text-xs font-mono uppercase bg-[#05070C]/85 hover:bg-[#05070C] text-white border border-white/20 rounded backdrop-blur-md flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-all"
                    aria-label={`View ${project.title} details`}
                  >
                    <Eye className="w-3.5 h-3.5 text-[#65F4E8]" />
                    <span>Expand Concept</span>
                  </button>
                </div>
              </div>

              {/* Text & Metadata Container */}
              <div className="lg:w-5/12 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  {/* Category & Concept Indicator */}
                  <div className="flex items-center justify-between text-xs font-mono text-[#929BAA] mb-4">
                    <span className="text-[#65F4E8] tracking-wider">
                      PROJECT // {project.number}
                    </span>
                    <span className="text-[#929BAA]/70">
                      {project.isConcept ? 'PORTFOLIO CONCEPT' : 'CLIENT BUILD'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2 group-hover:text-[#63B3FF] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs font-mono uppercase tracking-wider text-[#929BAA] mb-4">
                    {project.category}
                  </p>

                  <p className="font-body text-sm sm:text-base text-[#929BAA] leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Deliverables unboxed with separators */}
                  <div className="mb-6 pt-4 border-t border-white/[0.06]">
                    <div className="text-[11px] font-mono uppercase text-[#929BAA]/70 mb-2 tracking-wider">
                      Core Architecture
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#F4F6FA]/80">
                      {project.deliverables.map((item, i) => (
                        <React.Fragment key={item}>
                          {i > 0 && <span className="text-white/20">·</span>}
                          <span>{item}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono text-[#929BAA] bg-[#101723] px-2.5 py-1 rounded border border-white/[0.06]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card CTA Action */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase font-semibold text-[#F4F6FA] hover:text-[#65F4E8] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#63B3FF]"
                  >
                    <span>View Project Blueprint</span>
                    <ArrowUpRight className="w-4 h-4 text-[#63B3FF]" />
                  </button>

                  <span className="text-xs font-mono text-[#929BAA]/40">
                    STATUS: READY
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Project Lightbox & Blueprint Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A0E16] border border-white/10 rounded-2xl shadow-2xl overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0A0E16]/95 border-b border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#65F4E8]">
                  PROJECT // {activeProject.number}
                </span>
                <span className="text-white/20">|</span>
                <h3 id="modal-title" className="font-display font-semibold text-lg text-white">
                  {activeProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="p-1.5 text-[#929BAA] hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63B3FF]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* High-res Mockup */}
              <div className="rounded-xl overflow-hidden border border-white/10 bg-[#101723] shadow-lg">
                <img
                  src={activeProject.image}
                  alt={`${activeProject.title} full mockup`}
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Concept Note */}
              <div className="p-4 rounded-lg bg-[#101723]/60 border border-white/[0.06] flex items-start gap-3">
                <Layers className="w-5 h-5 text-[#63B3FF] shrink-0 mt-0.5" />
                <div className="text-xs font-mono text-[#929BAA] leading-relaxed">
                  <strong className="text-white block mb-1">Concept Architecture Notice:</strong>
                  This design is an original portfolio concept created by DBuilds 2.0 to demonstrate specific aesthetic, responsive, and conversion capabilities for the {activeProject.category} domain.
                </div>
              </div>

              {/* Objectives & Deliverables Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-display font-semibold text-sm uppercase text-[#65F4E8] tracking-wider mb-3">
                    Design Objective
                  </h4>
                  <p className="font-body text-sm text-[#929BAA] leading-relaxed">
                    {activeProject.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-display font-semibold text-sm uppercase text-[#63B3FF] tracking-wider mb-3">
                    Deliverables Blueprint
                  </h4>
                  <ul className="space-y-2">
                    {activeProject.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs font-mono text-[#F4F6FA]/80">
                        <CheckCircle2 className="w-4 h-4 text-[#65F4E8] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA within modal */}
              <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono text-[#929BAA]">
                  Want a tailored website like this for your brand?
                </div>
                <a
                  href="#contact"
                  onClick={() => setActiveProject(null)}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-mono font-semibold uppercase text-[#05070C] bg-[#F4F6FA] hover:bg-white rounded transition-colors text-center"
                >
                  Commission a Build
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
