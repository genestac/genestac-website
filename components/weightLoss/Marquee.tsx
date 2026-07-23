"use client";

import React from "react";
import { Microscope, Fingerprint, ShieldPlus, Pill } from "lucide-react";

export const Marquee: React.FC = () => {
  return (
    <section className="w-full bg-brand-900 text-white py-4 flex overflow-hidden relative z-20 rounded-none border-y border-brand-800 mt-30">
      <div className="flex min-w-full shrink-0 animate-scroll-marquee items-center justify-around">
        <span className="mx-8 text-[11px] font-extrabold tracking-[0.25em] uppercase flex items-center gap-3 text-brand-100">
          <Microscope className="h-4 w-4 text-brand-300" /> Evidence Based
        </span>
        <span className="mx-8 text-[11px] font-extrabold tracking-[0.25em] uppercase flex items-center gap-3 text-brand-100">
          <Fingerprint className="h-4 w-4 text-brand-300" /> Personalized Biology
        </span>
        <span className="mx-8 text-[11px] font-extrabold tracking-[0.25em] uppercase flex items-center gap-3 text-brand-100">
          <ShieldPlus className="h-4 w-4 text-brand-300" /> HIPAA Compliant
        </span>
        <span className="mx-8 text-[11px] font-extrabold tracking-[0.25em] uppercase flex items-center gap-3 text-brand-100">
          <Pill className="h-4 w-4 text-brand-300" /> Compounded Pharmacy
        </span>
      </div>
      <div className="flex min-w-full shrink-0 animate-scroll-marquee items-center justify-around" aria-hidden="true">
        <span className="mx-8 text-[11px] font-extrabold tracking-[0.25em] uppercase flex items-center gap-3 text-brand-100">
          <Microscope className="h-4 w-4 text-brand-300" /> Evidence Based
        </span>
        <span className="mx-8 text-[11px] font-extrabold tracking-[0.25em] uppercase flex items-center gap-3 text-brand-100">
          <Fingerprint className="h-4 w-4 text-brand-300" /> Personalized Biology
        </span>
        <span className="mx-8 text-[11px] font-extrabold tracking-[0.25em] uppercase flex items-center gap-3 text-brand-100">
          <ShieldPlus className="h-4 w-4 text-brand-300" /> HIPAA Compliant
        </span>
        <span className="mx-8 text-[11px] font-extrabold tracking-[0.25em] uppercase flex items-center gap-3 text-brand-100">
          <Pill className="h-4 w-4 text-brand-300" /> Compounded Pharmacy
        </span>
      </div>
    </section>
  );
};
