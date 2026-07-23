"use client";
import React from "react";
import { useModals } from "@/context/ModalContext";

const services = [
  { name: "PBSE Bone Marrow", desc: "Advanced bone marrow processing technology for cellular regeneration." },
  { name: "PBSE Volume Reduction", desc: "Efficient cell concentration solutions maximizing therapeutic potential." },
  { name: "NK Cell Therapy", desc: "Targeted natural killer cell immunotherapies for immune system support." },
  { name: "Muse Cell Therapy", desc: "Breakthrough multilineage differentiating stress enduring cells." },
  { name: "G-MAF Therapy", desc: "Advanced macrophage activating factor treatments." },
  { name: "PRP Therapy", desc: "Next-generation platelet-rich plasma treatments for tissue repair." },
  { name: "CD34 Enrichment", desc: "Precision hematopoietic stem cell isolation protocols." },
  { name: "CD45RA Analysis", desc: "Comprehensive naive T-cell characterization and profiling." },
  { name: "CD138 Plasma Cell", desc: "Advanced plasma cell identification and extraction methodologies." },
  { name: "CD56 Enrichment", desc: "Highly specific NK cell isolation and purification techniques." },
  { name: "TCR Analysis", desc: "In-depth T-cell receptor profiling for personalized medicine." },
  { name: "CD19 Analysis", desc: "Targeted B-cell marker studies for clinical diagnostics." },
  { name: "Gene Therapy", desc: "State-of-the-art genetic interventions and modifications." },
  { name: "CRISPR CAS9", desc: "Ultra-precise genome editing for inherited conditions." },
];

// No hover transforms inside the slider — they cause layout thrash during animation
const ServiceCard = ({ name, desc }: { name: string; desc: string }) => (
  <div
    style={{ width: 290, flexShrink: 0 }}
    className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-left relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] cursor-default transition-all duration-300"
  >
    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0066cc] to-[#00b4d8]" />
    <div className="w-14 h-14 mb-6 flex items-center justify-center bg-[#eff6ff] border border-[#dbeafe] rounded-xl text-2xl text-[#0066cc] shadow-sm">
      🧬
    </div>
    <h3 className="text-xl font-bold mb-3 text-[#0f172a] leading-tight">{name}</h3>
    <p className="text-base leading-relaxed text-[#334155]">{desc}</p>
  </div>
);

