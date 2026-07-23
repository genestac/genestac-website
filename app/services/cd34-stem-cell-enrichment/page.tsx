import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "CD34 Stem Cell Enrichment | Genestac Therapeutics",
  description:
    "CD34 Enrichment & Hematopoietic Stem Cell Therapy at Genestac Therapeutics. High-purity stem cell isolation for bone marrow transplants, cardiovascular repair, and regenerative medicine.",
};

export default function CD34EnrichmentPage() {
  return (
    <main className="bg-white overflow-x-hidden min-h-screen pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── HERO ── */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] animate-pulse" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Our Services</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white font-montserrat">
              CD34 Enrichment & Hematopoietic Stem Cell Therapy
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">High-Purity Isolation for Regenerative Medicine</p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              Precision CD34+ stem cell enrichment from bone marrow, peripheral blood, or umbilical cord blood — powering blood disorders treatment, cardiovascular repair, and beyond.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] shadow-lg hover:bg-white hover:-translate-y-0.5 transition-all duration-300">
                Book a Free Consultation
              </AppointmentButton>
              <a href="https://wa.me/919971114121" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300">
                <i className="fa-brands fa-whatsapp text-lg text-emerald-400"></i>WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS CD34 & SVG ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">What is CD34 Enrichment?</div>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                CD34 Enrichment is a specialized laboratory technique used to isolate CD34+ hematopoietic stem cells from bone marrow, peripheral blood, or umbilical cord blood. These stem cells are essential for generating new blood cells, repairing tissues, and supporting regenerative medicine. By enriching CD34+ cells, clinicians enhance the success of stem cell therapy and other advanced treatments.
              </p>
            </div>
            {/* MACS/FACS Sorting SVG */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
              <svg className="w-full max-w-[420px] h-auto" viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="cd34Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
                {/* Sorting channel */}
                <rect x="150" y="40" width="60" height="200" rx="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
                {/* Mixed cells entering */}
                <circle cx="180" cy="60" r="10" fill="#FCA5A5" /><circle cx="165" cy="75" r="8" fill="#94A3B8" /><circle cx="195" cy="75" r="8" fill="#94A3B8" />
                {/* Magnet bead binding CD34+ */}
                <circle cx="180" cy="120" r="12" fill="url(#cd34Grad)" />
                <text x="180" y="124" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">CD34+</text>
                {/* Magnet */}
                <path d="M120 105 Q105 115 120 135" stroke="#3B82F6" strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M120 110 Q110 120 120 130" stroke="#1D4ED8" strokeWidth="2" fill="none" />
                <text x="90" y="120" textAnchor="middle" fill="#1D4ED8" fontSize="8" fontWeight="bold" fontFamily="sans-serif">MAGNET</text>
                {/* Enrichment vial output */}
                <rect x="152" y="195" width="56" height="60" rx="5" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
                <circle cx="180" cy="225" r="8" fill="#10B981" />
                <text x="180" y="278" textAnchor="middle" fill="#047857" fontSize="8" fontWeight="bold" fontFamily="sans-serif">CD34+ ENRICHED</text>
                {/* Non-target cells pass through */}
                <path d="M215 160 L270 200" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 3" />
                <circle cx="285" cy="210" r="10" fill="#E2E8F0" />
                <text x="310" y="215" textAnchor="start" fill="#64748B" fontSize="8" fontFamily="sans-serif">Other cells</text>
                {/* Labels */}
                <text x="180" y="330" textAnchor="middle" fill="#1E3A8A" fontSize="10" fontWeight="bold" fontFamily="sans-serif">MACS / FACS SORTING</text>
              </svg>
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT ARE CD34+ STEM CELLS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Cellular Identity</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">What are CD34+ Hematopoietic Stem Cells?</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Hematopoietic Stem Cells (HSCs)", desc: "CD34+ cells give rise to red blood cells, white blood cells, and platelets.", icon: "fa-solid fa-droplet", color: "text-red-500" },
              { title: "Marker of Regeneration", desc: "CD34 is a key surface protein used in stem cell isolation for regenerative therapies.", icon: "fa-solid fa-dna", color: "text-emerald-500" },
              { title: "Multipotent Potential", desc: "These cells migrate to damaged tissues, reduce inflammation, and promote healing.", icon: "fa-solid fa-arrows-to-dot", color: "text-blue-500" }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50 space-y-4 hover:shadow-lg transition-shadow">
                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm text-lg ${item.color}`}>
                  <i className={item.icon}></i>
                </span>
                <h3 className="text-xl font-bold font-montserrat text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat">How CD34 Enrichment Works</h2>
          </div>
          <div className="relative pl-8 border-l border-white/20 space-y-8">
            {[
              { step: "Step 1 – Cell Collection", desc: "Harvested from bone marrow, peripheral blood, or umbilical cord blood." },
              { step: "Step 2 – Separation", desc: "CD34+ stem cells are isolated using magnetic-activated cell sorting (MACS) or fluorescence-activated cell sorting (FACS)." },
              { step: "Step 3 – Enrichment", desc: "The purified CD34+ population is concentrated for clinical use." }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-[45px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-md group-hover:scale-110 transition-transform">
                  {idx + 1}
                </span>
                <h4 className="text-lg font-bold text-white mb-1">{item.step}</h4>
                <p className="text-sm leading-6 text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLINICAL APPLICATIONS & ADVANTAGES ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Clinical Use</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">Clinical Applications of CD34 Enrichment</h3>
              </div>
              <ul className="space-y-5">
                {[
                  { title: "Bone Marrow Transplantation", desc: "Treats blood cancers like leukemia and lymphoma." },
                  { title: "Cardiovascular Repair", desc: "Supports blood vessel regeneration in ischemic heart disease and PAD." },
                  { title: "Neurological Disorders", desc: "Aids recovery in ALS, Parkinson's, and spinal cord injuries." },
                  { title: "Wound Healing", desc: "Enhances angiogenesis in chronic wounds and diabetic ulcers." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 text-sm font-bold shrink-0">{idx + 1}</span>
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
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Key Benefits</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">Advantages of CD34 Enrichment</h3>
              </div>
              <ul className="space-y-5">
                {[
                  { title: "High Purity", desc: "Delivers targeted regenerative cells with reduced rejection risk." },
                  { title: "Personalized Therapy", desc: "Enables patient-specific stem cell therapy." },
                  { title: "Enhanced Efficacy", desc: "Optimized enrichment improves treatment outcomes." },
                  { title: "Reduced Side Effects", desc: "Safer compared to non-enriched bone marrow transplants." }
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

      {/* ── SAFETY & GENESTAC SERVICES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Safety & Innovation</span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-montserrat">Safety & Innovation</h3>
              <p className="text-sm sm:text-base leading-7 text-slate-600">
                All CD34 Enrichment procedures are performed under GMP-certified conditions using advanced technologies like MACS and FACS. The process ensures viability, sterility, and precision dosing for safe clinical applications.
              </p>
            </div>
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Genestac Services</span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-montserrat">CD34 Enrichment at Genestac Therapeutics</h3>
              <p className="text-sm sm:text-base leading-7 text-slate-600">At <strong>Genestac Therapeutics</strong>, we provide advanced CD34 Enrichment services for stem cell therapy and regenerative medicine. Our expertise ensures:</p>
              <ul className="space-y-3">
                {["High-yield stem cell recovery", "Customized cell dosing for patients", "Immune profiling and diagnostics", "Safe infusion with post-therapy monitoring"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONCLUSION ── */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-[#001f3f]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Conclusion</span>
          <p className="text-lg sm:text-xl leading-9 text-slate-700">
            CD34 Enrichment is transforming the future of regenerative medicine by improving the precision and outcomes of stem cell therapy. With Genestac's innovation and clinical expertise, patients gain access to cutting-edge solutions for blood disorders, neurological conditions, and cardiovascular repair.
          </p>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">FAQs</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { question: "Who is eligible for CD34 cell therapy?", answer: "Patients with blood disorders such as leukemia, lymphoma, aplastic anemia, or sickle cell disease are primary candidates. Those requiring cardiovascular regeneration, neurological recovery, or with severe wounds that are unresponsive to conventional treatments may also benefit from CD34+ cell therapy." },
              { question: "Is CD34 Enrichment safe?", answer: "Yes. CD34 Enrichment is a well-established, GMP-certified procedure. Using closed-system MACS or FACS sorting minimizes contamination risks. The isolated cells are quality-tested for viability, purity, and sterility before clinical administration." },
              { question: "How long do the effects of CD34 therapy last?", answer: "The duration varies by indication. For bone marrow transplants, successful engraftment can provide permanent restoration of healthy hematopoiesis. For cardiovascular or wound healing applications, clinical benefits have been observed for 6–24 months with some studies showing durable improvements beyond that timeframe." }
            ].map((faq, idx) => (
              <details key={idx} className="group rounded-2xl border border-slate-100 bg-slate-50 p-6 [&_summary::-webkit-details-marker]:hidden hover:bg-slate-100/50 transition-all">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900">
                  <h3 className="text-base sm:text-lg font-bold font-montserrat pr-4">{faq.question}</h3>
                  <span className="shrink-0 rounded-full bg-white p-1.5 shadow-sm group-open:-rotate-180 transition-transform duration-300">
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
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">Take the first step towards recovery with our expert team at Genestac Therapeutics — leaders in regenerative medicine.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white hover:-translate-y-0.5 transition-all shadow-lg">
              Book a Free Appointment
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
