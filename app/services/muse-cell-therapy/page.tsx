import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "Muse Cell Therapy | Genestac Therapeutics",
  description:
    "Discover Muse Cell Therapy at Genestac Therapeutics. Learn about Multilineage-differentiating Stress-Enduring (Muse) cells, their clinical functions, and applications.",
};

export default function MuseCellTherapyPage() {
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
              Muse Cells: The Future of Regenerative Medicine
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">
              Stress-Enduring Multilineage-Differentiating Stem Cells
            </p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              Utilizing a rare, naturally occurring population of stress-tolerant pluripotent stem cells to migrate to damaged tissue, differentiate into target cell types, and support safe organ repair.
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

      {/* ── WHAT ARE MUSE CELLS & ILLUSTRATION ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                What are Muse Cells?
              </div>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                Muse cells (Multilineage-differentiating Stress-Enduring cells) are a rare population of adult stem cells found in bone marrow, peripheral blood, and connective tissues. These unique stem cells naturally repair damaged tissues, making them a powerful option for regenerative medicine and stem cell therapy. Unlike many pluripotent stem cells, Muse cells can differentiate into various cell types without forming tumors, ensuring safety in clinical use.
              </p>
            </div>

            {/* Right: Pluripotent Muse Cell SVG Animation */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 overflow-hidden">
              <svg className="w-full max-w-[400px] h-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="museGrad" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(45)">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>

                {/* Shield / Stress Endurance Circle */}
                <circle cx="200" cy="200" r="85" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="6 4" className="animate-spin duration-[10s]" />
                
                {/* Central Muse Cell */}
                <circle cx="200" cy="200" r="50" fill="url(#museGrad)" stroke="#10B981" strokeWidth="4" />
                <circle cx="200" cy="200" r="35" fill="#34D399" fillOpacity="0.2" />
                <circle cx="185" cy="185" r="10" fill="#FFF" fillOpacity="0.5" />
                
                {/* Differentiation Paths (Radiating out) */}
                <g className="animate-pulse">
                  {/* To Neuron (Ectoderm) */}
                  <path d="M200 135 L200 90" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="200" cy="80" r="15" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                  <path d="M195 80 L205 80 M200 75 L200 85" stroke="#D97706" strokeWidth="1.5" />
                  
                  {/* To Muscle/Heart (Mesoderm) */}
                  <path d="M245 225 L290 250" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="305" cy="260" r="15" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
                  <path d="M297 260 C301 254, 309 254, 313 260" stroke="#DC2626" strokeWidth="1.5" fill="none" />
                  
                  {/* To Liver/Organ (Endoderm) */}
                  <path d="M155 225 L110 250" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="95" cy="260" r="15" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
                  <circle cx="95" cy="260" r="6" fill="#2563EB" />
                </g>
                
                {/* Labels */}
                <text x="200" y="225" textAnchor="middle" fill="#047857" fontSize="8" fontWeight="black" fontFamily="sans-serif">MUSE CELL</text>
                <text x="200" y="55" textAnchor="middle" fill="#B45309" fontSize="9" fontWeight="bold" fontFamily="sans-serif">ECTODERM</text>
                <text x="345" y="278" textAnchor="middle" fill="#B91C1C" fontSize="9" fontWeight="bold" fontFamily="sans-serif">MESODERM</text>
                <text x="55" y="278" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">ENDODERM</text>
              </svg>
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* ── FUNCTIONS OF MUSE CELLS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Core Functions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Functions of Muse Cells
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Tissue Regeneration",
                desc: "Muse cells can become neurons, liver cells, skin cells, and more—helping repair organs and restore function.",
                icon: "fa-solid fa-arrows-spin",
                color: "text-emerald-500"
              },
              {
                title: "Stress Resistance",
                desc: "These cells thrive in hostile conditions such as oxidative stress and inflammation, making them highly effective in damaged tissues.",
                icon: "fa-solid fa-shield-halved",
                color: "text-blue-500"
              },
              {
                title: "Anti-Inflammatory Action",
                desc: "Muse cells reduce immune overreaction, creating a supportive and calming environment for natural healing.",
                icon: "fa-solid fa-clover",
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

      {/* ── WHY MUSE CELL THERAPY MATTERS ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Patient Advantage</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-white">
              Why Muse Cell Therapy Matters
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Safe for Patients",
                desc: "Muse cells are non-tumorigenic and carry minimal risk of rejection, unlike many other stem cells."
              },
              {
                title: "High Differentiation Power",
                desc: "Capable of becoming cells of all three germ layers, expanding their role in cell-based therapies."
              },
              {
                title: "Regenerative Potential",
                desc: "Clinical research shows promise in repairing heart tissue, nerve damage, and skin injuries."
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
                  How Muse Cells are Collected and Processed
                </h3>
              </div>
              <ul className="space-y-6">
                {[
                  { title: "Collection", desc: "Isolated from bone marrow, blood, or connective tissue using advanced sorting techniques." },
                  { title: "Expansion", desc: "Cultured under controlled lab conditions to increase their number without losing potency." },
                  { title: "Quality Testing", desc: "Assessed for purity, viability, and differentiation capacity before medical use." }
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
                  Clinical Applications of Muse Cell Therapy
                </h3>
              </div>
              <ul className="space-y-6">
                {[
                  { title: "Neurological Disorders", desc: "Potential to treat stroke, brain injuries, and neurodegenerative diseases." },
                  { title: "Cardiac Regeneration", desc: "Being studied to restore damaged heart muscle tissue after heart attacks." },
                  { title: "Skin & Tissue Healing", desc: "Promotes faster recovery and reconstruction from burns, wounds, and chronic ulcers." }
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
              Steps in Muse Cell Therapy Preparation
            </h2>
          </div>
          <div className="relative pl-8 border-l border-slate-200 space-y-8">
            {[
              { step: "Donor Screening", desc: "Healthy donors are evaluated for safe and optimal Muse cell yield." },
              { step: "Cell Isolation", desc: "Muse cells are separated and purified from collected samples." },
              { step: "Expansion & Activation", desc: "Cells are multiplied in labs under GMP standards for therapeutic use." },
              { step: "Administration", desc: "Delivered to patients via infusion or targeted injection under medical supervision." }
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

      {/* ── CONCLUSION ── */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-[#001f3f]/5 border-t border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-lg sm:text-xl leading-9 text-slate-700 max-w-3xl mx-auto">
            Muse cells are redefining the future of stem cell therapy with their unique ability to regenerate tissues, resist stress, and promote safe healing. Their role in regenerative medicine continues to grow as new research unfolds.
          </p>
          <p className="text-sm sm:text-base leading-8 text-slate-600 font-medium max-w-2xl mx-auto">
            At <strong>Genestac Therapeutics</strong>, we are pioneering innovative therapies with Muse cells to provide patients with advanced, safe, and effective cell-based treatments.
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
                question: "Are Muse cells safe for clinical use?",
                answer: "Yes. Unlike embryonic stem cells or induced pluripotent stem (iPS) cells, Muse cells are naturally occurring adult pluripotent stem cells and do not form tumors (non-tumorigenic) when administered to patients. Additionally, because they can be sourced autologously (from the patient's own body), there is no risk of rejection."
              },
              {
                question: "How do Muse cells differ from other stem cells?",
                answer: "While standard mesenchymal stem cells (MSCs) have limited differentiation capacity, Muse cells are pluripotent — meaning they can differentiate into cells of all three germ layers (ectoderm, endoderm, mesoderm) to repair various organs and tissues. They are also uniquely 'stress-enduring,' allowing them to survive and function in harsh, inflamed tissue environments."
              },
              {
                question: "Where are Muse cells collected from?",
                answer: "Muse cells are naturally present in the body in small numbers. They are primarily collected and isolated from the bone marrow, peripheral blood mononuclear cells, or connective tissues (such as the dermis) using advanced stress-selection laboratory protocols."
              },
              {
                question: "What are the key applications of Muse cell therapy?",
                answer: "Due to their ability to differentiate into neurons, cardiomyocytes, hepatocytes, and epithelial cells, key applications include treating neurological disorders (stroke, spinal cord injury), cardiovascular regeneration (infarction repair), liver disease, and advanced skin/tissue healing for chronic ulcers and severe wounds."
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
