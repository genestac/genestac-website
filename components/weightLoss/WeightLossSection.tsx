"use client";

import React from "react";
import { useModals } from "@/context/ModalContext";
import { Dna, LineChart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const WeightLossSection: React.FC = () => {
  const { setIntakeOpen } = useModals();
  const router = useRouter()

  return (
    <section id="weight-loss" className="py-16 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="pro-image-bezel relative w-full order-2 lg:order-1 border border-white/80">
            <img
              src="/doctor.png"
              alt="Metabolic Health"
              className="w-full h-auto block rounded-[2.1rem]"
              loading="lazy"
            />
          </div>

          <div className="order-1 lg:order-2">
            <div className="mb-6">
              <span className="text-brand-600 font-extrabold tracking-[0.25em] uppercase text-[10px] acrylic-card px-4 py-2 rounded-full border border-brand-100">
                Metabolic Optimization
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-950 mb-6 leading-tight">
              A scientific approach to body composition.
            </h2>
            <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
              Willpower alone isn't enough. We utilize FDA-approved GLP-1 receptor agonists to biologically reset your
              metabolic setpoint, guided safely by experts.
            </p>
            <div className="space-y-4 mb-8">
              <div className="acrylic-card p-5 rounded-2xl flex items-start gap-4 border border-white">
                <div className="mt-1 p-2 bg-brand-50 rounded-lg text-brand-600 shadow-sm animate-pulse-slow">
                  <Dna className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-950">Biological Reset</h4>
                  <p className="text-slate-600 font-medium text-sm mt-1">
                    Targets the brain's appetite receptors to reduce cravings naturally.
                  </p>
                </div>
              </div>
              <div className="acrylic-card p-5 rounded-2xl flex items-start gap-4 border border-white">
                <div className="mt-1 p-2 bg-brand-50 rounded-lg text-brand-600 shadow-sm">
                  <LineChart className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-950">Data-Driven Titration</h4>
                  <p className="text-slate-600 font-medium text-sm mt-1">
                    Dosages are meticulously adjusted based on your physiological response.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
    window.location.href = "/weightloss#pricing";
  }}
              className="open-intake-btn bg-brand-900 hover:bg-brand-950 text-white px-8 py-4.5 rounded-full font-bold transition-all duration-300 text-sm tracking-wide shadow-luxury hover:-translate-y-1 inline-flex items-center gap-2 cursor-pointer uppercase btn-shine"
            >
              Explore Programs <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
