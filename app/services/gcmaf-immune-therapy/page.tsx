import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "GcMAF Takara Immune Therapy | Genestac Therapeutics",
  description:
    "GcMAF Takara: Revolutionizing Immune Modulation at Genestac Therapeutics. Discover macrophage activation, cancer immunotherapy, and research-grade GcMAF solutions.",
};

export default function GcMAFImmunePage() {
  return (
    <main className="bg-white overflow-x-hidden min-h-screen pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── HERO ── */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px] animate-pulse" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Our Services</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white font-montserrat">
              GcMAF Takara: Revolutionizing Immune Modulation
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">Gc Protein-Derived Macrophage Activating Factor</p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              A naturally occurring protein that activates macrophages — the immune system's first line of defense — offering new possibilities in cancer immunotherapy, autoimmune conditions, and chronic disease management.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] shadow-lg hover:bg-white hover:-translate-y-0.5 transition-all duration-300">
                Schedule a Consultation
              </AppointmentButton>
              <a href="https://wa.me/919971114121" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300">
                <i className="fa-brands fa-whatsapp text-lg text-emerald-400"></i>WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS GcMAF & SVG ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-purple-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-purple-700">What is GcMAF?</div>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                GcMAF (Gc protein-derived Macrophage Activating Factor) is a naturally occurring protein that activates macrophages, the immune system's first line of defense. It is derived from the Gc-globulin (Vitamin D binding protein) and plays a critical role in immune surveillance and regulation.
              </p>
            </div>
            {/* Macrophage Activation SVG */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
              <svg className="w-full max-w-[400px] h-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="macGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#5B21B6" />
                  </linearGradient>
                </defs>

                {/* Macrophage body (irregular amoeba shape) */}
                <path d="M200 320 C150 310, 90 290, 80 240 C70 190, 100 150, 90 110 C80 70, 130 50, 170 60 C210 70, 230 50, 270 70 C310 90, 320 130, 310 170 C300 210, 330 250, 310 290 C290 330, 250 330, 200 320 Z"
                  fill="url(#macGrad)" fillOpacity="0.15" stroke="#7C3AED" strokeWidth="4" />
                {/* Macrophage nucleus */}
                <circle cx="195" cy="195" r="45" fill="#7C3AED" fillOpacity="0.25" />
                <circle cx="188" cy="188" r="28" fill="#7C3AED" fillOpacity="0.4" />
                {/* Pseudopodia (arms reaching out) */}
                <path d="M155 120 C130 95, 115 80, 100 70" stroke="#7C3AED" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M248 118 C265 95, 278 80, 295 68" stroke="#7C3AED" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M310 230 C330 225, 345 235, 360 230" stroke="#7C3AED" strokeWidth="8" strokeLinecap="round" fill="none" />

                {/* GcMAF key molecule docking onto receptor */}
                <rect x="60" y="175" width="18" height="32" rx="4" fill="#10B981" />
                <circle cx="69" cy="170" r="10" fill="#10B981" />
                <circle cx="62" cy="163" r="5" fill="#34D399" />
                <circle cx="76" cy="163" r="5" fill="#34D399" />
                <text x="30" y="220" textAnchor="middle" fill="#047857" fontSize="8" fontWeight="bold" fontFamily="sans-serif">GcMAF</text>

                {/* Receptor on macrophage */}
                <rect x="78" y="185" width="10" height="22" rx="2" fill="#4C1D95" />

                {/* Engulfing cancer cell (dotted lines to target) */}
                <circle cx="340" cy="130" r="22" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 2" />
                <circle cx="340" cy="130" r="12" fill="#EF4444" fillOpacity="0.5" />
                <path d="M295 70 L325 112" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x="340" y="165" textAnchor="middle" fill="#B91C1C" fontSize="8" fontWeight="bold" fontFamily="sans-serif">TARGET CELL</text>

                {/* Labels */}
                <text x="200" y="365" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold" fontFamily="sans-serif">ACTIVATED MACROPHAGE</text>
              </svg>
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY GcMAF MATTERS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Therapeutic Potential</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">Why GcMAF Matters</h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              GcMAF enhances the immune system's ability to detect and destroy abnormal cells including cancerous and infected cells. It is being investigated for its potential in:
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Cancer Immunotherapy", icon: "fa-solid fa-ribbon", color: "text-rose-500" },
              { title: "Autism Spectrum Disorders", icon: "fa-solid fa-brain", color: "text-purple-500" },
              { title: "Chronic Fatigue Syndrome (CFS)", icon: "fa-solid fa-battery-quarter", color: "text-amber-500" },
              { title: "Autoimmune & Viral Conditions", icon: "fa-solid fa-shield-virus", color: "text-emerald-500" }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50 text-center space-y-3 hover:shadow-lg transition-shadow">
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm text-lg ${item.color}`}>
                  <i className={item.icon}></i>
                </span>
                <h3 className="text-sm font-bold font-montserrat text-slate-900">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT IS GcMAF TAKARA & BENEFITS ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Product Profile</span>
                <h3 className="text-3xl font-bold font-montserrat">What is GcMAF Takara?</h3>
              </div>
              <p className="text-slate-300 leading-8">
                GcMAF Takara is a highly purified, second-generation GcMAF developed using patented technology by Takara Bio. It offers superior purity, stability, and bioactivity, making it ideal for both in vitro research and experimental therapy protocols.
              </p>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Key Advantages</span>
                <h3 className="text-3xl font-bold font-montserrat">Benefits of GcMAF Takara</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Stimulates macrophage phagocytic activity",
                  "Enhances antigen presentation and immune signaling",
                  "Promotes apoptosis of abnormal cells",
                  "Non-toxic and non-inflammatory in physiological doses"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 leading-6">
                    <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── GENESTAC SOLUTIONS & IMMUNE REGULATION ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Our Services</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">Genestac's GcMAF Takara Solutions</h3>
              </div>
              <p className="text-sm text-slate-600">
                <strong>Genestac Therapeutics</strong> offers verified GcMAF Takara solutions under strict research-grade standards:
              </p>
              <ul className="space-y-4">
                {[
                  "Quality-controlled and validated batches",
                  "Formulated for enhanced stability and bioavailability",
                  "Ideal for cellular assays and immune pathway studies",
                  "Research-use only (RUO) compliance for global clients"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 leading-6 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-bold shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Mechanism</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">GcMAF in Immune Regulation</h3>
              </div>
              <p className="text-sm sm:text-base leading-8 text-slate-600">
                GcMAF regulates immune homeostasis by restoring impaired macrophage function and improving the antigen-presenting response. It is being explored as a supportive modality in immunodeficiency conditions and personalized cancer care strategies.
              </p>
              <div className="p-6 bg-purple-50 border border-purple-100 rounded-2xl space-y-3">
                <h4 className="font-bold text-purple-900 font-montserrat">Key Regulatory Actions</h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  {[
                    "Restores macrophage phagocytosis in immunocompromised states",
                    "Modulates inflammatory cytokine expression",
                    "Promotes innate immune surveillance against tumor cells"
                  ].map((item, i) => <li key={i} className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">→</span>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONCLUSION ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Conclusion</span>
          <p className="text-lg sm:text-xl leading-9 text-slate-700">
            GcMAF Takara is a promising immune-modulator for academic and translational research. With Genestac's commitment to precision and quality, researchers can explore GcMAF's potential in immune restoration, cancer biology, and cellular assays.
          </p>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">FAQs on GcMAF Takara</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { question: "Is GcMAF a drug?", answer: "GcMAF (Gc protein-derived Macrophage Activating Factor) is not classified as a pharmaceutical drug in the conventional sense. It is a naturally occurring human protein. GcMAF Takara is offered for research and investigational use only (RUO) and has shown great promise in pre-clinical and early clinical settings, though it has not yet received blanket regulatory approval as a therapeutic drug in all jurisdictions." },
              { question: "How is GcMAF Takara different from traditional GcMAF?", answer: "GcMAF Takara is a second-generation, highly purified form developed by Takara Bio using patented manufacturing processes. Compared to traditional GcMAF preparations, GcMAF Takara offers significantly higher purity (>95%), greater batch-to-batch consistency, improved stability at physiological temperatures, and superior bioactivity in macrophage activation assays." },
              { question: "Is it safe for human use?", answer: "GcMAF Takara has demonstrated a favorable safety profile in in vitro studies and has been used in experimental protocols. Since GcMAF is derived from the human body's own Gc-globulin (Vitamin D binding protein), it is inherently biocompatible. However, clinical use should always be conducted under strict medical supervision and within appropriate regulatory frameworks." }
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
          <h2 className="text-3xl font-black font-montserrat">Explore GcMAF Takara Solutions</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">Connect with our team at Genestac Therapeutics for research-grade GcMAF Takara and personalized immunotherapy consultations.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white hover:-translate-y-0.5 transition-all shadow-lg">
              Schedule a Consultation
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
