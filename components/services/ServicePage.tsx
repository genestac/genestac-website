"use client";
import Link from "next/link";
import React from "react";
import WhatsAppButton from "@/components/WhatsAppButton";
import AppointmentButton from "@/components/AppointmentButton";

export interface ServicePageProps {
  badge: string;
  title: string;
  tagline: string;
  heroDescription: string;
  accentColor?: string; // tailwind color class prefix, e.g. "teal"
  overview: string;
  howItWorks: {
    step: string;
    description: string;
  }[];
  benefits: string[];
  candidates: string[];
  faqs: { question: string; answer: string }[];
}

export const ServicePage: React.FC<ServicePageProps> = ({
  badge,
  title,
  tagline,
  heroDescription,
  overview,
  howItWorks,
  benefits,
  candidates,
  faqs,
}) => (
  <main className="bg-white overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
    {/* ── HERO ── */}
    <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            {badge}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-[#F5E6CC] font-medium">{tagline}</p>
          <p className="text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">{heroDescription}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <AppointmentButton
              className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-7 py-3.5 text-sm font-extrabold text-[#001f3f] shadow-lg hover:bg-white hover:shadow-[0_8px_24px_rgba(245,230,204,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Book a Free Consultation
            </AppointmentButton>
            <WhatsAppButton
              phone="918287776752"
              className="inline-flex items-center gap-2 justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-7 py-3.5 text-sm font-bold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp Us
            </WhatsAppButton>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
            {[
              { v: "15+", l: "Years Experience" },
              { v: "4.9★", l: "Google Rating" },
              { v: "24/7", l: "Online Support" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-black text-[#F5E6CC]">{s.v}</p>
                <p className="text-xs text-white/60 font-bold tracking-widest uppercase">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── OVERVIEW ── */}
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] items-start">
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">Overview</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              What is {title}?
            </h2>
            <p className="text-base leading-8 text-slate-600">{overview}</p>
          </div>
          <div className="rounded-[2rem] bg-[#001f3f] p-8 text-white shadow-2xl shadow-slate-900/20">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 mb-4">Quick Info</p>
            <ul className="space-y-3">
              {[
                "Non-surgical, minimally invasive",
                "Clinically validated protocol",
                "Personalized to each patient",
                "Expert medical supervision",
                "Long-lasting results",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm text-slate-300">
                  <svg className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {pt}
                </li>
              ))}
            </ul>
            <AppointmentButton
              className="mt-8 block w-full text-center rounded-full bg-[#F5E6CC] py-3 text-sm font-extrabold text-[#001f3f] hover:bg-white transition-colors"
            >
              Schedule a Consultation
            </AppointmentButton>
          </div>
        </div>
      </div>
    </section>

    {/* ── HOW IT WORKS ── */}
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">How It Works</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, i) => (
            <div key={i} className="relative rounded-[1.5rem] border border-slate-100 bg-slate-50 p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-[#001f3f] flex items-center justify-center text-[#F5E6CC] text-sm font-black mb-5">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{step.step}</h3>
              <p className="text-sm leading-6 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── BENEFITS ── */}
    <section className="py-16 bg-[#001f3f] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Benefits</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Why Choose This Treatment?</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors duration-300">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm leading-6 text-slate-300">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── WHO IS A CANDIDATE ── */}
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">Eligibility</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Who Can Benefit?</h2>
            <ul className="space-y-3">
              {candidates.map((c, i) => (
                <li key={i} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <svg className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm leading-6 text-slate-700">{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] bg-white border border-slate-100 p-10 shadow-xl shadow-slate-900/5 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Ready to Begin?</h3>
            <p className="text-slate-600 leading-7">
              Our specialists will evaluate your medical history and goals to determine if this therapy is right for you. Book a free initial consultation today.
            </p>
            <div className="space-y-3">
              <AppointmentButton
                className="block w-full text-center rounded-full bg-[#001f3f] py-4 text-sm font-extrabold text-[#F5E6CC] hover:bg-slate-800 transition-colors"
              >
                Book Free Consultation
              </AppointmentButton>
              <a
                href="tel:+918287776752"
                className="block w-full text-center rounded-full border border-slate-200 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Call: +91-82877-76752
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── FAQs ── */}
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">FAQs</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50 p-7">
              <h3 className="text-base font-bold text-slate-900 mb-3">{faq.question}</h3>
              <p className="text-sm leading-7 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── FINAL CTA ── */}
    <section className="py-16 bg-gradient-to-br from-[#001f3f] to-[#00305f] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          Start Your Healing Journey Today
        </h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Take the first step towards recovery with our expert team at Genestac Therapeutics — leaders in regenerative medicine.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <AppointmentButton
            className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
          >
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
