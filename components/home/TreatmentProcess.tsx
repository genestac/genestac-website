"use client";
import React from "react";

const steps = [
  { n: "1", title: "Consultation", desc: "Eligibility assessment with our expert medical team." },
  { n: "2", title: "Planning", desc: "Personalized protocol and donor matching (if required)." },
  { n: "3", title: "Therapy / Treatment", desc: "Procedure in accredited partner hospital with ICU backup." },
  { n: "4", title: "Recovery", desc: "Post-treatment monitoring, infection control & rehabilitation." },
];

export const TreatmentProcess: React.FC = () => (
  <section className="py-20 px-5 bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
    <div className="text-center mb-12">
      <h2 className="text-[2.2rem] font-bold inline-block relative mb-4" style={{ color: "#1a67aa" }}>
        Our Treatment Process
        <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[70px] h-[4px] rounded-sm block" style={{ background: "#d4af37" }} />
      </h2>
      <p className="text-[#6c757d] max-w-[700px] mx-auto mt-6">Comprehensive care from consultation to recovery</p>
    </div>

    <div className="grid gap-6 max-w-[1200px] mx-auto mt-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
      {steps.map((s, i) => (
        <div key={s.n} className="text-center relative group">
          {i < steps.length - 1 && (
            <div className="hidden lg:block absolute top-10 right-[-10px] w-5 h-[2px]" style={{ background: "#1a67aa" }} />
          )}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-[1.6rem] font-bold text-white mx-auto mb-5 shadow-[0_6px_15px_rgba(26,103,170,0.3)] group-hover:scale-110 group-hover:shadow-[0_10px_25px_rgba(26,103,170,0.5)] transition-all duration-300"
            style={{ background: "linear-gradient(135deg, #1a67aa 0%, #145388 100%)" }}
          >
            {s.n}
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: "#1a67aa" }}>{s.title}</h3>
          <p className="text-sm text-[#6c757d] leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
