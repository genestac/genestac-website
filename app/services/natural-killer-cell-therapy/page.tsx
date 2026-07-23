import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "NK Cell Therapy | Genestac Therapeutics",
  description:
    "Explore Natural Killer (NK) Cell Therapy at Genestac Therapeutics. Discover functions, importance, collection, processing, and clinical applications.",
};

export default function NKCellTherapyPage() {
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
              NK Cells: The Frontline Warriors of Our Immune System
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">
              Immediate Innate Immunological Defense
            </p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              Harnessing Natural Killer cells to target and eliminate damaged, dysfunctional, or virus-infected cells and strengthen your body's innate immune surveillance.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] shadow-lg hover:bg-white hover:shadow-[0_8px_24px_rgba(245,230,204,0.4)] hover:-translate-y-0.5 transition-all duration-300">
                Book an Appointment
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

      {/* ── WHAT ARE NK CELLS & ILLUSTRATION ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                What are NK Cells?
              </div>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                NK cells, also known as natural killer cells, are powerful lymphocytes that play a critical role in the body's innate immune defense. Unlike many other immune cells, NK cells can instantly recognize and destroy virus-infected and cancerous cells without prior activation. Acting as the body's first line of defense, they protect us from infections, tumors, and immune imbalances.
              </p>
            </div>

            {/* Right: NK Cell Attack SVG Animation */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 overflow-hidden">
              <img src="/nk.png" alt="NK Cell Attack" />
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* ── FUNCTIONS OF NK CELLS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Actions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Functions of NK Cells
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Targeting Infected Cells",
                desc: "NK cells detect and kill virus-infected or stressed cells by releasing cytotoxic granules.",
                icon: "fa-solid fa-virus-slash",
                color: "text-emerald-500"
              },
              {
                title: "Cancer Immunity",
                desc: "Natural killer cells act as surveillance agents, eliminating tumor cells before they spread.",
                icon: "fa-solid fa-dna",
                color: "text-blue-500"
              },
              {
                title: "Immune System Regulation",
                desc: "NK cells release cytokines like IFN-γ that enhance overall immune response.",
                icon: "fa-solid fa-arrows-spin",
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

      {/* ── IMPORTANCE OF NK CELL THERAPY ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Significance</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-white">
              Importance of NK Cell Therapy
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Immunotherapy Potential",
                desc: "NK cell therapy is being studied for cancer, viral infections, and immune disorders."
              },
              {
                title: "Fewer Side Effects",
                desc: "Compared to some treatments, NK cell-based therapies generally have lower adverse reactions."
              },
              {
                title: "Personalized Medicine",
                desc: "NK cells can be expanded and activated in labs to create tailored therapies for patients."
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

      {/* ── COLLECTION & PROCESSING AND CLINICAL APPLICATIONS ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            
            {/* Sourcing & Processing */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Methodology</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">
                  How are NK Cells Collected and Processed?
                </h3>
              </div>
              <ul className="space-y-6">
                {[
                  { title: "Apheresis", desc: "Blood is collected and NK cells are separated using advanced sorting techniques." },
                  { title: "Expansion & Activation", desc: "Cytokines such as IL-2 or IL-15 are used to boost NK cell numbers and activity." },
                  { title: "Quality Testing", desc: "NK cells are tested for purity, viability, and potency before clinical use." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 text-sm font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinical Applications */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Medical Target</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">
                  Clinical Applications of NK Cell Therapy
                </h3>
              </div>
              <ul className="space-y-6">
                {[
                  { title: "Blood Cancers", desc: "Patients with leukemia or lymphoma may benefit from NK cell infusions to eliminate residual cancer cells." },
                  { title: "Solid Tumors", desc: "Ongoing studies explore NK cells for cancers like breast, lung, and melanoma." },
                  { title: "Viral Infections", desc: "NK cells provide immune support against infections such as cytomegalovirus (CMV)." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-bold shrink-0">
                      ✓
                    </span>
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

      {/* ── STEPS IN PREPARATION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Steps in NK Cell Therapy Preparation
            </h2>
          </div>
          <div className="relative pl-8 border-l border-slate-200 space-y-8">
            {[
              { step: "Donor Selection", desc: "Healthy donors are chosen for optimal NK cell yield." },
              { step: "Collection", desc: "NK cells are isolated through leukapheresis." },
              { step: "Processing", desc: "Cells are purified, expanded, and activated in GMP-certified labs." },
              { step: "Administration", desc: "NK cells are infused into patients under clinical supervision." }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-[45px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#001f3f] text-[#F5E6CC] font-bold text-xs shadow-md group-hover:scale-110 transition-transform duration-300">
                  {idx + 1}
                </span>
                <h4 className="text-lg font-bold text-slate-900 mb-1">{item.step}</h4>
                <p className="text-sm leading-6 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUMMARY & FOCUS ── */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-[#001f3f]/5 border-t border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-lg sm:text-xl leading-9 text-slate-700 max-w-3xl mx-auto">
            NK cells (natural killer cells) are essential immune defenders with revolutionary potential in therapy. With advancements in NK cell research, new hope emerges for cancer treatment and immune health.
          </p>
          <p className="text-sm sm:text-base leading-8 text-slate-600 font-medium max-w-2xl mx-auto">
            At <strong>Genestac Therapeutics</strong>, we are dedicated to advancing NK cell therapy and improving patient outcomes through cutting-edge research and personalized solutions.
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
                question: "What makes NK cells different from other immune cells?",
                answer: "Unlike T-cells or B-cells, Natural Killer (NK) cells do not require prior exposure or activation by specific antigens. They can immediately identify and destroy abnormal cells (such as infected or tumor cells) on first contact, acting as the body's rapid-response frontline surveillance."
              },
              {
                question: "Is NK cell therapy safe?",
                answer: "Yes, NK cell therapy has a very high safety profile. Whether using autologous cells (your own) or closely matched donor cells, clinical trials show that NK cell infusions are well-tolerated with a very low risk of severe side effects such as graft-versus-host disease (GVHD) or severe cytokine storms."
              },
              {
                question: "Can NK cells be used for all cancer types?",
                answer: "NK cells show promising efficacy in blood cancers (leukemia, lymphoma) and various solid tumors (like breast, lung, and ovarian cancers). Ongoing clinical trials are expanding their application to more cancer types, both as standalone therapies and in combination with other treatments."
              },
              {
                question: "How are NK cells expanded outside the body?",
                answer: "NK cells are isolated from blood using apheresis, then placed in specialized culture systems containing supportive cytokines (like IL-2 or IL-15). Over a period of 10 to 14 days, the cells multiply exponentially and are activated to enhance their cytotoxic capabilities before being prepared for patient infusion."
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
            Start Your Healing Journey Today
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Take the first step towards recovery with our expert team at Genestac Therapeutics — leaders in regenerative medicine.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white hover:-translate-y-0.5 transition-all duration-300 shadow-lg">
              Book a Free Appointment
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