export const CellularHeroSection: React.FC = () => {
  const { setEnquiryOpen } = useModals();
  return (
  <section
    className="relative w-full flex flex-col overflow-hidden"
    style={{ background: "#f4f7f9", fontFamily: "'Poppins', sans-serif" }}
  >
    {/*
      FIX: Removed backdropFilter: blur() from this overlay — it was forcing
      the browser to create a new compositor layer covering the entire viewport
      and re-compositing every single frame, causing the scroll freeze.
      A solid gradient background achieves the same look with zero GPU cost.
    */}
    <div
      className="absolute inset-0 z-[1] pointer-events-none"
    />

    {/* Hero Content */}
    <div className="relative z-[2] max-w-[1400px] w-full mx-auto px-6 lg:px-10 pt-24 pb-16 flex flex-col justify-center" style={{ minHeight: "80vh" }}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full">

        {/* Text */}
        <div className="flex-1 max-w-[600px] text-center lg:text-left flex flex-col items-center lg:items-start">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[#0066cc] text-sm font-semibold tracking-[2px] uppercase mb-6 border"
            style={{ background: "rgba(0,102,204,0.08)", borderColor: "rgba(0,102,204,0.25)" }}
          >
            🔬 Medical Excellence
          </div>
          <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-bold mb-4 text-[#1e293b] leading-[1.1] tracking-tight">
            Advanced Cellular &amp; Genetic Therapies
          </h1>
          <h2 className="text-[clamp(1.3rem,3vw,2rem)] font-semibold mb-6" style={{ color: "#0066cc" }}>
            Innovative Medical Solutions
          </h2>
          <p className="text-base lg:text-lg leading-relaxed mb-10 text-[#64748b] max-w-[680px]">
            Pioneering the future of regenerative medicine with cutting-edge PBSE technologies, stem cell therapies,
            and precision genetic engineering.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <a
              href="#services"
              className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-semibold text-base transition-transform duration-300 hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg,#0066cc,#0088cc)" }}
            >
              Explore Our Services →
            </a>
            {/* <button
              onClick={() => setEnquiryOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base border-2 border-[#0066cc] text-[#0066cc] transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
            >
              Consult a Specialist
            </button> */}
          </div>
        </div>

        {/* Floating Gallery — only translateY animation, no blur layers */}
        <div className="flex-1 relative w-full max-w-[540px] mx-auto hidden lg:block" style={{ aspectRatio: "1.1/1" }}>
          <style>{`
            @keyframes floatImg {
              0%,100% { transform: translateY(0px); }
              50%      { transform: translateY(-12px); }
            }
          `}</style>
          <img
            src="./doctor2.webp"
            alt="Medical Excellence"
            className="absolute top-0 right-0 w-[65%] object-cover rounded-[24px] border-[6px] border-white shadow-[0_25px_50px_rgba(0,102,204,0.12)] z-[2]"
            style={{ aspectRatio: "4/3", animation: "floatImg 6s ease-in-out infinite", willChange: "transform" }}
          />
          <img
            src="./doctor.webp"
            alt="Mindful Medicine"
            className="absolute bottom-[5%] left-[5%] w-[60%] object-cover rounded-[24px] border-[6px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.07)] z-[1]"
            style={{ aspectRatio: "4/3", animation: "floatImg 8s ease-in-out infinite reverse", willChange: "transform" }}
          />
          {/* FIX: Removed backdrop-blur from badge — replaced with opaque white bg */}
          <div
            className="absolute bottom-[10%] right-[-5%] bg-white px-5 py-4 rounded-[20px] shadow-[0_10px_30px_rgba(0,102,204,0.1)] border border-[rgba(0,102,204,0.12)] flex items-center gap-3 z-[3]"
            style={{ animation: "floatImg 7s ease-in-out infinite 1s", willChange: "transform" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl"
              style={{ background: "linear-gradient(135deg,#0066cc,#00b4d8)" }}
            >
              🏆
            </div>
            <div>
              <strong className="text-[#1e293b] text-xl block leading-none">15+ Years</strong>
              <span className="text-[#0066cc] text-xs font-semibold uppercase tracking-wide">Excellence</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    {/* Services Slider
        FIX: Added contain: layout style paint to isolate the slider's
        paint area so the browser doesn't repaint the whole page.
        Removed hover effects from cards inside the slider.
        Added isolation: isolate to create its own stacking context.
    */}
    <div
      className="relative w-full py-12 border-t-4 border-[#00b4d8] overflow-hidden"
      style={{
        background: "#f0f4f8",
        contain: "layout style paint",
        isolation: "isolate",
      }}
    >
      <div
        className="absolute inset-y-0 left-0 w-[12%] z-[3] pointer-events-none"
        style={{ background: "linear-gradient(to right,#f0f4f8,transparent)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[12%] z-[3] pointer-events-none"
        style={{ background: "linear-gradient(to left,#f0f4f8,transparent)" }}
      />

      <style>{`
        @keyframes softScroll {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .slider-track-perf {
          display: flex;
          gap: 24px;
          width: max-content;
          padding: 8px 16px;
          animation: softScroll 60s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .slider-track-perf:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="slider-track-perf">
        {[...services, ...services].map((s, i) => (
          <ServiceCard key={i} name={s.name} desc={s.desc} />
        ))}
      </div>
      <div className="flex justify-center items-center gap-2 mt-8 relative z-10">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#0066cc]' : 'bg-[#cbd5e1]'}`} />
        ))}
      </div>
    </div>
  </section>
  );
};
