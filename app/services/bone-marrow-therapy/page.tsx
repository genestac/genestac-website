import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "Bone Marrow Therapy | Genestac Therapeutics",
  description:
    "Understanding Bone Marrow and Stem Cell Transplants at Genestac Therapeutics. Explore key functions, common disorders, diagnosis, and life-saving treatments.",
};

export default function BoneMarrowTherapyPage() {
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
              Bone Marrow: Understanding the Lifeline Within Your Bones
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">
              A concise overview for patients and caregivers
            </p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              Bone marrow is the foundation of your body's hematological and immune systems. Learn about its critical functions, common disorders, and modern transplant therapies.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] shadow-lg hover:bg-white hover:shadow-[0_8px_24px_rgba(245,230,204,0.4)] hover:-translate-y-0.5 transition-all duration-300">
                Book a Bone Marrow Consultation
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

      {/* ── WHAT IS BONE MARROW & ILLUSTRATION ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                What is Bone Marrow?
              </div>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                Bone marrow is a soft, spongy tissue found inside bones—especially in the hip and thigh bones. It plays a vital role in blood cell production, immunity, and fat storage. Understanding the functions of bone marrow helps us recognize its importance in maintaining health and treating conditions such as bone marrow cancer and other disorders.
              </p>
            </div>

            {/* Right: Bone Anatomy SVG Illustration */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 overflow-hidden">
              <img src="/bone_marrow.png" alt="Bone Marrow" />
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* ── TYPES OF BONE MARROW ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Classification</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Types of Bone Marrow
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Red Bone Marrow */}
            <div className="p-8 rounded-[2rem] border border-red-100 bg-red-50/30 space-y-4 hover:shadow-lg transition-shadow">
              <span className="inline-flex rounded-full bg-red-100 px-4 py-1 text-xs font-bold text-red-700 uppercase tracking-wider">
                Active Production
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-montserrat">Red Bone Marrow</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Produces red blood cells, white blood cells, and platelets. It is highly vascular and packed with hematopoietic stem cells responsible for generating billions of new blood cells daily.
              </p>
            </div>

            {/* Yellow Bone Marrow */}
            <div className="p-8 rounded-[2rem] border border-yellow-100 bg-yellow-50/20 space-y-4 hover:shadow-lg transition-shadow">
              <span className="inline-flex rounded-full bg-yellow-100 px-4 py-1 text-xs font-bold text-yellow-800 uppercase tracking-wider">
                Energy Storage
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-montserrat">Yellow Bone Marrow</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Stores fat cells and can convert back into red marrow when the body experiences severe blood loss or requires increased blood cell production.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── KEY FUNCTIONS ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5E6CC]">Biological Role</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-white">
              Key Functions of Bone Marrow
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Blood Cell Production",
                desc: "Generates red blood cells (oxygen transport), white blood cells (immune defense), and platelets (clotting).",
                icon: "fa-solid fa-droplet",
                color: "text-red-400"
              },
              {
                title: "Immune System Support",
                desc: "Produces infection-fighting white blood cells to strengthen immunity and guard against biological threats.",
                icon: "fa-solid fa-shield-halved",
                color: "text-emerald-400"
              },
              {
                title: "Fat Storage",
                desc: "Yellow marrow stores essential fats that act as an energy reserve, providing dynamic resources for the body.",
                icon: "fa-solid fa-battery-three-quarters",
                color: "text-yellow-400"
              }
            ].map((func, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl ${func.color}`}>
                  <i className={func.icon}></i>
                </div>
                <h3 className="text-xl font-bold font-montserrat text-white">{func.title}</h3>
                <p className="text-sm leading-6 text-slate-300">{func.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISORDERS & DIAGNOSIS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            
            {/* Disorders */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">Pathology</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">
                  Common Bone Marrow Disorders
                </h3>
                <p className="text-sm text-slate-500">Several bone marrow disorders can disrupt normal body function, including:</p>
              </div>
              <div className="space-y-4">
                {[
                  { title: "Leukemia", desc: "A blood cancer affecting white blood cells, causing them to multiply uncontrollably." },
                  { title: "Aplastic Anemia", desc: "A rare condition when bone marrow fails to produce enough healthy blood cells." },
                  { title: "Multiple Myeloma", desc: "A cancer of plasma cells within the bone marrow that impairs immune defense." }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnosis */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Clinical Evaluation</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">
                  How Are Bone Marrow Disorders Diagnosed?
                </h3>
                <p className="text-sm text-slate-500">Doctors use different tests to identify bone marrow disorders and bone marrow cancer:</p>
              </div>
              <div className="space-y-4">
                {[
                  { title: "Bone Marrow Biopsy", desc: "A small sample is extracted from the bone for detailed laboratory testing." },
                  { title: "Blood Tests", desc: "Used to evaluate cell counts (RBCs, WBCs, platelets) and detect cellular irregularities." },
                  { title: "Imaging Tests (MRI/CT)", desc: "Provide high-resolution detailed images of internal bone marrow structures." }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TREATMENTS ── */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Therapeutics</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Effective Treatments for Bone Marrow Disorders
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Bone Marrow Transplant",
                desc: "A procedure that replaces diseased marrow with healthy donor cells. It is often life-saving for patients with severe bone marrow cancer or blood disorders."
              },
              {
                title: "Chemotherapy & Radiation",
                desc: "Advanced therapeutic interventions targeted to destroy cancerous cells and restore healthy bone marrow functionality in conditions like leukemia."
              },
              {
                title: "Medications",
                desc: "Supportive pharmaceutical protocols and growth factors that help boost blood cell production, manage symptoms, and enhance immunity."
              }
            ].map((treat, idx) => (
              <div key={idx} className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50 space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#001f3f] text-[#F5E6CC] font-bold text-xs">
                  {idx + 1}
                </span>
                <h3 className="text-xl font-bold font-montserrat text-slate-900">{treat.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{treat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSPLANT ROLE & CONCLUSION ── */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-[#001f3f]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">
              The Life-Saving Role of Bone Marrow Transplant
            </h3>
            <p className="text-base sm:text-lg leading-8 text-slate-700">
              A bone marrow transplant is a critical therapy for patients with leukemia, lymphoma, and other severe conditions. By replacing damaged marrow with healthy stem cells, it restores normal blood cell production and gives patients a chance for long-term recovery.
            </p>
          </div>
          <div className="h-px bg-slate-200" />
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Conclusion</h4>
            <p className="text-sm sm:text-base leading-8 text-slate-600 font-medium">
              Bone marrow is the foundation of your body's blood and immune health. It produces essential blood cells, supports immunity, and stores fats. Knowing the functions of bone marrow, being aware of symptoms of bone marrow disorders, and understanding treatments such as bone marrow transplant can help safeguard your health.
            </p>
          </div>
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
                question: "Is a bone marrow transplant painful?",
                answer: "The collection of bone marrow from a donor or the receipt of the transplant itself is done under medical supervision using local or general anesthesia. While patients may experience some soreness, throbbing, or discomfort at the extraction or insertion site during recovery, pain is carefully managed with appropriate medications."
              },
              {
                question: "How long does recovery take after a bone marrow transplant?",
                answer: "Recovery time varies significantly depending on the patient's overall health and the specific transplant protocol. Generally, the initial engraftment process takes 2 to 4 weeks in the hospital, while full recovery of the immune system can take anywhere from several months to a year, requiring close clinical follow-up."
              },
              {
                question: "Who can be a bone marrow donor?",
                answer: "Healthy individuals between the ages of 18 and 60 who match the patient's Human Leukocyte Antigen (HLA) tissue type can be donors. Matches are most commonly found among close family members (like siblings), but can also be found through international registries of unrelated volunteer donors."
              },
              {
                question: "Are there risks involved in bone marrow transplant?",
                answer: "Yes, like any major cellular procedure, there are clinical risks. These can include infections due to temporary immune suppression, graft-versus-host disease (GVHD) where donor cells attack recipient tissues, or organ toxicity from preparatory treatments. Our medical team uses rigorous screening and advanced monitoring to minimize these risks."
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
