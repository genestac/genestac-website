"use client";

import React from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

export const BeforeAfterSection: React.FC = () => {
  return (
    <section className="py-12 bg-slate-50/50 relative z-10 border-y border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-teal-600 font-extrabold tracking-[0.25em] uppercase text-[10px] mb-2 block">
            Proven Results
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-navy-900 mb-3">Real Clinical Transformations</h2>
          <p className="text-sm text-slate-500 font-medium">Documented progress from our tailored protocols.</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <div className="relative w-full sm:w-64 rounded-xl overflow-hidden shadow-md group">
            <img
              src="https://getfit.genestac.com/wp-content/uploads/2026/05/ChatGPT-Image-Apr-27-2026-05_09_26-PM-webp.webp"
              alt="Before"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-extrabold px-3 py-1.5 rounded uppercase tracking-wider shadow-sm">
              Before
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-teal-500 z-10 -my-3 sm:-mx-4 shrink-0 border border-slate-100">
            <ArrowRight className="w-5 h-5 hidden sm:block" />
            <ArrowDown className="w-5 h-5 sm:hidden" />
          </div>
          <div className="relative w-full sm:w-64 rounded-xl overflow-hidden shadow-md group">
            <img
              src="https://getfit.genestac.com/wp-content/uploads/2026/05/ChatGPT-Image-Apr-28-2026-03_27_35-PM.webp"
              alt="After"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute bottom-3 right-3 bg-teal-600/90 backdrop-blur-sm text-white text-[10px] font-extrabold px-3 py-1.5 rounded uppercase tracking-wider shadow-sm">
              After
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
