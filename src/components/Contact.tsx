import React, { useState } from 'react';
import { SITE_METADATA } from '../content';
import { Send, CheckCircle2, AlertCircle, Mail, Instagram, ArrowUpRight, RefreshCw } from 'lucide-react';

interface ContactProps {
  initialProjectType?: string;
}

export const Contact: React.FC<ContactProps> = ({ initialProjectType = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    email: '',
    projectType: initialProjectType || 'Business Website',
    budget: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ inquiryId: string; message: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please tell us briefly what you want to build.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed. Please try again.');
      }

      setSubmittedData({
        inquiryId: data.inquiryId,
        message: data.message,
      });
    } catch (err: any) {
      setSubmitError(err?.message || 'Transmission error. Please use direct email below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoUrl = `mailto:${SITE_METADATA.email}?subject=${encodeURIComponent(
    `Project Inquiry: ${formData.projectType || 'Modern Website'} - ${formData.brand || formData.name || 'DBuilds 2.0'}`
  )}&body=${encodeURIComponent(
    `Hi Dhanush,\n\nI'm reaching out from buildbyd.com.\n\nName: ${formData.name}\nBrand: ${formData.brand}\nProject Type: ${formData.projectType}\nBudget: ${formData.budget || 'To discuss'}\n\nProject Brief:\n${formData.description}`
  )}`;

  return (
    <section id="contact" className="relative py-28 md:py-36 bg-[#0A0E16] text-[#F4F6FA] border-t border-white/[0.04] overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute bottom-0 right-1/4 w-[600px] h-[350px] bg-[#63B3FF]/5 blur-[140px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Context & Alternative Channels */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#65F4E8] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#65F4E8]" />
              <span>NEXT TRANSMISSION / 005</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight text-white leading-tight text-balance mb-6">
              HAVE AN IDEA? <br />
              <span className="bg-gradient-to-r from-[#63B3FF] via-[#65F4E8] to-white bg-clip-text text-transparent">
                LET'S BUILD IT.
              </span>
            </h2>

            <p className="font-body text-base text-[#929BAA] leading-relaxed mb-10">
              Tell me a little about your business and what you want to create. Let's explore the right digital solution for your goals.
            </p>

            {/* Direct Contact Links */}
            <div className="space-y-4 pt-6 border-t border-white/[0.08]">
              <a
                href={SITE_METADATA.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-[#101723]/60 hover:bg-[#101723] border border-white/[0.06] hover:border-[#63B3FF]/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#05070C] text-[#65F4E8]">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[#929BAA] block uppercase">Instagram Direct</span>
                    <span className="font-display font-semibold text-white group-hover:text-[#65F4E8] transition-colors">
                      {SITE_METADATA.instagram}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#929BAA] group-hover:text-white transition-colors" />
              </a>

              <a
                href={`mailto:${SITE_METADATA.email}`}
                className="flex items-center justify-between p-4 rounded-xl bg-[#101723]/60 hover:bg-[#101723] border border-white/[0.06] hover:border-[#63B3FF]/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#05070C] text-[#63B3FF]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[#929BAA] block uppercase">Direct Email</span>
                    <span className="font-mono text-xs sm:text-sm text-white group-hover:text-[#63B3FF] transition-colors break-all">
                      {SITE_METADATA.email}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#929BAA] group-hover:text-white transition-colors" />
              </a>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-[#05070C] border border-white/[0.04] text-xs font-mono text-[#929BAA] leading-relaxed">
              <span className="text-[#65F4E8] block mb-1">RESPONSE COMMITMENT:</span>
              Dhanush personally reviews every inquiry within 24 business hours to evaluate timeline, technical feasibility, and design alignment.
            </div>
          </div>

          {/* Right Column: Clean Project Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-2xl bg-[#101723] border border-white/[0.08] shadow-2xl">
              {submittedData ? (
                <div className="py-8 text-center space-y-6 animate-fadeIn">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#65F4E8]/20 border border-[#65F4E8] flex items-center justify-center text-[#65F4E8]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-xs font-mono text-[#65F4E8] tracking-widest block uppercase mb-1">
                      TRANSMISSION CONFIRMED
                    </span>
                    <h3 className="font-display font-bold text-2xl text-white mb-2">
                      Inquiry Received
                    </h3>
                    <p className="font-mono text-xs text-[#929BAA] mb-4">
                      REFERENCE // {submittedData.inquiryId}
                    </p>
                    <p className="font-body text-sm text-[#929BAA] max-w-md mx-auto leading-relaxed">
                      {submittedData.message}
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={mailtoUrl}
                      className="px-5 py-2.5 rounded text-xs font-mono uppercase bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      Open Email Backup
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedData(null);
                        setFormData({
                          name: '',
                          brand: '',
                          email: '',
                          projectType: 'Business Website',
                          budget: '',
                          description: '',
                        });
                      }}
                      className="px-5 py-2.5 rounded text-xs font-mono uppercase text-[#929BAA] hover:text-white transition-colors"
                    >
                      Send Another Transmission
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {submitError && (
                    <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span>{submitError}</span>
                        <a href={mailtoUrl} className="block mt-1 underline text-white font-mono">
                          Click here to send directly via email instead
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-mono uppercase text-[#929BAA] mb-2">
                        Your Name <span className="text-[#65F4E8]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Vance"
                        className={`w-full px-4 py-3 rounded-lg bg-[#05070C] border ${
                          errors.name ? 'border-red-500' : 'border-white/10'
                        } text-sm text-white placeholder:text-[#929BAA]/40 focus:outline-none focus:border-[#63B3FF] transition-colors`}
                      />
                      {errors.name && <span className="text-[11px] text-red-400 mt-1 block">{errors.name}</span>}
                    </div>

                    {/* Business/Brand Name */}
                    <div>
                      <label htmlFor="contact-brand" className="block text-xs font-mono uppercase text-[#929BAA] mb-2">
                        Business or Brand Name
                      </label>
                      <input
                        id="contact-brand"
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        placeholder="e.g. Vance Studio"
                        className="w-full px-4 py-3 rounded-lg bg-[#05070C] border border-white/10 text-sm text-white placeholder:text-[#929BAA]/40 focus:outline-none focus:border-[#63B3FF] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-mono uppercase text-[#929BAA] mb-2">
                        Email Address <span className="text-[#65F4E8]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@domain.com"
                        className={`w-full px-4 py-3 rounded-lg bg-[#05070C] border ${
                          errors.email ? 'border-red-500' : 'border-white/10'
                        } text-sm text-white placeholder:text-[#929BAA]/40 focus:outline-none focus:border-[#63B3FF] transition-colors`}
                      />
                      {errors.email && <span className="text-[11px] text-red-400 mt-1 block">{errors.email}</span>}
                    </div>

                    {/* Project Type */}
                    <div>
                      <label htmlFor="contact-project-type" className="block text-xs font-mono uppercase text-[#929BAA] mb-2">
                        Project Scope
                      </label>
                      <select
                        id="contact-project-type"
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-[#05070C] border border-white/10 text-sm text-white focus:outline-none focus:border-[#63B3FF] transition-colors"
                      >
                        <option value="Business Website">Business Website</option>
                        <option value="AI-Assisted Web Development">AI-Assisted Web Development</option>
                        <option value="Creative Digital Experience">Creative Digital Experience</option>
                        <option value="E-commerce Concept">E-Commerce Concept</option>
                        <option value="Custom Web Interface">Custom Web Interface</option>
                      </select>
                    </div>
                  </div>

                  {/* Approximate Budget (Optional) */}
                  <div>
                    <label htmlFor="contact-budget" className="block text-xs font-mono uppercase text-[#929BAA] mb-2">
                      Approximate Budget (Optional)
                    </label>
                    <select
                      id="contact-budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#05070C] border border-white/10 text-sm text-white focus:outline-none focus:border-[#63B3FF] transition-colors"
                    >
                      <option value="">Select an approximate range (Optional)</option>
                      <option value="Flexible / Exploring">Flexible / Exploring</option>
                      <option value="Starter Build ($500 - $1,500)">Starter Build ($500 - $1,500)</option>
                      <option value="Growth Business ($1,500 - $3,500)">Growth Business ($1,500 - $3,500)</option>
                      <option value="Bespoke Studio Experience ($3,500+)">Bespoke Studio Experience ($3,500+)</option>
                    </select>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label htmlFor="contact-description" className="block text-xs font-mono uppercase text-[#929BAA] mb-2">
                      Project Description <span className="text-[#65F4E8]">*</span>
                    </label>
                    <textarea
                      id="contact-description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Share your goals, target audience, preferred pages, or any design inspirations..."
                      className={`w-full px-4 py-3 rounded-lg bg-[#05070C] border ${
                        errors.description ? 'border-red-500' : 'border-white/10'
                      } text-sm text-white placeholder:text-[#929BAA]/40 focus:outline-none focus:border-[#63B3FF] transition-colors leading-relaxed`}
                    />
                    {errors.description && (
                      <span className="text-[11px] text-red-400 mt-1 block">{errors.description}</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 text-xs font-mono uppercase font-semibold tracking-wider text-[#05070C] bg-[#F4F6FA] hover:bg-white rounded hover:shadow-[0_0_25px_rgba(99,179,255,0.45)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Transmitting Brief...</span>
                      </>
                    ) : (
                      <>
                        <span>SEND PROJECT ENQUIRY</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
