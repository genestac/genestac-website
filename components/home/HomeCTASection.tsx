"use client";
import React from "react";
import AppointmentButton from "@/components/AppointmentButton";
import WhatsAppButton from "@/components/WhatsAppButton";

export const HomeCTASection: React.FC = () => (
  <section style={{ fontFamily: "'Poppins', sans-serif" }}>
    <div
      className="rounded-[20px] text-center py-[70px] px-6 max-w-[1100px] mx-auto my-16 shadow-[0_5px_20px_rgba(0,0,0,0.08)]"
      style={{ background: "#f8f4ef" }}
    >
      <h2 className="text-[2rem] font-bold mb-4" style={{ color: "#013f3f" }}>
        Start Your Journey to a Pain-Free Life
      </h2>
      <p className="text-lg mb-8 text-[#444]">
        Experience world-class, non-surgical regenerative therapies with trusted specialists at Genestac Therapeutics.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <AppointmentButton
          className="px-8 py-4 rounded-full font-semibold text-base text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_5px_10px_rgba(0,0,0,0.15)] cursor-pointer"
          style={{ background: "#019e9e" }}
        >
          Book Free Appointment
        </AppointmentButton>
        <WhatsAppButton
          phone="918287776752"
          className="px-8 py-4 rounded-full font-semibold text-base border-2 border-[#019e9e] text-[#019e9e] bg-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_5px_10px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          Chat on WhatsApp
        </WhatsAppButton>
        
      </div>
    </div>
  </section>
);
