"use client";

import React from "react";
import { ClipboardList, Stethoscope, PackageCheck } from "lucide-react";

export const PathToOptimization: React.FC = () => {
  return (
    <section id="how-it-works-2" className="py-16 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="text-brand-600 font-extrabold tracking-[0.25em] uppercase text-[10px] mb-4 block">
            Clinical Protocol
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-950 mb-4">The genestac path to optimization.</h2>
          <p className="text-slate-600 font-medium text-lg max-w-2xl mx-auto">
            A rigorous, three-step clinical framework designed to evaluate, prescribe, and deliver your personalized
            protocol safely.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 z-0 opacity-60"></div>

          {/* Step 1 */}
          <div className="relative z-10 group">
            <div className="w-24 h-24 acrylic-card rounded-3xl flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-500 mx-auto border border-brand-100">
              <ClipboardList className="h-10 w-10 text-brand-600" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-md">
                1
              </div>
            </div>
            <h3 className="text-2xl font-serif text-brand-950 mb-2 text-center">Comprehensive Intake</h3>
            <p className="text-slate-600 font-medium text-sm leading-relaxed text-center">
              Complete a detailed metabolic and physiological assessment. Your data is encrypted and HIPAA protected.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 group mt-6 md:mt-0">
            <div className="w-24 h-24 acrylic-card rounded-3xl flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-500 mx-auto border border-brand-100 shadow-glow">
              <Stethoscope className="h-10 w-10 text-brand-600" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-md">
                2
              </div>
            </div>
            <h3 className="text-2xl font-serif text-brand-950 mb-2 text-center">Physician Analysis</h3>
            <p className="text-slate-600 font-medium text-sm leading-relaxed text-center">
              A specialist analyzes your markers to formulate a targeted, high-efficacy prescription plan.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 group mt-6 md:mt-0">
            <div className="w-24 h-24 acrylic-card rounded-3xl flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-500 mx-auto border border-brand-100">
              <PackageCheck className="h-10 w-10 text-brand-600" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-md">
                3
              </div>
            </div>
            <h3 className="text-2xl font-serif text-brand-950 mb-2 text-center">Cold-Chain Delivery</h3>
            <p className="text-slate-600 font-medium text-sm leading-relaxed text-center">
              Medications are compounded at certified pharmacies and shipped overnight in temperature-controlled
              packaging.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
