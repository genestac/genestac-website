import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "Advanced Gene Therapy & CRISPR-Cas9 | Genestac Therapeutics",
  description: "Advanced Gene Therapy and CRISPR-Cas9 Gene Editing at Genestac Therapeutics. Precision genome correction for genetic disorders, cancers, and inherited conditions.",
};

export default function AdvancedGeneTherapyPage() {
  return (
    <main className="bg-white overflow-x-hidden min-h-screen pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── HERO ── */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] animate-pulse" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Our Services</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white font-montserrat">
              Advanced Gene Therapy & CRISPR-Cas9 Gene Editing
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">Correcting Health at the Genomic Level</p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              Harnessing the power of CRISPR-Cas9 and advanced gene delivery vectors to precisely cut, repair, or replace DNA sequences — opening new frontiers in treating genetic disorders, cancers, and inherited conditions.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] shadow-lg hover:bg-white hover:-translate-y-0.5 transition-all duration-300">
                Consult CRISPR Experts
              </AppointmentButton>
              <a href="https://wa.me/919971114121" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300">
                <i className="fa-brands fa-whatsapp text-lg text-emerald-400"></i>WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS CRISPR-CAS9 & SVG ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-indigo-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">What is CRISPR-Cas9?</div>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                CRISPR-Cas9 is a revolutionary gene editing technology derived from a bacterial immune system. It enables scientists to precisely cut, remove, or replace DNA sequences in living organisms. CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats) and the Cas9 enzyme work together as molecular scissors, making genome editing accurate and efficient for research and precision medicine.
              </p>
            </div>
            {/* DNA Scissors SVG */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
              <svg className="w-full max-w-[400px] h-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="dnaGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" /><stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                  <linearGradient id="dnaGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
                {/* DNA double helix - left strand */}
                <path d="M130 40 C150 80, 110 120, 130 160 C150 200, 110 240, 130 280 C150 320, 110 360, 130 390" stroke="url(#dnaGrad1)" strokeWidth="5" fill="none" strokeLinecap="round" />
                {/* DNA double helix - right strand */}
                <path d="M200 40 C180 80, 220 120, 200 160 C180 200, 220 240, 200 280 C180 320, 220 360, 200 390" stroke="url(#dnaGrad2)" strokeWidth="5" fill="none" strokeLinecap="round" />
                {/* Base pair rungs */}
                {[70, 105, 140, 175, 210, 245, 280, 315, 350].map((y, i) => (
                  <line key={i} x1="133" y1={y} x2="197" y2={y} stroke={i % 2 === 0 ? "#818CF8" : "#34D399"} strokeWidth="3" strokeLinecap="round" />
                ))}
                {/* CUT SITE - scissors at middle */}
                <line x1="100" y1="205" x2="240" y2="205" stroke="#EF4444" strokeWidth="2" strokeDasharray="6 3" />
                {/* Scissors shape */}
                <circle cx="270" cy="195" r="10" fill="none" stroke="#EF4444" strokeWidth="2.5" />
                <circle cx="270" cy="215" r="10" fill="none" stroke="#EF4444" strokeWidth="2.5" />
                <path d="M278 200 L310 180" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                <path d="M278 210 L310 230" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                {/* Guide RNA label */}
                <rect x="290" y="155" width="90" height="22" rx="6" fill="#4F46E5" fillOpacity="0.1" />
                <text x="335" y="170" textAnchor="middle" fill="#4338CA" fontSize="9" fontWeight="bold" fontFamily="sans-serif">GUIDE RNA (gRNA)</text>
                {/* Cas9 label */}
                <rect x="290" y="230" width="80" height="22" rx="6" fill="#EF4444" fillOpacity="0.1" />
                <text x="330" y="245" textAnchor="middle" fill="#B91C1C" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Cas9 ENZYME</text>
                <text x="165" y="375" textAnchor="middle" fill="#4338CA" fontSize="10" fontWeight="bold" fontFamily="sans-serif">DNA DOUBLE HELIX</text>
              </svg>
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW CRISPR WORKS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Mechanism</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">How CRISPR-Cas9 Works in Genome Editing</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Guide RNA (gRNA)", desc: "Custom RNA guides Cas9 to the exact DNA sequence for editing with near-perfect precision.", icon: "fa-solid fa-map-pin", color: "text-indigo-500" },
              { title: "Cas9 Enzyme", desc: "Cuts the target site with high accuracy, creating a precise double-strand break in the DNA.", icon: "fa-solid fa-scissors", color: "text-red-500" },
              { title: "DNA Repair", desc: "The cell repairs the DNA by disabling or inserting a new gene sequence at the cut site.", icon: "fa-solid fa-wrench", color: "text-emerald-500" }
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

      {/* ── GENE THERAPY OVERVIEW ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Foundation</span>
                <h3 className="text-3xl font-bold font-montserrat">What is Gene Therapy?</h3>
              </div>
              <p className="text-slate-300 leading-8">
                Gene therapy is an advanced medical approach that modifies the genetic material in a patient's cells to treat or prevent disease. It can be used as a genetic treatment for inherited conditions, cancers, and other complex disorders by replacing faulty DNA, silencing harmful genes, or introducing new ones to restore health.
              </p>
              <ul className="space-y-4">
                {[
                  { title: "Gene Replacement", desc: "Introducing healthy genes to replace defective ones." },
                  { title: "Gene Editing", desc: "Using CRISPR and other genome editing tools for precise modifications." },
                  { title: "Gene Silencing", desc: "Shutting down harmful genes linked to cancer or genetic disorders." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-6">
                    <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0">→</span>
                    <span><strong className="text-white">{item.title}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Delivery</span>
                <h3 className="text-3xl font-bold font-montserrat">Delivery Methods in Gene Therapy</h3>
              </div>
              <div className="space-y-5">
                {[
                  { title: "Viral Vectors", desc: "Modified AAV or lentiviruses used for DNA therapy — highly efficient at delivering genetic payload to target cells.", icon: "fa-solid fa-virus" },
                  { title: "Non-Viral Approaches", desc: "Safer options like electroporation or lipid nanoparticles — minimizing immune response while enabling broad tissue delivery.", icon: "fa-solid fa-circle-dot" }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-3">
                      <i className={`${item.icon} text-emerald-400`}></i>
                      <h4 className="font-bold text-white">{item.title}</h4>
                    </div>
                    <p className="text-sm text-slate-300 leading-6">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── APPLICATIONS ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Clinical Use</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">Applications of CRISPR & Gene Therapy</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Genetic Disease Treatment", desc: "Correcting mutations causing sickle cell anemia, cystic fibrosis, and Huntington's disease.", color: "border-indigo-200 bg-indigo-50" },
              { title: "Cancer Research", desc: "Disabling oncogenes and enhancing immunotherapy — powering next-gen CAR-T cell platforms.", color: "border-red-200 bg-red-50" },
              { title: "Agriculture", desc: "Producing pest-resistant, nutrient-rich crops with CRISPR technology.", color: "border-emerald-200 bg-emerald-50" },
              { title: "Drug Discovery", desc: "Identifying new drug targets and testing gene function in cellular and animal models.", color: "border-amber-200 bg-amber-50" }
            ].map((item, idx) => (
              <div key={idx} className={`p-6 rounded-[2rem] border ${item.color} space-y-3 hover:shadow-lg transition-shadow`}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm text-[#001f3f] font-bold text-xs">{idx + 1}</span>
                <h3 className="text-base font-bold font-montserrat text-slate-900">{item.title}</h3>
                <p className="text-xs leading-5 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GENESTAC'S EXPERTISE & ADVANTAGES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Our Services</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">Genestac's Expertise in CRISPR Therapy</h3>
                <p className="text-sm text-slate-500">At <strong>Genestac Therapeutics</strong>, we provide advanced support for CRISPR-Cas9 therapy and research projects:</p>
              </div>
              <ul className="space-y-4">
                {["Design & synthesis of guide RNA sequences","Optimized Cas9 delivery methods","Cell transfection and gene knockout validation","Phenotypic and genomic analysis"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-slate-700">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{i+1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Benefits</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">Advantages of CRISPR-Cas9 Gene Editing</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { title: "Precision", desc: "Highly accurate edits with minimal off-target risks." },
                  { title: "Efficiency", desc: "Faster and cost-effective compared to TALENs or ZFNs." },
                  { title: "Versatility", desc: "Applicable across humans, plants, and animals." }
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

      {/* ── CHALLENGES ── */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-[#001f3f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Considerations</span>
            <h2 className="text-3xl font-extrabold font-montserrat">Challenges & Ethical Considerations</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Off-target Effects", desc: "Unintended edits may occur at similar sequences — minimized through advanced high-fidelity Cas9 variants and rigorous screening.", color: "border-amber-500/30" },
              { title: "Germline Editing", desc: "Raises ethical debates when applied to embryos — strict governance frameworks guide responsible research use.", color: "border-red-500/30" },
              { title: "Regulations", desc: "Clinical use requires strict oversight and global compliance with evolving regulatory frameworks.", color: "border-blue-500/30" }
            ].map((item, idx) => (
              <div key={idx} className={`p-6 rounded-2xl bg-white/5 border ${item.color} space-y-3`}>
                <h4 className="font-bold text-white font-montserrat">{item.title}</h4>
                <p className="text-sm leading-6 text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONCLUSION ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Conclusion</span>
          <p className="text-lg sm:text-xl leading-9 text-slate-700">
            CRISPR-Cas9 is transforming genetic engineering by making gene editing faster, cheaper, and highly accurate. Gene therapy represents the future of genetic treatment, offering hope to patients with previously incurable disorders.
          </p>
          <p className="text-sm sm:text-base leading-8 text-slate-600 max-w-2xl mx-auto">
            With responsible use and strong regulatory support, <strong>Genestac Therapeutics</strong> is at the forefront of this breakthrough technology — guiding your journey from research to real-world solutions.
          </p>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">FAQs on CRISPR Gene Editing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { question: "Is CRISPR-Cas9 safe?", answer: "CRISPR-Cas9 has an excellent safety profile when used with high-fidelity Cas9 variants and thorough off-target analysis. Clinical trials for sickle cell disease and beta-thalassemia have demonstrated strong safety results. Risks are further minimized through rigorous preclinical validation before any patient use." },
              { question: "How does CRISPR differ from traditional gene therapy?", answer: "Traditional gene therapy typically adds a functional copy of a gene without altering the existing DNA. CRISPR-Cas9, by contrast, directly edits the genome — cutting out, repairing, or replacing the faulty sequence at its exact chromosomal location, making it far more precise and versatile." },
              { question: "Can CRISPR be used in humans?", answer: "Yes. CRISPR-Cas9 has already been approved for clinical use in sickle cell disease (Casgevy by CRISPR Therapeutics / Vertex, FDA approved in 2023) and multiple clinical trials are underway for blood disorders, cancers, and inherited conditions. Its application in human therapy is rapidly advancing." },
              { question: "Is gene therapy permanent?", answer: "For many genetic disorders, a successful gene therapy administration is designed to provide long-lasting or even lifelong therapeutic benefit — especially when stem cells are modified, as these self-renew throughout the patient's life. The permanence varies by condition and delivery approach." },
              { question: "Is gene therapy safe?", answer: "Modern gene therapy uses non-replicating, replication-deficient vectors that cannot spread or cause infection. Safety is monitored through rigorous preclinical trials, dose escalation studies, and long-term patient follow-up. At Genestac, safety protocols meet GMP and ICH guidelines." },
              { question: "How is gene therapy different from stem cell therapy?", answer: "Stem cell therapy replaces or supplements damaged cells with healthy ones. Gene therapy modifies the genetic instructions within existing or transplanted cells. Both approaches are often complementary — gene-corrected stem cells (ex-vivo gene therapy) are one of the most powerful combinations in modern medicine." }
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
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">Connect with our CRISPR and gene therapy specialists at Genestac Therapeutics for expert guidance on your condition.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white hover:-translate-y-0.5 transition-all shadow-lg">
              Consult CRISPR Experts
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
