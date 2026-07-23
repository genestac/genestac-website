import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "PBSE Therapy | Genestac Therapeutics",
  description:
    "Peripheral Blood Stem Cell Expansion (PBSE) Therapy at Genestac Therapeutics — an advanced regenerative treatment designed to enhance outcomes by isolating and multiplying peripheral blood stem cells.",
};

export default function PBSETherapyPage() {
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
              Peripheral Blood Stem Cell Expansion (PBSE) Therapy
            </h1>
            <p className="text-lg sm:text-xl text-[#F5E6CC] font-semibold tracking-wide">
              Advanced Cellular Multiplicative Regeneration
            </p>
            <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              An advanced clinical protocol isolating, enriching, and multiplying your body's own circulating stem cells to deliver a concentrated therapeutic dose for optimal healing.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] shadow-lg hover:bg-white hover:shadow-[0_8px_24px_rgba(245,230,204,0.4)] hover:-translate-y-0.5 transition-all duration-300">
                Book a PBSE Consultation
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

      {/* ── INTRODUCTION & ILLUSTRATION ── */}
      <section className="py-16 bg-gray-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Introduction to PBSE
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight font-montserrat">
                Harnessing Advanced Regenerative Medicine
              </h2>
              <p className="text-base sm:text-lg leading-8 text-slate-600">
                Peripheral Blood Stem Cell Expansion (PBSE) is an advanced stem cell therapy designed to enhance regenerative medicine outcomes. By increasing the number of stem cells collected from a patient's peripheral blood, PBSE therapy boosts the effectiveness of treatments for chronic conditions, injuries, and degenerative diseases. At <strong>Genestac Therapeutics</strong>, we utilize cutting-edge technology and expert care to provide superior PBSE services tailored to each patient.
              </p>
            </div>

            {/* Right: Microscope Cell SVG Animation */}
            <div className="relative flex justify-center items-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 overflow-hidden group">
              <img src="/peripheral-blood-stem-cell-expansion.png" alt="PBSE" />
              <div className="absolute inset-0 bg-[#001f3f]/5 mix-blend-overlay pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* ── WHAT IS PBSE SECTION ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-block rounded-full bg-blue-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            Overview
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
            What is Peripheral Blood Stem Cell Expansion (PBSE)?
          </h2>
          <p className="text-lg leading-9 text-slate-600 max-w-3xl mx-auto">
            PBSE is a specialized procedure in regenerative medicine that isolates and multiplies stem cells from peripheral blood. These expanded stem cells can be applied to accelerate healing, treat chronic conditions, and support tissue regeneration. PBSE therapy is minimally invasive and highly effective for patients seeking advanced stem cell treatments.
          </p>
        </div>
      </section>

      {/* ── HOW PBSE WORKS & OUR PROCESS (DOUBLE TIMELINES) ── */}
      <section className="py-20 bg-gray-50 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            
            {/* Timeline 1: How PBSE Works */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">The Science</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">How PBSE Works</h3>
              </div>
              <div className="relative pl-8 border-l border-slate-200 space-y-8">
                {[
                  { step: "Blood Collection", desc: "A small blood sample is collected from the patient." },
                  { step: "Stem Cell Isolation", desc: "Stem cells are separated from the blood using specialized laboratory techniques." },
                  { step: "Cell Expansion", desc: "Isolated stem cells are cultured in controlled conditions to increase their numbers." },
                  { step: "Therapeutic Application", desc: "Expanded stem cells are administered to treat orthopedic, autoimmune, neurodegenerative, or chronic pain conditions." }
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

            {/* Timeline 2: Our PBSE Process */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Your Journey</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">Our PBSE Process</h3>
              </div>
              <div className="relative pl-8 border-l border-slate-200 space-y-8">
                {[
                  { step: "Consultation", desc: "Patient evaluation and suitability assessment." },
                  { step: "Blood Collection", desc: "Peripheral blood sample is drawn." },
                  { step: "Stem Cell Expansion", desc: "Cells are cultured and multiplied in advanced lab settings." },
                  { step: "Therapeutic Application", desc: "Expanded stem cells are administered according to treatment plan." },
                  { step: "Follow-Up", desc: "Ongoing monitoring to ensure optimal therapeutic outcomes." }
                ].map((item, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[45px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-md group-hover:scale-110 transition-transform duration-300">
                      {idx + 1}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{item.step}</h4>
                    <p className="text-sm leading-6 text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BENEFITS & CONDITIONS TREATED ── */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            
            {/* Left: Benefits */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Advantages</span>
                <h3 className="text-3xl font-bold font-montserrat">Benefits of PBSE Therapy</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Enhanced healing and faster recovery",
                  "Increased availability of stem cells for therapy",
                  "Minimally invasive and safe procedure",
                  "Effective in orthopedic, autoimmune, and neurodegenerative conditions",
                  "Supports tissue and skin regeneration"
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-sm sm:text-base text-slate-300 leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Conditions Treated */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Clinical Focus</span>
                <h3 className="text-3xl font-bold font-montserrat">Conditions Treated with PBSE</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Orthopedic injuries including joint pain and ligament tears",
                  "Autoimmune disorders",
                  "Neurodegenerative diseases such as Parkinson's and Alzheimer's",
                  "Chronic pain management",
                  "Skin and tissue repair"
                ].map((condition, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-sm shrink-0 mt-0.5">
                      ★
                    </span>
                    <span className="text-sm sm:text-base text-slate-300 leading-relaxed">{condition}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE GENESTAC ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">The Genestac Advantage</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
                Why Choose Genestac Therapeutics for PBSE?
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Advanced Laboratory", desc: "State of the art lab equipment for safe stem cell expansion." },
                  { title: "Specialist Team", desc: "Experienced team of regenerative medicine specialists." },
                  { title: "Personalized Plans", desc: "Treatment maps tailored specifically to your clinical needs." },
                  { title: "High Safety Standards", desc: "Exceptional levels of safety, sterility, and supportive patient care." },
                  { title: "Comprehensive Follow-Up", desc: "Constant and proactive post-procedure tracking to monitor clinical success." }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 border border-slate-100 bg-slate-50 rounded-2xl space-y-2 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact & Info Card */}
            <div className="p-8 rounded-[2rem] bg-[#001f3f] text-white space-y-6 shadow-2xl">
              <h3 className="text-2xl font-bold font-montserrat text-[#F5E6CC]">Get in Touch</h3>
              <p className="text-sm leading-6 text-slate-300">
                To learn more about PBSE therapy or schedule a consultation, contact Genestac Therapeutics today. Our experts are here to help you achieve faster recovery and better regenerative outcomes.
              </p>
              <div className="space-y-3 pt-2">
                <AppointmentButton className="block w-full text-center py-3 bg-[#F5E6CC] hover:bg-white text-[#001f3f] font-bold rounded-full transition-colors text-sm shadow-md">
                  Book Consultation
                </AppointmentButton>
                <a
                  href="tel:+918287776752"
                  className="block w-full text-center py-3 border border-white/20 hover:bg-white/10 text-white font-bold rounded-full transition-colors text-sm"
                >
                  Call +91-82877-76752
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SAFETY OF PBSE ── */}
      <section className="py-16 bg-gray-50 border-t border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-montserrat">
            Safety of PBSE
          </h2>
          <p className="text-base sm:text-lg leading-8 text-slate-600">
            PBSE is a safe and minimally invasive procedure. Genestac Therapeutics follows strict safety protocols, maintains sterile laboratory conditions, and ensures all procedures are performed by certified professionals.
          </p>
        </div>
      </section>

      {/* ── FAQs ACCORDION SECTION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">FAQs</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-montserrat">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "Is PBSE painful?",
                answer: "The blood collection and administration processes are minimally invasive. Patients may feel a mild pinch during the blood draw or injection, but the procedure is generally well-tolerated and performed under comfortable clinical conditions."
              },
              {
                question: "How long does PBSE take?",
                answer: "The initial blood collection takes about 15–30 minutes. However, the laboratory cell expansion phase takes place over a period of 10–14 days in our sterile cultivation facilities to achieve optimal therapeutic cell counts before re-administration."
              },
              {
                question: "Are there any side effects?",
                answer: "Because PBSE utilizes your body's own autologous stem cells, the risk of rejection or major side effects is extremely low. Some patients may experience minor soreness, bruising, or mild fatigue at the blood collection or injection sites, which typically resolves within 24 to 48 hours."
              },
              {
                question: "Can PBSE be combined with other treatments?",
                answer: "Yes, PBSE can be synergistically combined with other regenerative therapies such as Platelet-Rich Plasma (PRP) therapy, specialized physical rehabilitation, or specific pain management protocols to enhance overall recovery and therapeutic outcomes."
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

      {/* ── BACK TO SERVICES & CTA ── */}
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
