import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "PBSE Volume Reduction | Genestac Therapeutics",
  description:
    "Explore PBSE Volume Reduction Treatment at Genestac Therapeutics. Learn how cellular concentration optimizes stem cell therapy outcomes safely.",
};

export default function PBSEVolumeReductionPage() {
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
              PBSE Volume Reduction: Optimize Stem Cell Therapy for Better Clinical Outcomes
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">
              Maximizing Cellular Concentration and Transplant Efficiency
            </p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              A critical clinical process that concentrates collected stem cells, minimizing volume-related risks and boosting therapeutic viability.
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

      {/* ── WHAT IS PBSE VOLUME REDUCTION & ILLUSTRATION ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                What is PBSE Volume Reduction?
              </div>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                PBSE Volume Reduction is a critical process in stem cell therapy that involves concentrating Peripheral Blood Stem Cells (PBSC) collected from the bloodstream. This technique improves therapeutic efficiency by reducing plasma and red blood cell content, facilitating easier storage and infusion in regenerative medicine and hematological treatments.
              </p>
            </div>

            {/* Right: Centrifugation Separating SVG */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 overflow-hidden">
              <svg className="w-full max-w-[400px] h-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Centrifuge Tube */}
                <rect x="160" y="50" width="80" height="240" rx="40" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="4" />
                <path d="M160 250 L200 330 L240 250 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="4" />
                
                {/* Plasma Layer (Top) */}
                <path d="M162 90 L238 90 L238 170 L162 170 Z" fill="#FEF08A" fillOpacity="0.7" />
                <text x="200" y="130" textAnchor="middle" fill="#854D0E" fontSize="10" fontWeight="bold" fontFamily="sans-serif">PLASMA</text>
                
                {/* Buffy Coat / Stem Cell Concentrate (Middle) */}
                <path d="M162 170 L238 170 L238 185 L162 185 Z" fill="#E2E8F0" />
                <rect x="162" y="170" width="76" height="15" fill="#3B82F6" fillOpacity="0.4" />
                <text x="200" y="180" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">CD34+ STEM CELLS</text>
                
                {/* RBC Layer (Bottom) */}
                <path d="M162 185 L238 185 L238 250 L200 324 L162 250 Z" fill="#FCA5A5" fillOpacity="0.8" />
                <text x="200" y="240" textAnchor="middle" fill="#B91C1C" fontSize="10" fontWeight="bold" fontFamily="sans-serif">RED BLOOD CELLS</text>
                
                {/* Separation Arrows */}
                <path d="M280 140 L300 140 L300 178 L315 178" stroke="#3B82F6" strokeWidth="2" fill="none" strokeDasharray="3 3" />
                <polygon points="315,175 325,178 315,181" fill="#3B82F6" />
                <text x="330" y="181" fill="#1D4ED8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Extract</text>
              </svg>
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* ── IMPORTANCE IN STEM CELL THERAPY ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Why It Matters</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Importance of PBSE Volume Reduction in Stem Cell Therapy
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            
            {/* Patient Safety */}
            <div className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50 space-y-4 hover:shadow-lg transition-shadow">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 text-lg">
                <i className="fa-solid fa-heart-pulse"></i>
              </span>
              <h3 className="text-xl font-bold font-montserrat text-slate-900">Patient Safety</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                PBSE Volume Reduction minimizes volume overload risk, particularly in pediatric and cardiac patients.
              </p>
            </div>

            {/* Efficient Infusion */}
            <div className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50 space-y-4 hover:shadow-lg transition-shadow">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 text-lg">
                <i className="fa-solid fa-bolt"></i>
              </span>
              <h3 className="text-xl font-bold font-montserrat text-slate-900">Efficient Infusion</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Concentrated CD34+ cells improve transplantation success and reduce infusion time.
              </p>
            </div>

            {/* Storage Benefits */}
            <div className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50 space-y-4 hover:shadow-lg transition-shadow">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 text-lg">
                <i className="fa-solid fa-box-archive"></i>
              </span>
              <h3 className="text-xl font-bold font-montserrat text-slate-900">Storage Benefits</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Smaller volume enhances cryopreservation in stem cell banks.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW DOES IT WORK & CLINICAL APPLICATIONS ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            
            {/* How It Works */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Mechanism</span>
                <h3 className="text-3xl font-bold font-montserrat">How Does PBSE Volume Reduction Work?</h3>
              </div>
              <ul className="space-y-6">
                {[
                  { title: "Centrifugation", desc: "High-speed separation of stem cells from plasma and red cells based on density." },
                  { title: "Automated Systems", desc: "Devices such as Sepax or COBE 2991 provide sterile, closed-system processing." },
                  { title: "Selective Removal", desc: "Non-target cells are removed to yield a concentrated product rich in CD34+ hematopoietic stem cells." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinical Applications */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Applications</span>
                <h3 className="text-3xl font-bold font-montserrat">Clinical Applications</h3>
              </div>
              <ul className="space-y-6">
                {[
                  { title: "Pediatric Transplants", desc: "Safely administer reduced-volume stem cells to young patients." },
                  { title: "Matched Unrelated Donor (MUD) Transplants", desc: "Ensures cell integrity before cryopreservation." },
                  { title: "ABO Incompatibility", desc: "Reduces transfusion reactions by RBC depletion." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold shrink-0">
                      ✓
                    </span>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── PROCESS TIMELINE ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Our PBSE Volume Reduction Process at Genestac
            </h2>
          </div>
          <div className="relative pl-8 border-l border-slate-200 space-y-8">
            {[
              { step: "Patient Evaluation", desc: "Expert assessment of suitability for PBSE Volume Reduction." },
              { step: "Apheresis Collection", desc: "Peripheral blood stem cells collected safely." },
              { step: "Advanced Processing", desc: "GMP-compliant centrifugation and automated systems for optimal results." },
              { step: "Quality Assurance", desc: "Viability and CD34+ cell count verified before application." },
              { step: "Administration", desc: "The concentrated product administered based on the patient's condition." }
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
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Conclusion</span>
          <p className="text-lg sm:text-xl leading-9 text-slate-700 max-w-3xl mx-auto">
            PBSE Volume Reduction plays a vital role in enhancing the safety and success of stem cell therapy, especially in regenerative medicine, pediatric transplants, and ABO mismatch cases.
          </p>
          <p className="text-sm sm:text-base leading-8 text-slate-500 max-w-2xl mx-auto">
            Genestac Therapeutics follows validated techniques and strict quality control to ensure patient safety and optimal therapeutic outcomes in PBSE Volume Reduction procedures.
          </p>
        </div>
      </section>

      {/* ── FAQs SECTION ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
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
                question: "Why is PBSE Volume Reduction important in stem cell therapy?",
                answer: "Volume reduction is critical to prevent volume overload (especially in children or patients with cardiac complications), reduce the amount of unwanted cells or plasma proteins, and concentrate the therapeutically active CD34+ stem cells to ensure a highly efficient, targeted dose."
              },
              {
                question: "Does PBSE Volume Reduction affect stem cell quality?",
                answer: "When performed using validated, GMP-compliant automated systems (such as Sepax or COBE 2991), the procedure does not damage stem cells. It preserves cell viability and ensures that the therapeutic cell population remains intact and potent."
              },
              {
                question: "Is PBSE Volume Reduction mandatory for all PBSC procedures?",
                answer: "While highly recommended for patient safety, it is particularly mandatory in pediatric transplants, cases involving ABO mismatch (to prevent hemolytic reactions), and when storing cells in stem cell cryobanks where storage space and freezing protocols require minimized volume."
              }
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-slate-200 bg-white p-6 [&_summary::-webkit-details-marker]:hidden transition-all duration-300 hover:bg-slate-100/50"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900">
                  <h3 className="text-base sm:text-lg font-bold font-montserrat pr-4">
                    {faq.question}
                  </h3>
                  <span className="shrink-0 rounded-full bg-slate-50 border border-slate-100 p-1.5 text-slate-900 shadow-sm group-open:-rotate-180 transition-transform duration-300">
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
