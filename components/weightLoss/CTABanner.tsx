"use client";

import React from "react";
import { useModals } from "@/context/ModalContext";
import { Fingerprint, ArrowRight } from "lucide-react";
import AppointmentButton from "@/components/AppointmentButton";

export const CTABanner: React.FC = () => {
  const { setIntakeOpen } = useModals();

  return (
    <section className="py-16 soft-blue-card text-center px-4 relative overflow-hidden shadow-2xl z-10 rounded-none border-x-0">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-white/5 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="w-20 h-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
          <Fingerprint className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
          Your biology.
          <br />
          <span className="italic text-slate-400 font-light">Optimized.</span>
        </h2>
        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Step into the future of preventative healthcare. Join thousands of patients experiencing the genestac
          standard of clinical excellence.
        </p>
        <AppointmentButton
          className="open-intake-btn bg-white hover:bg-slate-100 text-slate-900 px-10 py-5 rounded-full font-extrabold text-base transition-all duration-300 hover:-translate-y-1 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_10px_50px_rgba(255,255,255,0.3)] inline-flex items-center gap-3 tracking-wide uppercase text-sm btn-shine cursor-pointer"
        >
          Initiate Protocol <ArrowRight className="h-5 w-5" />
        </AppointmentButton>
      </div>
    </section>
  );
};
