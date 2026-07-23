import Link from "next/link";

export const metadata = {
  title: "Advanced Pain Management & Regenerative Therapies | Genestac",
  description: "Non-surgical pain management and regenerative therapies at Genestac Therapeutics. Expert care for back pain, joint pain, spine disorders, and chronic conditions.",
};

const therapies = [
  "Regenerative Cell Therapy", "PRP Therapy", "Physiotherapy",
  "Radiofrequency Ablation (RFA)", "Nerve Block Injections", "Ozone Therapy",
  "Shockwave Therapy (ESWT)", "Laser Therapy", "Hydrotherapy & Rehabilitation",
];

const steps = [
  { num: "1", title: "Consultation", desc: "Discuss your condition and medical history with our expert." },
  { num: "2", title: "Planning", desc: "We evaluate imaging and design a personalized treatment plan." },
  { num: "3", title: "Therapy / Heal", desc: "Begin your pain management protocol under specialist supervision." },
  { num: "4", title: "Recovery", desc: "Ongoing monitoring, follow-ups, and rehabilitation consultations." },
];

const faqs = [
  { q: "Are the treatments safe?", a: "Yes. We use minimally invasive, evidence-based regenerative protocols with autologous biological materials wherever possible, ensuring maximum safety and minimal side effects." },
  { q: "How soon will I feel relief?", a: "Many patients notice reduced inflammation within 2–4 weeks. Full tissue healing and significant pain relief typically occur over 3–6 months depending on the severity." },
  { q: "Will I need surgery?", a: "Our entire focus is on avoiding surgery. Genestac provides advanced non-surgical alternatives for over 90% of musculoskeletal and spine conditions." },
  { q: "What conditions do you treat?", a: "We treat back pain, knee arthritis, disc herniation, sciatica, shoulder injuries, sports injuries, chronic pain syndromes, and more through targeted regenerative protocols." },
];

export default function PainManagementPage() {
  return (
    <main className="bg-white overflow-x-hidden min-h-screen pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── HERO ── */}
      <section className="relative py-24 bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] animate-pulse" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {["Backs", "Therapies", "Joints", "Shoulders", "Knees"].map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-300">{tag}</span>
                ))}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white">
                Advanced Pain Management & Regenerative Therapies
              </h1>
              <p className="text-slate-300 leading-7">
                Evidence-based, non-surgical treatments combining stem cell science with expert pain management to restore your mobility and quality of life.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <i className="fa-solid fa-user-doctor text-emerald-400 w-5"></i> Pain Management Specialist
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <i className="fa-solid fa-check-circle text-emerald-400 w-5"></i> 10,000+ Happy Patients
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <i className="fa-solid fa-star text-emerald-400 w-5"></i> Doctor-Led Care
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="https://genestac.com/schedule-an-appointment/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white hover:-translate-y-0.5 transition-all shadow-lg">
                  Book Free Consultation
                </a>
                <a href="tel:+918287776752"
                  className="inline-flex items-center gap-2 justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 transition-all">
                  <i className="fa-solid fa-phone text-emerald-400"></i> Enquire Now
                </a>
              </div>
            </div>

            {/* Right: Quick Booking Card */}
            <div className="rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm p-8 space-y-5">
              <h3 className="text-xl font-bold text-[#F5E6CC]">Book Appointment | Get Pricing</h3>
              <div className="space-y-3">
                {["Address", "Name", "Pain Condition", "Phone Number", "Therapy", "Tip"].map((field, i) => (
                  <div key={i} className="h-10 rounded-xl bg-white/10 border border-white/15 px-4 flex items-center text-sm text-slate-400">
                    {field}…
                  </div>
                ))}
                <a href="https://genestac.com/schedule-an-appointment/" target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-sm transition-colors">
                  Submit →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FIRST STEP BANNER ── */}
      <section className="py-16 bg-[#F5E6CC]/30 border-t border-b border-[#F5E6CC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Take the First Step Towards Pain-Free Living</h2>
              <p className="text-slate-600 leading-7">Connect with our specialists to find the right treatment, explore your options, and begin healing today.</p>
              <ul className="space-y-2">
                {["No prescription or referral needed. Simple.", "Phone consultations are available, no obligations.", "We always think of what is best for you."].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <i className="fa-solid fa-check-circle text-emerald-500 mt-0.5"></i> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Contact", value: "+91-9971114121", icon: "fa-solid fa-phone" },
                { label: "Hours", value: "Mon-Fri, 9:00 AM – 7:00 PM", icon: "fa-solid fa-clock" },
                { label: "Location", value: "Delhi, Mumbai, Bangalore", icon: "fa-solid fa-location-dot" },
                { label: "Response Time", value: "Within 24 hours", icon: "fa-solid fa-bolt" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-1">
                  <i className={`${item.icon} text-emerald-500`}></i>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR ADVANCED THERAPIES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">What We Offer</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Our Advanced Therapies</h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              Find the advanced pain treatments and regenerative therapies listed and described in the sections below and learn how they can help you.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {therapies.map((therapy, idx) => (
              <div key={idx} className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-[#001f3f] hover:text-white hover:border-[#001f3f] transition-all duration-300 cursor-pointer">
                <span className="text-sm font-semibold text-slate-700 group-hover:text-white">{therapy}</span>
                <i className="fa-solid fa-chevron-down text-xs text-slate-400 group-hover:text-[#F5E6CC] group-hover:rotate-[-90deg] transition-transform duration-300"></i>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-8 max-w-2xl mx-auto">
            <strong>Note:</strong> Treatments are customized to individual needs and may not be available for all conditions. Schedule a consultation to determine eligibility.
          </p>
        </div>
      </section>

      {/* ── TREATMENT PROCESS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Our Treatment Process</h2>
            <p className="text-sm text-slate-500">Go the extra mile to serve the patient's recovery journey.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="relative mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-[#001f3f] text-[#F5E6CC] text-2xl font-black shadow-lg">
                  {step.num}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200" />
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-5">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500">Find answers about our advanced treatments and therapies.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group rounded-2xl border border-slate-100 bg-slate-50 p-6 [&_summary::-webkit-details-marker]:hidden hover:bg-slate-100/70 transition-all">
                <summary className="flex cursor-pointer items-center justify-between gap-2 text-slate-900">
                  <h3 className="text-base font-bold pr-4">{faq.q}</h3>
                  <span className="shrink-0 rounded-full bg-white p-1.5 shadow-sm group-open:-rotate-180 transition-transform duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600 border-t border-slate-200/60 pt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 bg-gradient-to-br from-[#001f3f] to-[#00305f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">Take the First Step Toward Pain-Free Living</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Connect with our medical experts today and explore the right regenerative therapy for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a href="https://genestac.com/schedule-an-appointment/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white hover:-translate-y-0.5 transition-all shadow-lg">
              Book Free Consultation
            </a>
            <a href="tel:+918287776752"
              className="inline-flex items-center gap-2 justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all">
              <i className="fa-solid fa-phone text-emerald-400"></i> or call +91-8287776752
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
