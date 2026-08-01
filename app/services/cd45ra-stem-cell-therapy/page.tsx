import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "CD45RA Marker Profiling & Naïve T Cell Enrichment Therapy",
  description:
    "Discover how the CD45RA marker unlocks advanced immunotherapy. Learn about naïve T cell enrichment for CAR-T and immune reset therapies at Genestac.",
};

export default function CD45RATherapyPage() {
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
              CD45RA T Cells: Immune Marker for Naïve and Memory T Cell Regulation
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">Precision Enrichment for Immunotherapy & CAR-T Applications</p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              CD45RA+ T cells form the backbone of immune system renewal — from naïve T cells to regulatory subsets — enabling safer, more effective clinical outcomes.
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

      {/* ── WHAT IS CD45RA & SVG ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">Introduction</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat mt-2">What is CD45RA?</h2>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                CD45RA is an isoform of the CD45 glycoprotein, a critical T cell marker widely expressed on naïve T lymphocytes. These CD45RA+ T cells are essential for initiating fresh immune responses. In immunophenotyping and flow cytometry, the presence of CD45RA helps classify immune cells into naïve, memory, and regulatory subsets, making it vital for both research and therapy.
              </p>
            </div>
            {/* T-Cell SVG */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
              <img src="/cd45ra.png" alt="CD45RA+ T Cells" />
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CLASSIFICATION & FUNCTION ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Classification</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">CD45RA+ T Cells: Classification and Function</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Naïve T Cells", desc: "CD45RA+ cells are primarily naïve T cells that respond to new antigens and drive primary immune defense.", icon: "fa-solid fa-seedling", color: "text-emerald-500" },
              { title: "Stem Cell-like Memory T Cells", desc: "A subset of CD45RA+ cells (T-SCM) combines stem cell-like renewal with long-term immune memory.", icon: "fa-solid fa-circle-nodes", color: "text-blue-500" },
              { title: "Regulatory T Cells (Tregs)", desc: "CD45RA expression marks naïve regulatory T cells (FoxP3 low), known for strong immunosuppressive activity.", icon: "fa-solid fa-scale-balanced", color: "text-teal-500" }
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

      {/* ── COMPARISON TABLE ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Comparison</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">CD45RA vs CD45RO: What is the Difference?</h2>
          </div>
          <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-xl bg-white">
            <table className="min-w-full divide-y divide-slate-100 text-sm sm:text-base text-left">
              <thead className="bg-[#001f3f] text-[#F5E6CC] font-montserrat">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">CD45RA+</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">CD45RO+</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {[["Naïve T Cells","Memory T Cells"],["Unexposed to antigens","Previously activated"],["High proliferative potential","Rapid response upon re-exposure"]].map(([l,r],i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{l}</td>
                    <td className="px-6 py-4 font-medium">{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── THERAPEUTIC APPLICATIONS ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Clinical Potential</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat">Therapeutic Applications of CD45RA+ Cells</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Immune Reset", desc: "CD45RA+ cells are used in immune reset therapies for autoimmune diseases like Multiple Sclerosis and Type 1 Diabetes." },
              { title: "Cancer Immunotherapy", desc: "Naïve CD45RA+ T cells are being applied in CAR-T cell therapy for enhanced persistence and expansion." },
              { title: "Regulatory T Cell Trials", desc: "CD45RA+ Tregs help prevent graft-versus-host disease (GvHD) after transplants." }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors space-y-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold">✓</span>
                <h3 className="text-xl font-bold font-montserrat">{item.title}</h3>
                <p className="text-sm leading-6 text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GENESTAC'S ROLE ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Our Expertise</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">Genestac's Role in CD45RA+ Enrichment</h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">At <strong>Genestac Therapeutics</strong>, we specialize in sorting and enrichment of CD45RA+ T cells using FACS and MACS under GMP conditions.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Naïve T Cell-Based Immunotherapy", desc: "Providing a fresh, unprimed T cell pool for next-generation cell therapy." },
              { title: "Regulatory T Cell Trials", desc: "Selecting naïve Tregs to prevent immune rejection and graft-vs-host complications." },
              { title: "Autologous & Allogeneic CAR-T", desc: "Enriching the optimal T cell starting population for scalable CAR-T manufacturing." }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50 space-y-3 hover:shadow-lg transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#001f3f] text-[#F5E6CC] font-bold text-xs">{idx + 1}</span>
                <h3 className="text-lg font-bold font-montserrat text-slate-900">{item.title}</h3>
                <p className="text-sm leading-6 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONCLUSION ── */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-[#001f3f]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Conclusion</span>
          <p className="text-lg sm:text-xl leading-9 text-slate-700">
            CD45RA+ cells form the backbone of immune system renewal, from naïve T cells to regulatory subsets. They hold promise in cancer immunotherapy, autoimmune control, and immune reconstitution. With Genestac's precision enrichment, CD45RA+ cells are enabling safer, more effective clinical outcomes.
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
              { question: "Why is CD45RA important in immunotherapy?", answer: "CD45RA distinguishes naïve T cells from memory cells. Naïve CD45RA+ T cells have high proliferative potential and can be engineered into CAR-T cells with superior long-term persistence, making them an ideal starting population for adoptive cell therapies." },
              { question: "Can CD45RA+ cells be used in autoimmune diseases?", answer: "Yes. Naïve CD45RA+ Tregs are increasingly used in immune tolerance protocols for conditions like Type 1 Diabetes and inflammatory bowel disease. Their robust suppressive function after activation provides durable disease control without generalized immunosuppression." },
              { question: "CD45RA vs CD45RO: What is the difference?", answer: "CD45RA is expressed on naïve, antigen-inexperienced T cells and naïve Tregs. CD45RO is expressed on activated or memory T cells that have already encountered an antigen. Together they allow immunophenotyping of the immune system's experience status." },
              { question: "How does Genestac use CD45RA+ enrichment?", answer: "We use FACS and MACS cell sorting to isolate high-purity CD45RA+ T cell populations from donor blood under GMP-certified conditions, supporting both research and direct clinical therapy manufacturing pipelines." }
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
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">Our specialists are ready to guide you through CD45RA+ enrichment protocols tailored to your clinical needs.</p>
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
