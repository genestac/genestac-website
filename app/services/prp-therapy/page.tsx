import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "PRP Therapy | Genestac Therapeutics",
  description:
    "PRP Treatment: Natural Healing Power with Platelet-Rich Plasma at Genestac Therapeutics. Orthopedic, hair restoration, and skin rejuvenation with autologous growth factors.",
};

export default function PRPTherapyPage() {
  return (
    <main className="bg-white overflow-x-hidden min-h-screen pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── HERO ── */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px] animate-pulse" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Our Services</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white font-montserrat">
              PRP Treatment: Natural Healing Power with Platelet-Rich Plasma
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">Autologous Growth Factor Therapy for Tissue Repair</p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              Harnessing your own blood's regenerative power to stimulate natural healing in joints, hair follicles, and skin — safe, non-surgical, and clinically proven.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] shadow-lg hover:bg-white hover:-translate-y-0.5 transition-all duration-300">
                Book a Consultation
              </AppointmentButton>
              <a href="https://wa.me/919971114121" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300">
                <i className="fa-brands fa-whatsapp text-lg text-emerald-400"></i>WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS PRP & SVG ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-amber-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">What is PRP Treatment?</div>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                PRP Treatment (Platelet-Rich Plasma Therapy) uses your body's own blood to stimulate natural healing. Platelets are rich in growth factors essential for tissue regeneration. This safe and autologous procedure accelerates healing by injecting concentrated PRP into targeted areas.
              </p>
            </div>
            {/* Centrifuge Tube SVG */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
              <svg className="w-full max-w-[400px] h-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Centrifuge tube */}
                <rect x="155" y="40" width="90" height="220" rx="45" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="4" />
                <path d="M155 240 L200 330 L245 240 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="4" />
                {/* Plasma layer (top - golden PRP) */}
                <path d="M158 80 L242 80 L242 145 L158 145 Z" fill="#FDE68A" fillOpacity="0.9" />
                <text x="200" y="117" textAnchor="middle" fill="#92400E" fontSize="9" fontWeight="bold" fontFamily="sans-serif">PLATELET-RICH PLASMA</text>
                {/* Buffy coat */}
                <path d="M158 145 L242 145 L242 158 L158 158 Z" fill="#FCD34D" />
                <text x="200" y="155" textAnchor="middle" fill="#78350F" fontSize="7" fontWeight="bold" fontFamily="sans-serif">PLATELETS</text>
                {/* Red blood cells */}
                <path d="M158 158 L242 158 L242 240 L200 320 L158 240 Z" fill="#FCA5A5" fillOpacity="0.8" />
                <text x="200" y="215" textAnchor="middle" fill="#B91C1C" fontSize="9" fontWeight="bold" fontFamily="sans-serif">RED BLOOD CELLS</text>
                {/* Syringe extracting PRP */}
                <rect x="260" y="90" width="12" height="45" rx="3" fill="#F8FAFC" stroke="#6B7280" strokeWidth="2" />
                <rect x="262" y="85" width="8" height="12" rx="1" fill="#9CA3AF" />
                <path d="M266 135 L266 150" stroke="#6B7280" strokeWidth="2" />
                <path d="M258 130 L275 130" stroke="#6B7280" strokeWidth="2" />
                <text x="295" y="108" textAnchor="start" fill="#047857" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Extracting PRP</text>
                {/* Activated platelets with growth factors */}
                <g className="animate-pulse">
                  <circle cx="60" cy="160" r="12" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
                  <path d="M48 148 L52 144 M72 148 L68 144 M60 148 L60 143" stroke="#D97706" strokeWidth="1.5" />
                  <text x="60" y="184" textAnchor="middle" fill="#78350F" fontSize="7" fontFamily="sans-serif">Growth Factors</text>
                </g>
              </svg>
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW DOES PRP WORK ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Procedure</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">How Does PRP Treatment Work?</h2>
          </div>
          <div className="relative pl-8 border-l border-slate-200 space-y-8">
            {[
              { step: "Blood Sample Collection", desc: "A small amount of the patient's blood is drawn from a vein in the arm using sterile technique." },
              { step: "Platelet Separation", desc: "The blood sample is placed in a centrifuge. High-speed spinning separates the platelet-rich plasma layer from red blood cells and other components." },
              { step: "Injection", desc: "The concentrated PRP is injected into joints, scalp, skin, or soft tissues under ultrasound guidance to promote targeted healing." }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-[45px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#001f3f] text-[#F5E6CC] font-bold text-xs shadow-md group-hover:scale-110 transition-transform">
                  {idx + 1}
                </span>
                <h4 className="text-lg font-bold text-slate-900 mb-1">{item.step}</h4>
                <p className="text-sm leading-6 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATIONS ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Clinical Uses</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat">Applications of PRP Treatment</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Orthopedic Regenerative Therapy", desc: "Accelerates recovery from tendonitis, ligament injuries, arthritis, and joint pain." },
              { title: "Hair Restoration Treatment", desc: "Revitalizes dormant hair follicles, promoting new hair growth in cases of alopecia or hair thinning." },
              { title: "Skin Rejuvenation Treatment", desc: "Reduces fine lines, wrinkles, and acne scars while improving skin tone and texture." }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors space-y-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold">{idx + 1}</span>
                <h3 className="text-xl font-bold font-montserrat">{item.title}</h3>
                <p className="text-sm leading-6 text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY POPULAR & SAFETY ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Popularity</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">Why PRP Treatment is Popular</h3>
              </div>
              <ul className="space-y-5">
                {[
                  { title: "Autologous & Natural", desc: "No risk of allergic reaction since it uses the patient's own blood." },
                  { title: "Minimal Downtime", desc: "Non-surgical and typically completed in under an hour." },
                  { title: "Clinically Proven", desc: "Supported by multiple clinical studies for effectiveness in regenerative medicine." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 text-sm font-bold shrink-0">✓</span>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Safety Profile</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">Is PRP Treatment Safe?</h3>
              </div>
              <ul className="space-y-5">
                {[
                  { title: "Completely Safe", desc: "Autologous procedure reduces risk of rejection or infection since the cells come from the patient's own body." },
                  { title: "Globally Accepted", desc: "Widely used in clinics, sports medicine, and advanced skin care centers worldwide with excellent safety records." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-bold shrink-0">✓</span>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONCLUSION ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Conclusion</span>
          <p className="text-lg sm:text-xl leading-9 text-slate-700">
            PRP Treatment offers a natural, autologous solution for regenerative therapy in orthopedics, dermatology, and hair restoration. It promotes faster healing using your body's own growth factors.
          </p>
          <p className="text-sm sm:text-base leading-8 text-slate-600 max-w-2xl mx-auto">
            At <strong>Genestac Therapeutics</strong>, we provide advanced PRP Treatment with expert diagnosis and sterile protocols for consistent, safe, and effective results.
          </p>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">FAQs</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { question: "Is PRP Treatment painful?", answer: "Most patients experience minimal discomfort. A topical numbing cream is typically applied before the injection. You may feel a mild aching or pressure sensation at the injection site which subsides within a few hours. Pain management protocols are customized for each patient's comfort level." },
              { question: "How soon are results visible?", answer: "Results typically begin to appear within 2–6 weeks as the growth factors stimulate tissue repair and cellular regeneration. Full benefits are usually seen after 3–6 months. Some patients may require multiple sessions (usually 3, spaced 4–6 weeks apart) for optimal outcomes." },
              { question: "Is one session enough?", answer: "For many patients, a series of 3 sessions is recommended for best results. However, the number of sessions depends on the condition being treated, its severity, and individual patient response. Acute injuries may respond faster than chronic conditions or hair loss." },
              { question: "Can PRP Treatment be combined with other therapies?", answer: "Yes. PRP works synergistically with many treatments including physiotherapy, hyaluronic acid injections, stem cell therapies, laser treatments, and micro-needling. At Genestac, we design comprehensive, personalized treatment plans that integrate PRP where appropriate for superior outcomes." }
            ].map((faq, idx) => (
              <details key={idx} className="group rounded-2xl border border-slate-100 bg-white p-6 [&_summary::-webkit-details-marker]:hidden hover:bg-slate-50 transition-all">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900">
                  <h3 className="text-base sm:text-lg font-bold font-montserrat pr-4">{faq.question}</h3>
                  <span className="shrink-0 rounded-full bg-slate-50 border border-slate-100 p-1.5 shadow-sm group-open:-rotate-180 transition-transform duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-sm sm:text-base leading-7 text-slate-600 border-t border-slate-200/60 pt-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-gradient-to-br from-[#001f3f] to-[#00305f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-black font-montserrat">Start Your Healing Journey Today</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">Experience the power of your own body's healing with PRP therapy at Genestac Therapeutics.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white hover:-translate-y-0.5 transition-all shadow-lg">
              Book a Consultation
            </AppointmentButton>
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
