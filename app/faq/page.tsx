import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Frequently Asked Questions (FAQ) | Genestac Therapeutics",
  description: "Find answers to commonly asked questions about regenerative cell therapies, pain treatments, costs, recovery, and appointment procedures at Genestac.",
};

const faqs = [
  {
    category: "General & Safety",
    q: "Are regenerative therapies safe?",
    a: "Yes. Because we focus on autologous therapies (using your own biological cells, like stem cells or platelets), there is an extremely low risk of immune rejection or adverse reactions. All procedures are conducted under strict clinical guidelines.",
  },
  {
    category: "General & Safety",
    q: "How do I know if I am a candidate for stem cell or PRP therapy?",
    a: "Our clinical team reviews your medical history, current symptoms, and diagnostic scans (MRI, X-ray, or ultrasound) during your initial consultation. If your joint or tissue degeneration is too advanced, we will guide you on appropriate alternatives.",
  },
  {
    category: "Procedure & Recovery",
    q: "Is there any downtime after the treatment?",
    a: "Most of our procedures are minimally invasive daycare procedures. Patients are usually able to walk out of the clinic and return to light office work within 24 to 48 hours. Strenuous sports activity should be avoided for 2 to 4 weeks depending on the area treated.",
  },
  {
    category: "Procedure & Recovery",
    q: "When will I start to see results?",
    a: "Regenerative processes take time. While some patients report decreased inflammation and pain relief within the first 3 to 4 weeks, the primary tissue healing and remodeling occur over 3 to 6 months.",
  },
  {
    category: "Appointments & Costs",
    q: "How do I schedule an appointment?",
    a: "You can book directly using our online scheduler, call our Gurugram center, or chat with our patient coordinators on WhatsApp. We offer both virtual reviews and in-person clinic consultations.",
  },
  {
    category: "Appointments & Costs",
    q: "Do you accept health insurance?",
    a: "Regenerative treatments are often classified as specialized outpatient procedures. Coverage varies by insurance provider. Our billing desk will provide you with all required medical documentation and invoices to assist with reimbursement claims.",
  },
];

export default function FAQPage() {
  return (
    <main className="bg-white overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            Support Center
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-[#F5E6CC] max-w-3xl mx-auto font-medium">
            Find answers to common questions about our clinic, cellular therapies, and billing procedures.
          </p>
        </div>
      </section>

      {/* FAQ Accordion List */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 block mb-2">
                  {faq.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3">{faq.q}</h3>
                <p className="text-sm sm:text-base leading-7 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ask a Question CTA */}
      <section className="py-20 bg-gradient-to-br from-[#001f3f] to-[#00305f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Have More Questions?</h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Our medical counselors are ready to speak with you. Reach out via WhatsApp or call us directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/919971114121"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 justify-center rounded-full bg-[#F5E6CC] px-8 py-3.5 text-sm font-extrabold text-[#001f3f] hover:bg-white transition-all shadow-md"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i> WhatsApp Us
            </a>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-all"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
