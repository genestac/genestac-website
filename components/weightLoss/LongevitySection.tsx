"use client";

import React from "react";
import { useModals } from "@/context/ModalContext";
import { Dna, Brain, ArrowRight, Infinity } from "lucide-react";

export const LongevitySection: React.FC = () => {
  const { setIntakeOpen } = useModals();

  return (
    <section id="longevity" className="py-16 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="pro-image-bezel relative w-full border border-white/80 z-10 group cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(12,74,110,0.3)] transition-all duration-500">
              <div className="overflow-hidden rounded-[2.1rem]">
                <img
                  src="/couple.webp"
                  alt="Longevity Science"
                  className="w-full h-auto block rounded-[2.1rem] transform group-hover:scale-110 transition-all duration-700 filter group-hover:contrast-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute -right-8 top-12 acrylic-card p-4 rounded-2xl hidden md:flex items-center gap-4 shadow-xl border border-white z-20 group-hover:-translate-y-1 transition-transform duration-500">
                <div className="p-2 bg-white rounded-full text-slate-800 shadow-sm">
                  <Infinity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Biological Age</p>
                  <p className="text-slate-800 font-extrabold">Reversing...</p>
                </div>
              </div>
              <div className="absolute -left-8 bottom-12 soft-blue-card p-4 rounded-2xl hidden md:flex items-center gap-4 shadow-xl border border-brand-800 z-20 group-hover:-translate-y-1 transition-transform duration-500 delay-75">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-100"></span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NAD+ Levels</p>
                  <p className="text-white font-extrabold text-sm">Optimized</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="mb-6">
              <span className="text-brand-600 font-extrabold tracking-[0.25em] uppercase text-[10px] acrylic-card px-4 py-2 rounded-full border border-brand-100">
                Longevity Protocol
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-950 mb-6 leading-tight">
              Pushing the boundaries of your healthspan.
            </h2>
            <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
              Aging is no longer an absolute destiny. Our Longevity protocols utilize advanced peptide therapies and
              cellular interventions to optimize physical vitality, cognitive clarity, and long-term metabolic health.
            </p>
            <div className="space-y-4 mb-8">
              <div className="acrylic-card p-6 rounded-2xl flex items-center gap-5 border border-white hover:-translate-y-1 transition-transform shadow-sm hover:shadow-lg">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-800 shadow-inner">
                  <Dna className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-950">Cellular Regeneration</h4>
                  <p className="text-slate-500 font-medium text-xs mt-1">
                    Advanced therapies to accelerate tissue repair and cellular turnover.
                  </p>
                </div>
              </div>
              <div className="acrylic-card p-6 rounded-2xl flex items-center gap-5 border border-white hover:-translate-y-1 transition-transform shadow-sm hover:shadow-lg">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-800 shadow-inner">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-950">Cognitive Enhancement</h4>
                  <p className="text-slate-500 font-medium text-xs mt-1">
                    Neuro-protective protocols like NAD+ to sustain sharp mental focus.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIntakeOpen(true)}
              className="open-intake-btn bg-brand-900 hover:bg-brand-950 text-white px-8 py-4.5 rounded-full font-bold transition-all duration-300 text-sm tracking-wide shadow-luxury hover:-translate-y-1 inline-flex items-center gap-2 cursor-pointer uppercase btn-shine"
            >
              Explore Longevity <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
