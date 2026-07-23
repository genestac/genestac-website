"use client";

import React from "react";
import { useModals } from "@/context/ModalContext";
import { ArrowRight } from "lucide-react";

export const HeroSection: React.FC = () => {
  const { setIntakeOpen } = useModals();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
      {/* LEFT SIDE: Text & Actions */}
      <div className="flex flex-col justify-center lg:pr-10">
        <div className="space-y-3 animate-reveal-up mb-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-navy-900 tracking-tight font-serif">
            Doctor-Guided
            <br />
            Weight Loss Program.
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-teal-600 font-serif italic font-medium leading-relaxed">
            A clinical approach that works with your metabolism.
          </h2>
        </div>

          <div className="pl-5 border-l-4 border-teal-200 mt-2 mb-4 animate-reveal-up" style={{ animationDelay: "0.1s" }}>
          <div className="text-lg text-slate-500 leading-relaxed font-light max-w-md">
            <strong className="text-navy-900 font-medium tracking-wide uppercase text-sm mb-2 block">
              Transform Your Life
            </strong>
            Achieve your ideal body weight with our personalized, science-backed medical weight loss programs. No fad
            diets, just real results.
          </div>  
        </div>

        <div className="flex flex-wrap items-center gap-4 animate-reveal-up" style={{ animationDelay: "0.2s" }}>
          {/* <button
            onClick={() => setIntakeOpen(true)}
            className="open-intake-btn inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.6)] hover:-translate-y-1 group w-fit cursor-pointer ring-4 ring-blue-600/30 btn-shine"
          >
            Check Eligibility
            <span className="ml-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </span>
          </button> */}
          <a
            href="#pricing"
            className="open-intake-btn inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.6)] hover:-translate-y-1 group w-fit cursor-pointer ring-4 ring-blue-600/30 btn-shine"
          >
            View Subscription
            <span className="ml-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>
      </div>

      {/* RIGHT SIDE: Clean Image Frame */}
      <div
        className="relative w-full h-auto flex justify-center lg:justify-end group mt-6 lg:mt-0 animate-reveal-up"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="glow-effect top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity duration-700 w-[120%] h-[120%] bg-blue-400/20 blur-3xl rounded-full absolute -z-10"></div>

        <div className="relative w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white/90 backdrop-blur-md transform transition duration-700 hover:scale-[1.02] ring-1 ring-slate-100">
          <img
            src="./weightloss.webp"
            alt="Genestac Therapy Results"
            className="w-full h-auto block object-cover object-center relative z-10"
          />
        </div>
      </div>
      </div>
    </div>
  );
};
