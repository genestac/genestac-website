"use client";
import React, { useState } from "react";

const therapies = [
  { title: "Regenerative Cell Therapy", desc: "Uses stem cells and exosomes to repair damaged tissues and reduce inflammation for long-lasting pain relief.", points: ["Repairs joints and ligaments", "Non-surgical solution", "Promotes natural healing"] },
  { title: "PRP Therapy", desc: "Platelet Rich Plasma (PRP) uses growth factors from your own blood to stimulate healing of injured tissues.", points: ["Reduces joint pain", "Accelerates tissue repair", "Safe & natural process"] },
  { title: "Prolotherapy", desc: "A safe injection-based treatment that strengthens weak ligaments and joints, reducing chronic musculoskeletal pain.", points: ["Targets root cause of pain", "Improves joint stability", "Minimally invasive"] },
  { title: "Radiofrequency Ablation (RFA)", desc: "Uses radio waves to block pain signals from nerves, providing long-lasting relief from spine and joint pain.", points: ["Quick outpatient procedure", "Relief for 6–18 months", "Safe & effective"] },
  { title: "Nerve Block Injections", desc: "Delivers medication directly around irritated nerves to stop pain signals and reduce inflammation.", points: ["Immediate pain relief", "Helps sciatica & spine pain", "Non-surgical option"] },
  { title: "Ozone Therapy", desc: "Medical ozone reduces inflammation, improves oxygen supply, and helps in disc pain & arthritis.", points: ["Anti-inflammatory benefits", "Improves joint mobility", "Safe outpatient procedure"] },
  { title: "Shockwave Therapy", desc: "Uses high-energy sound waves to promote healing and reduce chronic pain, especially in tendons and joints.", points: ["Effective for sports injuries", "Non-invasive method", "Stimulates blood circulation"] },
  { title: "Laser Therapy", desc: "Low-level laser therapy reduces pain and inflammation while promoting faster tissue repair.", points: ["Safe & painless", "Speeds up recovery", "Suitable for chronic pain"] },
  { title: "Physiotherapy & Rehab", desc: "Personalized physical therapy programs to restore strength, mobility, and prevent pain recurrence.", points: ["Post-injury recovery", "Post-surgery rehabilitation", "Holistic pain management"] },
];

const TherapyCard = ({ title, desc, points }: { title: string; desc: string; points: string[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)] border-l-4 border-[#1a67aa]">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left gap-4">
        <h3 className="text-[1.3rem] font-semibold" style={{ color: "#1a67aa" }}>{title}</h3>
        <span className="text-[#d4af37] text-xl flex-shrink-0 transition-transform duration-300" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
        <div className="pt-4">
          <p className="text-sm text-[#6c757d] leading-relaxed mb-3">{desc}</p>
          <ul className="list-none space-y-2 pl-0">
            {points.map((p) => (
              <li key={p} className="text-sm text-[#212529] flex items-center gap-2">
                <span style={{ color: "#00b4d8" }}>●</span> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const TherapiesSection: React.FC = () => (
  <div style={{ fontFamily: "'Poppins', sans-serif" }}>
    {/* Advanced Therapies */}
    <section className="py-20 px-5 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-[2.5rem] font-bold inline-block relative mb-4" style={{ color: "#1a67aa" }}>
          Our Advanced Therapies
          <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[70px] h-1 rounded-sm block" style={{ background: "#d4af37" }} />
        </h2>
        <p className="text-[#6c757d] max-w-[800px] mx-auto mt-6 text-lg leading-[1.8]">
          We provide evidence-based, advanced pain management therapies designed to relieve chronic pain, restore mobility, and improve quality of life without unnecessary surgery.
        </p>
      </div>
      <div className="grid gap-8 max-w-[1200px] mx-auto items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        {therapies.map((t) => <TherapyCard key={t.title} {...t} />)}
      </div>
    </section>

    {/* Wellness & Weight Management */}
    <section className="py-20 px-5" style={{ background: "#f8f9fa" }}>
      <div className="text-center mb-12">
        <h2 className="text-[2.5rem] font-bold inline-block relative mb-4" style={{ color: "#1a67aa" }}>
          Wellness &amp; Weight Management
          <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[70px] h-1 rounded-sm block" style={{ background: "#d4af37" }} />
        </h2>
        <p className="text-[#6c757d] max-w-[800px] mx-auto mt-6 text-lg leading-[1.8]">
          Comprehensive, medically supervised injectable programs designed to support your metabolic health, reduce appetite, and achieve sustainable weight loss goals.
        </p>
      </div>
      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.08)] border-l-4 border-[#1a67aa] max-w-[400px] w-full">
          <TherapyCard
            title="Weight Loss Injections"
            desc="FDA-approved medical injectables (such as GLP-1 agonists) to regulate appetite, improve insulin sensitivity, and support sustainable weight loss."
            points={["Curbs appetite and food cravings", "Improves overall metabolic function", "Medically supervised dosing"]}
          />
        </div>
      </div>
      <div className="mt-12 max-w-[800px] mx-auto bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
        <p className="text-gray-600 text-sm"><strong>Note:</strong> All therapies are prescribed after thorough evaluation by our specialists. Treatment plans are customized to each patient's condition and needs.</p>
      </div>
    </section>
  </div>
);
