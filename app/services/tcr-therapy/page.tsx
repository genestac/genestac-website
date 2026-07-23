import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "TCR Enrichment | Genestac Therapeutics",
  description:
    "TCR Enrichment & T Cell Receptor Profiling at Genestac Therapeutics. Explore αβ vs γδ TCR structures, adoptive cell therapy, and precision sorting.",
};

export default function TCREnrichmentPage() {
  return (
    <main className="bg-white overflow-x-hidden min-h-screen pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── HERO SECTION ── */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[100px] animate-pulse" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
              Our Services
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white font-montserrat">
              TCR Enrichment: Precision Targeting Through T Cell Receptor Profiling
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">
              Harnessing Antigen Specificity for Next-Generation Immunotherapy
            </p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              Isolating T cells based on custom TCR expression profiles to power adoptive cell transfers, clonal diversity sequencing, and targeted cancer treatments.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] shadow-lg hover:bg-white hover:-translate-y-0.5 transition-all duration-300">
                Schedule a Consultation
              </AppointmentButton>
              <a
                href="https://wa.me/919971114121"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-gap-2 justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <i className="fa-brands fa-whatsapp text-lg text-emerald-400"></i>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS TCR & SVG ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                What is TCR?
              </div>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                TCR, or T Cell Receptor, is a complex of integral membrane proteins found on the surface of T cells. These receptors recognize antigens presented by the Major Histocompatibility Complex (MHC) and play a vital role in adaptive immunity. Each T cell expresses a unique TCR that determines its antigen specificity, enabling highly targeted immune responses.
              </p>
            </div>

            {/* Right: Detailed TCR-MHC Binding SVG */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
              <svg className="w-full max-w-[400px] h-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="tcrAlphaGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="tcrBetaGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1E3A8A" />
                  </linearGradient>
                </defs>

                {/* MHC Molecule on APC (Bottom) */}
                <rect x="110" y="270" width="180" height="50" rx="10" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2.5" />
                <path d="M140 270 C140 240, 260 240, 260 270" stroke="#9CA3AF" strokeWidth="3" fill="#E5E7EB" />
                <text x="200" y="300" textAnchor="middle" fill="#4B5563" fontSize="10" fontWeight="bold" fontFamily="sans-serif">MHC MOLECULE</text>

                {/* Peptide Antigen (Nestled in MHC Groove) */}
                <ellipse cx="200" cy="245" rx="20" ry="10" fill="#EF4444" />
                <text x="200" y="248" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">PEPTIDE</text>

                {/* TCR Alpha Chain (Top-Left) */}
                <path d="M165 90 C165 140, 185 150, 185 235" stroke="url(#tcrAlphaGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
                <circle cx="165" cy="85" r="5" fill="#10B981" />

                {/* TCR Beta Chain (Top-Right) */}
                <path d="M235 90 C235 140, 215 150, 215 235" stroke="url(#tcrBetaGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
                <circle cx="235" cy="85" r="5" fill="#3B82F6" />

                {/* T-Cell Membrane (Top) */}
                <line x1="80" y1="80" x2="320" y2="80" stroke="#374151" strokeWidth="4" />
                <text x="200" y="65" textAnchor="middle" fill="#374151" fontSize="9" fontWeight="bold" fontFamily="sans-serif">T-CELL MEMBRANE</text>

                {/* Labels */}
                <text x="145" y="150" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="bold" fontFamily="sans-serif">α CHAIN</text>
                <text x="255" y="150" textAnchor="middle" fill="#1E3A8A" fontSize="9" fontWeight="bold" fontFamily="sans-serif">β CHAIN</text>
              </svg>
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* ── STRUCTURE & TYPES ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Molecular Structure</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Structure and Types of TCR
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "αβ TCRs (Alpha-Beta)",
                desc: "Comprise the majority (90-95%) of circulating T cells, including key CD4+ helper and CD8+ cytotoxic subsets. They are responsible for recognizing classical foreign peptide antigens presented by MHC Class I or Class II molecules.",
                icon: "fa-solid fa-dna",
                color: "text-emerald-500",
                bg: "bg-emerald-50/50 border-emerald-100"
              },
              {
                title: "γδ TCRs (Gamma-Delta)",
                desc: "Represent a smaller subset (5-10%) located predominantly in mucosal surfaces and epithelial tissues. They recognize non-peptide lipid or protein antigens directly in an MHC-independent manner, displaying innate-like rapid immune functions.",
                icon: "fa-solid fa-shield-virus",
                color: "text-blue-500",
                bg: "bg-blue-50/50 border-blue-100"
              }
            ].map((item, idx) => (
              <div key={idx} className={`p-8 rounded-[2rem] border ${item.bg} space-y-4 hover:shadow-lg transition-shadow`}>
                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm text-lg ${item.color}`}>
                  <i className={item.icon}></i>
                </span>
                <h3 className="text-xl font-bold font-montserrat text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT IS TCR ENRICHMENT & APPLICATIONS ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            
            {/* Left Content */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Advanced Profiling</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-montserrat">
                What is TCR Enrichment?
              </h2>
              <p className="text-slate-300 leading-8">
                TCR Enrichment refers to the advanced process of isolating T cells with specific T Cell Receptors from a heterogeneous cell population. This is crucial for high-impact applications like adoptive T cell therapy, TCR sequencing services, and personalized cancer immunotherapy solutions.
              </p>
            </div>

            {/* Right List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-montserrat text-[#F5E6CC]">Applications of TCR Enrichment</h3>
              <ul className="space-y-3">
                {[
                  { title: "Adoptive T Cell Therapy", desc: "Isolation and expansion of tumor-specific TCR-expressing T cells for personalized cancer treatment." },
                  { title: "TCR Engineering", desc: "Genetically modifying T cells with custom TCRs to precisely target cancer antigens." },
                  { title: "Immune Repertoire Profiling", desc: "High-throughput TCR sequencing services help understand immune response diversity in disease." },
                  { title: "Autoimmunity Research", desc: "Identifying TCRs involved in autoimmune diseases such as Type 1 Diabetes and Multiple Sclerosis." }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 leading-6">
                    <span className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0">✓</span>
                    <span><strong className="text-white">{item.title}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── GENESTAC SERVICES ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Services Overview</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Genestac's TCR Enrichment Services
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              Genestac Therapeutics provides industry-leading TCR enrichment services, enabling researchers and clinicians to perform high-purity T cell isolation using MHC multimer staining or magnetic selection techniques:
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "αβ and γδ Subtype Differentiation", desc: "Clean separation and enrichment of T cell populations based on receptor lineage expression." },
              { title: "Custom Peptide-MHC Tetramer Generation", desc: "Designing antigen-specific multimers to identify and stain unique tumor-reactive TCR clones." },
              { title: "Downstream Gene Modification Support", desc: "Seamless workflow integration supporting downstream CRISPR gene editing, sequencing, or clonal expansion." }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-[2rem] border border-slate-100 bg-white space-y-4 hover:shadow-lg transition-all duration-300 shadow-sm">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#001f3f] text-[#F5E6CC] font-bold text-xs">
                  {idx + 1}
                </span>
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
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Comparison</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Comparison Table: αβ TCR vs. γδ TCR
            </h2>
          </div>
          
          <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-xl bg-white">
            <table className="min-w-full divide-y divide-slate-100 text-sm sm:text-base text-left">
              <thead className="bg-[#001f3f] text-[#F5E6CC] font-montserrat">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">Property</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">αβ TCR</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">γδ TCR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">Abundance</td>
                  <td className="px-6 py-4 font-medium">~90–95% of T cells</td>
                  <td className="px-6 py-4 font-medium">~5–10% of T cells</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">Antigen Recognition</td>
                  <td className="px-6 py-4 font-medium">Peptide-MHC dependent</td>
                  <td className="px-6 py-4 font-medium">MHC independent</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">Location</td>
                  <td className="px-6 py-4 font-medium">Lymphoid tissues</td>
                  <td className="px-6 py-4 font-medium">Mucosal surfaces</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CONCLUSION ── */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-[#001f3f]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Conclusion</span>
          <p className="text-lg sm:text-xl leading-9 text-slate-700 max-w-3xl mx-auto">
            TCR Enrichment enables precision in understanding and harnessing the immune system. Whether targeting cancer, autoimmune diseases, or tracking immune responses, Genestac's advanced TCR Enrichment services provide accuracy, purity, and customizability for research and clinical applications.
          </p>
          <p className="text-sm leading-8 text-slate-500 max-w-2xl mx-auto">
            Learn more about immunotherapy principles through the{" "}
            <a
              href="https://www.cancer.gov/about-cancer/treatment/types/immunotherapy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 underline font-semibold transition-colors"
            >
              NCI - Immunotherapy Overview
            </a>.
          </p>
        </div>
      </section>

      {/* ── FAQs SECTION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">FAQs</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Frequently Asked Questions (FAQs)
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "Can TCRs be genetically engineered?",
                answer: "Yes. In TCR-engineered T cell therapy (TCR-T), genes encoding tumor-specific TCR alpha and beta chains are introduced into a patient's T cells using viral vectors or CRISPR editing. This redirects the T cells to specifically target tumor antigens."
              },
              {
                question: "Is TCR sequencing useful in diagnostics?",
                answer: "Absolutely. TCR sequencing (profiling the TCR repertoire) is a powerful tool to track clonal T-cell expansion, monitor minimal residual disease (MRD) in lymphomas, evaluate vaccine responses, and diagnose early-stage autoimmune or infectious diseases."
              },
              {
                question: "What methods are used for TCR Enrichment?",
                answer: "TCR-specific cells are isolated using peptide-MHC (pMHC) multimers (tetramers or dextramers) combined with FACS sorting, or using magnetic beads (MACS) conjugated with antibodies against specific TCR variable regions (e.g., TCR Vbeta families)."
              },
              {
                question: "How does TCR Enrichment support cancer research?",
                answer: "By enriching antigen-specific T cells, researchers can directly study tumor-infiltrating lymphocytes (TILs), identify novel tumor antigens, analyze TCR binding affinity, and optimize candidate TCRs for therapeutic TCR-T cell transfer."
              }
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-slate-100 bg-slate-50 p-6 [&_summary::-webkit-details-marker]:hidden transition-all duration-300 hover:bg-slate-100/50"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900">
                  <h3 className="text-base sm:text-lg font-bold font-montserrat pr-4">
                    {faq.question}
                  </h3>
                  <span className="shrink-0 rounded-full bg-white p-1.5 text-slate-900 shadow-sm group-open:-rotate-180 transition-transform duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-sm sm:text-base leading-7 text-slate-600 border-t border-slate-200/60 pt-4 animate-fadeIn">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 bg-gradient-to-br from-[#001f3f] to-[#00305f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-black font-montserrat text-white">
            Access Precision TCR Enrichment Solutions
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Partner with Genestac Therapeutics to isolate antigen-specific clones and profile your T cell receptor library.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white hover:-translate-y-0.5 transition-all duration-300 shadow-lg">
              Schedule a Consultation
            </AppointmentButton>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
