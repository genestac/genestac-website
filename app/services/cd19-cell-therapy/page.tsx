import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "CD19 Enrichment | Genestac Therapeutics",
  description:
    "CD19 Enrichment & targeting B Cell Immunotherapy at Genestac Therapeutics. Learn about CD19+ B-cells, CAR-T cell therapy, and precision clinical sorting.",
};

export default function CD19EnrichmentPage() {
  return (
    <main className="bg-white overflow-x-hidden min-h-screen pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── HERO SECTION ── */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] animate-pulse" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
              Our Services
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white font-montserrat">
              CD19 Enrichment: Targeting B Cell Immunotherapy with Precision
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">
              Key Biomarker Isolation for CAR-T & Hematological Diagnostics
            </p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              Isolating and profiling CD19+ B cells under clinical-grade parameters to power advanced cellular therapies, autoimmune diagnostics, and lymphoma research.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] shadow-lg hover:bg-white hover:-translate-y-0.5 transition-all duration-300">
                Schedule a Consultation
              </AppointmentButton>
              <a
                href="https://wa.me/919971114121"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <i className="fa-brands fa-whatsapp text-lg text-emerald-400"></i>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS CD19 & SVG ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-blue-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                What is CD19?
              </div>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                CD19 is a transmembrane glycoprotein expressed almost exclusively on B cells throughout their development—except on plasma cells. It acts as a co-receptor with the B cell receptor (BCR) and plays a crucial role in B cell activation, proliferation, and differentiation.
              </p>
              <p className="text-base leading-7 text-slate-500">
                Due to its lineage-specific expression and stable presence on malignant B cells, CD19 serves as a reliable biomarker and therapeutic target.
              </p>
            </div>

            {/* Right: Custom CAR-T & CD19 B Cell Interaction SVG */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
              <svg className="w-full max-w-[400px] h-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bcellGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1E3A8A" />
                  </linearGradient>
                  <linearGradient id="carGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>

                {/* B Cell (Left side) */}
                <circle cx="130" cy="200" r="70" fill="url(#bcellGrad)" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="3" />
                <circle cx="130" cy="200" r="30" fill="#1E3A8A" fillOpacity="0.3" />
                <text x="130" y="285" textAnchor="middle" fill="#1E3A8A" fontSize="9" fontWeight="bold" fontFamily="sans-serif">B CELL (CD19+)</text>

                {/* CD19 Glycoproteins on B Cell Surface */}
                <g stroke="#3B82F6" strokeWidth="2.5" fill="#3B82F6">
                  <line x1="190" y1="170" x2="205" y2="175" />
                  <circle cx="205" cy="175" r="4.5" fill="#3B82F6" />
                  <line x1="195" y1="210" x2="210" y2="208" />
                  <circle cx="210" cy="208" r="4.5" fill="#3B82F6" />
                  <line x1="175" y1="245" x2="185" y2="258" />
                  <circle cx="185" cy="258" r="4.5" fill="#3B82F6" />
                </g>

                {/* CAR-T Cell (Right side) */}
                <circle cx="270" cy="200" r="70" fill="url(#carGrad)" fillOpacity="0.15" stroke="#10B981" strokeWidth="3" />
                <circle cx="270" cy="200" r="30" fill="#047857" fillOpacity="0.3" />
                <text x="270" y="285" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="bold" fontFamily="sans-serif">CAR-T CELL</text>

                {/* Chimeric Antigen Receptor (CAR) docking onto CD19 */}
                <g stroke="#10B981" strokeWidth="3" fill="#10B981">
                  {/* CAR Receptor 1 */}
                  <path d="M210 180 L205 175" />
                  <path d="M225 188 L210 180" />
                  {/* CAR Receptor 2 */}
                  <path d="M212 208 L210 208" />
                  <path d="M230 203 L212 208" />
                </g>

                {/* Labels */}
                <text x="207" y="155" textAnchor="middle" fill="#2563EB" fontSize="8" fontWeight="bold" fontFamily="sans-serif">CD19 LIGAND</text>
                <text x="228" y="225" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="sans-serif">CAR RECEPTOR</text>
              </svg>
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* ── WHY IS CD19 IMPORTANT? ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Clinical Indication</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Why is CD19 Important?
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "B-cell Acute Lymphoblastic Leukemia",
                desc: "CD19 serves as an essential tumor biomarker for monitoring and targeting B-ALL clonal cells.",
                icon: "fa-solid fa-ribbon",
                color: "text-rose-500",
              },
              {
                title: "Non-Hodgkin Lymphoma",
                desc: "Ubiquitous expression on NHL cells makes it a perfect target for therapeutic monoclonal antibodies.",
                icon: "fa-solid fa-virus-covid",
                color: "text-blue-500",
              },
              {
                title: "Chronic Lymphocytic Leukemia",
                desc: "Indicates specific B-cell maturity stages and acts as a marker for tracking CLL diagnostic progression.",
                icon: "fa-solid fa-droplet",
                color: "text-red-500",
              },
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

      {/* ── WHAT IS CD19 ENRICHMENT & APPLICATIONS ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            
            {/* Left Content */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Enrichment Isolation</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-montserrat">
                What is CD19 Enrichment?
              </h2>
              <p className="text-slate-300 leading-8">
                CD19 enrichment is the process of isolating CD19-positive B cells from blood or bone marrow samples using immunomagnetic separation (MACS) or high-speed flow cytometry (FACS). This is essential for both research and clinical applications, such as CAR-T cell development and disease monitoring.
              </p>
            </div>

            {/* Right: Applications list */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-montserrat text-[#F5E6CC]">Applications of CD19 Enrichment</h3>
              <ul className="space-y-3">
                {[
                  { title: "CAR-T Cell Therapy", desc: "Targeting CD19 with CAR-T cells for treating relapsed/refractory B-cell malignancies." },
                  { title: "B Cell Functional Assays", desc: "Studying signalling, antibody production, or cytokine expression profiles." },
                  { title: "Autoimmune Disease Research", desc: "Examining CD19+ B cells in diseases like lupus and rheumatoid arthritis." },
                  { title: "Transplantation Studies", desc: "CD19 monitoring in bone marrow transplantation for graft purity and relapse detection." }
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
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Services Overview</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Genestac's CD19 Enrichment Services
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              Genestac Therapeutics provides industry-leading CD19+ B cell enrichment services for translational research and immunotherapy workflows:
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              "High-purity magnetic bead-based or FACS sorting",
              "Viability and phenotypic confirmation (CD19, CD20, CD27)",
              "Compatible with downstream culture, sequencing, or reprogramming",
              "Fast turnaround time and scalable volumes"
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-[2rem] border border-slate-100 bg-white space-y-4 hover:shadow-lg transition-all duration-300 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#001f3f] text-[#F5E6CC] font-bold text-xs">
                  {idx + 1}
                </span>
                <p className="text-sm leading-6 text-slate-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAR-T GAME CHANGER ── */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-[#001f3f]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Immunotherapy Focus</span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-montserrat">
            CD19 in CAR-T Cell Therapy: A Game Changer
          </h2>
          <p className="text-lg leading-9 text-slate-700">
            CD19 has revolutionized cancer treatment through CAR-T cell therapy (e.g., Tisagenlecleucel, Axicabtagene ciloleucel). Enriched CD19-positive targets are essential for validating CAR constructs and conducting preclinical cytotoxicity assays.
          </p>
        </div>
      </section>

      {/* ── CONCLUSION ── */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Conclusion</span>
          <p className="text-base sm:text-lg leading-8 text-slate-600 max-w-3xl mx-auto">
            CD19 is a pivotal biomarker in modern immunology and oncology. Whether for CAR-T development or fundamental research on B cell function, Genestac's CD19 enrichment solutions provide the specificity and reliability you need for impactful outcomes.
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
                question: "Is CD19 expressed on all B cells?",
                answer: "CD19 is expressed on almost all stages of B-cell development, from early pre-B cells to mature B cells. However, it is down-regulated and lost when B cells undergo terminal differentiation into mature antibody-producing plasma cells."
              },
              {
                question: "Can CD19 be used as a target in autoimmune disease?",
                answer: "Yes. B cells play a key role in producing autoantibodies in autoimmune diseases. Therapies targeting CD19+ cells (such as monoclonal antibodies or CD19-targeted CAR-T cells) are being actively researched and applied to treat severe, refractory autoimmune conditions like systemic lupus erythematosus (SLE)."
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
            Access CD19 Enrichment Solutions
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Consult our experts at Genestac Therapeutics to design high-yield CD19+ sorting and enrichment protocols.
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
