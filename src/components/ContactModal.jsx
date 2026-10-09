import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audio';
import { TRANSITIONS, CSS_EASES } from '../config/motionSystem';

export default function ContactModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'web',
    budget: '$25,000 - $50,000',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    soundEngine.playCelestialLock();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-2xl z-50 flex items-center justify-center p-4 pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={TRANSITIONS.escapement}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-10 rounded-3xl bg-slate-900/95 border border-amber-300/30 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(226,201,146,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hairline Outer Frame Engraving */}
            <div className="absolute inset-1 rounded-[22px] border border-[#c59b56]/15 pointer-events-none" />

            <button
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 text-white flex items-center justify-center text-sm transition-all cursor-pointer"
              onClick={() => {
                soundEngine.playPlateSlide();
                onClose();
              }}
            >
              ✕
            </button>

            {!submitted ? (
              <>
                <div className="mb-8">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.03] border border-amber-300/30 text-xs font-mono text-amber-200 uppercase tracking-wider mb-3">
                    Project Commission
                  </span>
                  <h3 className="font-editorial text-3xl font-semibold text-white">
                    Partner with <span className="italic text-amber-200">Star Solutions</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-light mt-2">
                    Share a few details about your product goals. A partner will be in touch within 24 hours.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-300">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white text-sm focus:border-amber-300 focus:shadow-[0_0_15px_rgba(226,201,146,0.2)] outline-none transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onFocus={() => soundEngine.playRatchetTick(740)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-300">Work Email</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white text-sm focus:border-amber-300 focus:shadow-[0_0_15px_rgba(226,201,146,0.2)] outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => soundEngine.playRatchetTick(780)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-300">Scope of Work</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white text-sm focus:border-amber-300 outline-none transition-all cursor-pointer"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      >
                        <option value="web">Flagship Web Platform / 3D Experience</option>
                        <option value="app">Native iOS / Android Mobile App</option>
                        <option value="crm">Custom Enterprise Software / CRM</option>
                        <option value="full">Full Digital Brand Transformation</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-300">Estimated Budget</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white text-sm focus:border-amber-300 outline-none transition-all cursor-pointer"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      >
                        <option value="$15k - $25k">$15,000 - $25,000</option>
                        <option value="$25k - $50k">$25,000 - $50,000</option>
                        <option value="$50k - $100k+">$50,000 - $100,000+</option>
                        <option value="ongoing">Quarterly Retainer / Advisory</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-300">Project Overview</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Tell us about the vision, timeline, and key deliverables for this project..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white text-sm focus:border-amber-300 focus:shadow-[0_0_15px_rgba(226,201,146,0.2)] outline-none transition-all resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onFocus={() => soundEngine.playRatchetTick(820)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="group relative w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 hover:from-amber-100 hover:to-white text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(226,201,146,0.4)] hover:shadow-[0_0_30px_rgba(226,201,146,0.7)] transition-all cursor-pointer overflow-hidden"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                    <span className="relative z-10">Submit Commission Brief</span>
                    <span className="relative z-10 text-sm group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-4xl mb-4 text-[#c59b56] animate-pulse">✦</div>
                <h3 className="font-editorial text-3xl font-semibold text-amber-200 mb-2">
                  Commission Inscribed
                </h3>
                <p className="text-sm text-slate-300 font-light max-w-sm mx-auto">
                  Thank you, <strong className="text-white font-medium">{formData.name}</strong>. A Star Solutions partner will review your project brief and follow up shortly.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
