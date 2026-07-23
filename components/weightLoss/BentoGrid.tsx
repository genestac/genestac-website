"use client";

import React from "react";
import { FlaskConical, Brain, Activity, Thermometer } from "lucide-react";

export const BentoGrid: React.FC = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-brand-950 mb-4">Complete clinical ecosystem.</h2>
          <p className="text-slate-600 font-medium text-lg">Transparent memberships. Uncompromised medical standards.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {/* Large Item 1 */}
          <div className="md:col-span-2 bg-gradient-to-br from-emerald-800 to-teal-900 border border-teal-700/50 text-white rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-600 rounded-full filter blur-[80px] opacity-30 transform group-hover:scale-110 transition-transform duration-1000 animate-pulse-slow"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/30 shadow-inner">
                <FlaskConical className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-serif mb-4">Pharmaceutical Grade GLP-1</h3>
              <p className="text-teal-50 font-light leading-relaxed max-w-md text-lg">
                Access to fast, effective GLP-1 and peptide medications, custom-compounded for your specific biology
                by licensed providers.
              </p>
            </div>
          </div>

          {/* Small Item 1 */}
          <div className="acrylic-card rounded-[2.5rem] p-10 flex flex-col justify-between border border-brand-100">
            <div>
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 border border-brand-100 shadow-sm text-brand-950">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-950 mb-2">Precision Guidance</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Dedicated physician oversight tailored entirely to your personal metabolic goals.
              </p>
            </div>
          </div>

          {/* Small Item 2 */}
          <div className="acrylic-card rounded-[2.5rem] p-10 flex flex-col justify-between border border-brand-100">
            <div>
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 border border-brand-100 shadow-sm text-brand-950">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-950 mb-2">24/7 Monitoring</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Continuous medical support and dosage adjustments available throughout your treatment cycle.
              </p>
            </div>
          </div>

          {/* Large Item 2 */}
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] relative overflow-hidden group shadow-floating border border-indigo-800/50 min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60 mix-blend-luminosity filter contrast-125"
              alt="Medical Shipping"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-10 relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/20">
                <Thermometer className="h-6 w-6 text-brand-100" />
              </div>
              <h3 className="text-3xl font-serif text-white mb-3">Cold-Chain Express Logistics</h3>
              <p className="text-indigo-100 font-light text-base max-w-md">
                Medications require strict temperature control. We ship overnight in specialized discreet medical packaging
                directly to your door.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
