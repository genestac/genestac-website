"use client";

import React, { useState } from "react";
import { Calendar, MessageSquare, Settings, Phone } from "lucide-react";
import AppointmentModal from "@/components/modals/AppointmentModal";

export const SupportSection: React.FC = () => {
  const [apptOpen, setApptOpen] = useState(false);

  return (
    <>
      <section id="support" className="py-16 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="pro-image-bezel relative w-full z-10">
                <img
                  src="/consultant.png"
                  alt="Dedicated Health Consultant"
                  className="w-full h-auto block"
                  loading="lazy"
                />
                <div className="absolute -left-6 -bottom-12 acrylic-card p-4 rounded-2xl flex items-center gap-4 shadow-xl">
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                  </div>
                  <div className="">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Consultants Online</p>
                    <p className="text-brand-950 font-extrabold text-sm">Avg reply: 5 mins</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-6">
                <span className="text-brand-600 font-extrabold tracking-[0.25em] uppercase text-[10px] acrylic-card px-4 py-2 rounded-full border border-brand-100">
                  1-on-1 Support
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-950 mb-6 leading-tight">
                Your dedicated health consultant.
              </h2>
              <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
                Achieving your health goals is easier when you're not alone. Every genestac member is paired with a
                dedicated Care Consultant to guide you, answer questions, and adjust your plan as your body changes.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-5 acrylic-card p-4 rounded-2xl border border-white hover:-translate-y-1 transition-transform cursor-default">
                  <div className="p-3 bg-brand-50 rounded-xl shadow-sm text-brand-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="text-brand-950 font-bold text-base">Monthly progress check-ins</span>
                </li>
                <li className="flex items-center gap-5 acrylic-card p-4 rounded-2xl border border-white hover:-translate-y-1 transition-transform cursor-default">
                  <div className="p-3 bg-brand-50 rounded-xl shadow-sm text-brand-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <span className="text-brand-950 font-bold text-base">Direct messaging access</span>
                </li>
                <li className="flex items-center gap-5 acrylic-card p-4 rounded-2xl border border-white hover:-translate-y-1 transition-transform cursor-default">
                  <div className="p-3 bg-brand-50 rounded-xl shadow-sm text-brand-600">
                    <Settings className="h-5 w-5" />
                  </div>
                  <span className="text-brand-950 font-bold text-base">Personalized dosage adjustments</span>
                </li>
              </ul>
              <button
                onClick={() => setApptOpen(true)}
                className="open-intake-btn bg-brand-900 hover:bg-brand-950 text-white px-8 py-4.5 rounded-full font-bold transition-all duration-300 text-sm tracking-wide shadow-luxury hover:-translate-y-1 inline-flex items-center gap-2 uppercase btn-shine cursor-pointer"
              >
                BOOK a free appointment <Phone className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
      <AppointmentModal open={apptOpen} onClose={() => setApptOpen(false)} />
    </>
  );
};
