"use client";

import React from "react";
import { AlertTriangle, Stethoscope, TrendingDown, ShieldPlus, Apple, Activity, LineChart } from "lucide-react";

export const ProtocolSection: React.FC = () => {
  return (
    <section id="protocol" className="py-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       {/* REPLACED YOUR JOURNEY SECTION DIRECTLY HERE AS REQUESTED */}
      <div
        className="mt-8 bg-gradient-to-br from-navy-900 via-teal-950 to-navy-900 rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl border border-teal-800/30 w-full"
        id="how-it-works"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-500/5 rounded-full blur-[100px]"></div>

        <div className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <p className="text-teal-400 font-bold tracking-widest uppercase text-xs mb-3">Your Journey</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Our Treatment Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[1.5rem] bg-navy-800/80 border border-teal-500/30 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-teal-400">01</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Consultation</h3>
              <p className="text-teal-100/60 text-sm max-w-[200px]">Thorough eligibility assessment.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[1.5rem] bg-navy-800/80 border border-teal-500/30 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-teal-400">02</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Planning</h3>
              <p className="text-teal-100/60 text-sm max-w-[200px]">Personalized metabolic protocol.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[1.5rem] bg-navy-800/80 border border-teal-500/30 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-teal-400">03</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Therapy</h3>
              <p className="text-teal-100/60 text-sm max-w-[200px]">Medically supervised dosing.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[1.5rem] bg-navy-800/80 border border-lime-500/30 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-lime-400">04</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Monitoring</h3>
              <p className="text-teal-100/60 text-sm max-w-[200px]">Post-treatment lifestyle guidance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why programs fail */}
      <div className="glass-card rounded-[3rem] p-8 md:p-12 mt-12 shadow-premium border border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-navy-900 mb-5 tracking-tight">
            Most weight-loss programs fail because they treat everyone the same.
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Weight loss isn't just about eating less. Standard diets ignore the biological factors.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center hover:shadow-xl transition-all group">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-navy-900 text-xl mb-2">Biological Resistance</h4>
            <p className="text-slate-500 text-sm font-medium">
              Hormonal factors are ignored, leading to severe hunger and rebound.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center hover:shadow-xl transition-all group">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-navy-900 text-xl mb-2">No Clinical Guidance</h4>
            <p className="text-slate-500 text-sm font-medium">
              Attempting weight loss without a doctor evaluating underlying health.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center hover:shadow-xl transition-all group">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingDown className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-navy-900 text-xl mb-2">Muscle Depletion</h4>
            <p className="text-slate-500 text-sm font-medium">
              Losing weight too fast causes muscle loss, slowing metabolism.
            </p>
          </div>
        </div>
      </div>

      {/* Protocol Pillars */}
      <div className="mt-12 text-center mb-8">
        <span className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-4 block">
          The Genestac Protocol
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-navy-900 tracking-tight">
          A Clinically Guided Metabolic Reset
        </h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg mt-4">
          We combine medicine, nutrition, movement, and accountability to create a system you can actually follow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldPlus className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">1. Medical Oversight</h3>
          </div>
          <p className="text-slate-500 font-medium text-sm relative z-10">
            Guided by qualified medical professionals. GLP-1-based treatment may be considered under strict
            supervision.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Apple className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">2. Precision Nutrition</h3>
          </div>
          <p className="text-slate-500 font-medium text-sm relative z-10">
            A structured plan designed to support weight loss, satiety, and energy levels without starvation.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">3. Sustainable Movement</h3>
          </div>
          <p className="text-slate-500 font-medium text-sm relative z-10">
            A practical exercise and muscle-preservation plan created around your current fitness level and schedule.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">4. Support & Tracking</h3>
          </div>
          <p className="text-slate-500 font-medium text-sm relative z-10">
            Regular check-ins to track weight, waist, and metabolic markers. We adjust your plan to ensure success.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
};
