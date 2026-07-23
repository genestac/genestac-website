import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "CD138+ Plasma Cell Therapy | Genestac Therapeutics",
  description:
    "Explore CD138+ Plasma Cell Therapy at Genestac Therapeutics. Learn about Syndecan-1, antibody secretion, multiple myeloma biomarkers, and precision enrichment.",
};

export default function CD138PlasmaCellTherapyPage() {
  return (
    <main className="bg-white overflow-x-hidden min-h-screen pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── HERO SECTION ── */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse duration-[6000ms]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] animate-pulse duration-[4000ms]" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
              Our Services
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white font-montserrat">
              CD138+ Plasma Cells: Master Cells of Antibody Production
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">
              Advanced Enrichment & Therapeutic Diagnostics
            </p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              Harnessing CD138+ plasma cell profiling to understand B cell differentiation, antibody secretion, and target chronic inflammatory or myeloma disorders.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] shadow-lg hover:bg-white hover:shadow-[0_8px_24px_rgba(245,230,204,0.4)] hover:-translate-y-0.5 transition-all duration-300">
                Schedule a Consultation
              </AppointmentButton>
              <a
                href="https://wa.me/919971114121"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-sm font-bold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <i className="fa-brands fa-whatsapp text-lg text-emerald-400"></i>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS CD138 & ILLUSTRATION ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                What is CD138?
              </div>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                CD138, also known as Syndecan-1, is a transmembrane heparan sulfate proteoglycan and a key surface marker of plasma cells. These CD138+ plasma cells represent the final stage of B cell differentiation and are responsible for producing antibodies. They are widely studied in immunology, hematology, and oncology for their crucial role in adaptive immunity and conditions such as multiple myeloma and other plasma cell disorders.
              </p>
            </div>

            {/* Right: CD138+ Plasma Cell SVG Illustration */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 overflow-hidden">
              <img src="/cd138.png" alt="CD138+ Plasma Cells" />
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* ── FUNCTIONS OF CD138+ PLASMA CELLS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Cellular Role</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Functions of CD138+ Plasma Cells
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Antibody Secretion",
                desc: "CD138+ plasma cells release immunoglobulins (IgG, IgM, IgA), key defenders in immune protection.",
                icon: "fa-solid fa-arrows-to-circle",
                color: "text-emerald-500"
              },
              {
                title: "Long-Term Immunity",
                desc: "They persist in bone marrow and lymphoid organs, ensuring lifelong immune memory after infections or vaccines.",
                icon: "fa-solid fa-clock-rotate-left",
                color: "text-blue-500"
              },
              {
                title: "Immune Regulation",
                desc: "These cells help regulate B cell maturation and enhance memory responses by interacting with dendritic cells and T follicular helper cells.",
                icon: "fa-solid fa-sliders",
                color: "text-teal-500"
              }
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

      {/* ── CLINICAL RELEVANCE ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Medical Importance</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-white">
              Clinical Relevance of CD138
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Multiple Myeloma Biomarker",
                desc: "CD138 is highly expressed on malignant plasma cells, making it essential in diagnosis and monitoring of multiple myeloma."
              },
              {
                title: "Cell Isolation",
                desc: "CD138+ enrichment enables precise plasma cell separation for research and therapeutic antibody development."
              },
              {
                title: "Tumor Research",
                desc: "CD138+ cells influence cancer microenvironments and cytokine pathways in myeloma, lymphoma, and carcinoma."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 space-y-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold shrink-0">
                  ✓
                </span>
                <h3 className="text-xl font-bold font-montserrat text-white">{item.title}</h3>
                <p className="text-sm leading-6 text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Comparison</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Comparison Table: B Cells vs. CD138+ Plasma Cells
            </h2>
          </div>
          
          <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-xl bg-white">
            <table className="min-w-full divide-y divide-slate-100 text-sm sm:text-base text-left">
              <thead className="bg-[#001f3f] text-[#F5E6CC] font-montserrat">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">B Cells</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">CD138+ Plasma Cells</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">Express CD19, CD20</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">Express CD138, lose CD20</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">Antigen presentation</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">Antibody production</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">Circulating immune cells</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">Bone marrow-resident or tissue-based</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ENRICHMENT SERVICES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Services Overview</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Genestac's CD138+ Cell Enrichment Services
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              At <strong>Genestac Therapeutics</strong>, we provide GMP-grade isolation and purification of CD138+ plasma cells using advanced MACS and FACS technologies.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Monoclonal Antibody Discovery", desc: "Supports cell-line development and screening of candidate therapeutic monoclonal antibodies." },
              { title: "Myeloma & Plasma Disorder Research", desc: "Provides high-purity cells to investigate clonal profiles and multiple myeloma cellular pathogenesis." },
              { title: "Immune Profiling in Chronic Diseases", desc: "Facilitates longitudinal tracking of antibody-secreting cell populations in chronic infections and autoimmune diseases." }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50 space-y-4 hover:shadow-lg transition-all duration-300">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#001f3f] text-[#F5E6CC] font-bold text-xs">
                  {idx + 1}
                </span>
                <h3 className="text-xl font-bold font-montserrat text-slate-900">{item.title}</h3>
                <p className="text-sm leading-6 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONCLUSION ── */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-[#001f3f]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Conclusion</span>
          <p className="text-lg sm:text-xl leading-9 text-slate-700 max-w-3xl mx-auto">
            CD138+ plasma cells are central players in the body's defense system, providing antibody production and long-term immunity. Their role as a biomarker in multiple myeloma and potential in targeted therapies makes them highly valuable in medical research and treatment.
          </p>
          <p className="text-sm sm:text-base leading-8 text-slate-500 max-w-2xl mx-auto">
            At <strong>Genestac Therapeutics</strong>, we are committed to advancing precision isolation and profiling of plasma cells to help clinicians and researchers develop innovative solutions in immunotherapy, cancer diagnostics, and regenerative treatments.
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
                question: "Is CD138 only found in plasma cells?",
                answer: "While CD138 (Syndecan-1) is a primary marker for mature plasma cells, it is also expressed on epithelial cells, embryonic tissue, and some other cell types during specific developmental stages. However, in hematopoietic cells, it is highly restricted to plasma cells."
              },
              {
                question: "How is CD138 used in cancer diagnosis?",
                answer: "Because CD138 is abundantly expressed on malignant plasma cells in multiple myeloma, pathologists use immunohistochemistry (IHC) or flow cytometry targeting CD138 to identify, count, and analyze cancer cells, aiding in accurate diagnosis and therapy monitoring."
              },
              {
                question: "What role does CD138 play in multiple myeloma?",
                answer: "In multiple myeloma, CD138 acts as a receptor for growth factors like hepatocyte growth factor (HGF) and facilitates cell adhesion to the bone marrow microenvironment, promoting tumor cell growth, survival, and protection from chemotherapy."
              },
              {
                question: "How does Genestac support CD138+ research?",
                answer: "Genestac provides high-yield, GMP-grade isolation of viable CD138+ cells from bone marrow or peripheral blood samples using state-of-the-art Magnetic-Activated Cell Sorting (MACS) and Fluorescence-Activated Cell Sorting (FACS) platforms, supporting clinical trials and downstream therapeutic development."
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
            Access Precision Cell Enrichment Solutions
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Consult our experts at Genestac Therapeutics to design specialized CD138+ isolation protocols for research and clinical purposes.
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
