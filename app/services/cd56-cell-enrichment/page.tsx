import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "CD56 Cell Enrichment | Genestac Therapeutics",
  description: "CD56 Enrichment: Advancing NK Cell Isolation & Immunotherapy at Genestac Therapeutics. Clinical-grade NK cell enrichment for cancer immunotherapy and stem cell transplantation.",
};

export default function CD56EnrichmentPage() {
  return (
    <main className="bg-white overflow-x-hidden min-h-screen pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── HERO ── */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] animate-pulse" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Our Services</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white font-montserrat">
              CD56 Enrichment: Advancing NK Cell Isolation & Immunotherapy
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">Clinical-Grade NK Cell Isolation for Cancer & Viral Immunity</p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              Using CD56 (NCAM) as a surface marker to isolate highly cytotoxic Natural Killer cells — powering tumor-targeting immunotherapy, HSCT support, and neurobiology research.
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

      {/* ── WHAT IS CD56 & SVG ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-cyan-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700">What is CD56 Enrichment?</div>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                CD56 Enrichment is a process that isolates NK cells (Natural Killer cells) using CD56, also known as Neural Cell Adhesion Molecule (NCAM). This surface marker is highly expressed on NK cells and subsets of T cells, playing a vital role in immune defense, cell-to-cell interactions, and migration. CD56 Enrichment is essential in NK cell isolation, cancer immunotherapy, and immunology research.
              </p>
            </div>
            {/* NK Cell with CD56 SVG */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
              <svg className="w-full max-w-[400px] h-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="nkGrad56" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0891B2" /><stop offset="100%" stopColor="#0E7490" />
                  </linearGradient>
                </defs>
                {/* NK Cell body */}
                <circle cx="170" cy="200" r="85" fill="url(#nkGrad56)" fillOpacity="0.15" stroke="#0891B2" strokeWidth="4" />
                <circle cx="170" cy="200" r="45" fill="#0891B2" fillOpacity="0.25" />
                <circle cx="158" cy="188" r="25" fill="#0E7490" fillOpacity="0.4" />
                {/* CD56 (NCAM) surface markers - distinctive rod-like structures */}
                <g stroke="#0891B2" fill="#0891B2">
                  <rect x="82" y="178" width="7" height="22" rx="3" /><circle cx="85" cy="174" r="6" fill="#22D3EE" />
                  <rect x="95" y="148" width="7" height="22" rx="3" /><circle cx="98" cy="144" r="6" fill="#22D3EE" />
                  <rect x="135" y="118" width="7" height="22" rx="3" /><circle cx="138" cy="114" r="6" fill="#22D3EE" />
                  <rect x="92" y="248" width="7" height="22" rx="3" /><circle cx="95" cy="274" r="6" fill="#22D3EE" />
                  <rect x="230" y="170" width="7" height="22" rx="3" /><circle cx="233" cy="166" r="6" fill="#22D3EE" />
                </g>
                {/* Cytotoxic granules inside */}
                <circle cx="150" cy="185" r="7" fill="#6EE7B7" /><circle cx="170" cy="175" r="6" fill="#6EE7B7" />
                <circle cx="185" cy="200" r="5" fill="#6EE7B7" /><circle cx="155" cy="215" r="7" fill="#6EE7B7" />
                {/* Target tumor cell */}
                <circle cx="305" cy="200" r="45" fill="#FEE2E2" stroke="#EF4444" strokeWidth="3" strokeDasharray="5 3" />
                <circle cx="305" cy="200" r="22" fill="#EF4444" fillOpacity="0.4" />
                <text x="305" y="258" textAnchor="middle" fill="#B91C1C" fontSize="9" fontWeight="bold" fontFamily="sans-serif">TUMOR CELL</text>
                {/* Synapse connection */}
                <path d="M253 188 L262 188" stroke="#0891B2" strokeWidth="3" strokeLinecap="round" />
                <path d="M253 212 L262 212" stroke="#0891B2" strokeWidth="3" strokeLinecap="round" />
                {/* Granules releasing */}
                <g className="animate-pulse">
                  <circle cx="272" cy="192" r="4" fill="#6EE7B7" />
                  <circle cx="278" cy="200" r="3" fill="#6EE7B7" />
                  <circle cx="272" cy="208" r="4" fill="#6EE7B7" />
                </g>
                <text x="148" y="322" textAnchor="middle" fill="#0E7490" fontSize="10" fontWeight="bold" fontFamily="sans-serif">CD56+ NK CELL</text>
                <text x="70" y="165" textAnchor="middle" fill="#0891B2" fontSize="8" fontWeight="bold" fontFamily="sans-serif">CD56 (NCAM)</text>
              </svg>
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CD56+ SUBTYPES ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Cell Classification</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">CD56+ Cell Subtypes</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "CD56\u1d47\u02b3\u1d35\u1d33\u02b0\u1d57 NK Cells", desc: "Immature, cytokine-producing cells with immunoregulatory functions. Found primarily in lymph nodes.", icon: "fa-solid fa-circle-nodes", color: "text-cyan-500", bg: "bg-cyan-50 border-cyan-100" },
              { title: "CD56\u1d48\u1d35\u1d50 NK Cells", desc: "Highly cytotoxic, efficient in targeting tumor or virally infected cells. The primary cytotoxic subset in peripheral blood.", icon: "fa-solid fa-burst", color: "text-red-500", bg: "bg-red-50 border-red-100" },
              { title: "CD3\u207b CD56\u207a NK Cells", desc: "Standard phenotype for adoptive NK cell therapy — no T cell receptor, pure NK cytotoxicity.", icon: "fa-solid fa-shield-halved", color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-100" }
            ].map((item, idx) => (
              <div key={idx} className={`p-8 rounded-[2rem] border ${item.bg} space-y-4 hover:shadow-lg transition-shadow`}>
                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm text-lg ${item.color}`}>
                  <i className={item.icon}></i>
                </span>
                <h3 className="text-lg font-bold font-montserrat text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATIONS ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Clinical Use</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat">Applications of CD56 Enrichment in NK Cell Isolation</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Cancer Immunotherapy", desc: "Enriched NK cells are used for tumor-targeting immunotherapy without prior sensitization." },
              { title: "Stem Cell Transplantation", desc: "CD56 Enrichment helps improve outcomes and reduce GVHD in HSCT." },
              { title: "Viral Immunity", desc: "NK cells enriched via CD56 play a key role against HIV, hepatitis, and influenza." },
              { title: "Neurobiology Research", desc: "CD56 is expressed in neural tissues, aiding stem cell and neuroscience studies." }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors space-y-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold">{idx + 1}</span>
                <h3 className="text-base font-bold font-montserrat">{item.title}</h3>
                <p className="text-xs leading-5 text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GENESTAC SERVICES ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Our Expertise</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">Genestac's CD56 Enrichment Services</h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">At <strong>Genestac Therapeutics</strong>, we provide clinical-grade CD56 Enrichment and NK cell isolation using advanced MACS and FACS technologies. Our services include:</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "High Purity & Viability of NK Cells", desc: "Delivering >90% CD56+ cells with high post-isolation viability, verified by flow cytometry." },
              { title: "Scalable Enrichment", desc: "Flexible protocols from research-scale to clinical-grade volumes for both autologous and allogeneic applications." },
              { title: "Custom CD56bright & CD56dim Isolation", desc: "Subtype-specific enrichment for cytokine studies (bright) or cytotoxicity assays (dim)." }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-[2rem] border border-slate-100 bg-white space-y-3 hover:shadow-lg transition-all shadow-sm">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#001f3f] text-[#F5E6CC] font-bold text-xs">{idx + 1}</span>
                <h3 className="text-lg font-bold font-montserrat text-slate-900">{item.title}</h3>
                <p className="text-sm leading-6 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Comparison</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">CD56<sup>bright</sup> vs. CD56<sup>dim</sup> NK Cells</h2>
          </div>
          <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-xl bg-white">
            <table className="min-w-full divide-y divide-slate-100 text-sm text-left">
              <thead className="bg-[#001f3f] text-[#F5E6CC] font-montserrat">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">Feature</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">CD56<sup>bright</sup> NK Cells</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">CD56<sup>dim</sup> NK Cells</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {[
                  ["Function", "Immunoregulatory", "Cytotoxic"],
                  ["Location", "Lymph nodes", "Peripheral blood"],
                  ["Cytokine Production", "High", "Low"],
                ].map(([feat, bright, dim], i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{feat}</td>
                    <td className="px-6 py-4">{bright}</td>
                    <td className="px-6 py-4">{dim}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CONCLUSION ── */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 to-[#001f3f]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Conclusion</span>
          <p className="text-lg sm:text-xl leading-9 text-slate-700">
            CD56 Enrichment is a cornerstone for NK cell immunotherapy, cancer research, and stem cell applications. With Genestac Therapeutics' precision isolation methods, researchers and clinicians gain access to highly purified NK cell populations that accelerate discoveries and therapeutic outcomes.
          </p>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">FAQs about CD56 Enrichment</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { question: "Is CD56 only found on NK cells?", answer: "No. While CD56 is a primary marker for NK cells, it is also expressed on a subset of T cells (NKT cells), some dendritic cells, neuroendocrine cells, and neural tissue. In hematological contexts, however, CD56 is predominantly used to identify and isolate NK cells from peripheral blood or bone marrow." },
              { question: "What are the benefits of CD56 Enrichment?", answer: "CD56 Enrichment provides highly purified NK cell populations with excellent viability. This enables more accurate cytotoxicity assays, consistent immunotherapy product manufacturing, reduced non-specific immune activity in transplant settings (lowering GVHD risk), and scalable research applications." },
              { question: "How does CD56 Enrichment support cancer immunotherapy?", answer: "CD56-enriched NK cells are used in adoptive cell transfer therapies where they are infused into patients to target and kill tumor cells without requiring prior sensitization. CD56dim NK cells are especially cytotoxic against hematologic cancers, and CD56bright cells contribute immunoregulatory cytokines that shape the anti-tumor immune environment." },
              { question: "Does Genestac provide custom NK cell isolation?", answer: "Yes. Genestac Therapeutics offers fully customized CD56 enrichment protocols, including subtype-specific isolation (CD56bright vs CD56dim), depletion of CD3+ T cells for purer NK products, and downstream activation or expansion services — all under GMP-compliant conditions with full QC reporting." }
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
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">Access premium CD56 NK cell enrichment services tailored for your clinical or research pipeline.</p>
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
