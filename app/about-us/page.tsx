import React from "react";
import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "About Us | Genestac Therapeutics",
  description: "Learn about Genestac Therapeutics, our mission, vision, world-class medical team, and pioneering work in regenerative medicine and non-surgical pain care.",
};

export default function AboutUsPage() {
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
            Pioneering Care
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
            About Genestac Therapeutics
          </h1>
          <p className="text-lg sm:text-xl text-[#F5E6CC] max-w-3xl mx-auto font-medium">
            Redefining medicine through non-surgical cellular restoration, advanced pain management, and personalized patient care.
          </p>
        </div>
      </section>

      {/* Philosophy & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">Our Foundation</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Our Vision & Mission
              </h2>
              <p className="text-slate-600 leading-8">
                At Genestac Therapeutics, we believe that the human body possesses an extraordinary capacity to heal itself when supported by state-of-the-art medical science. For over 15 years, our medical practitioners and clinical researchers have committed to delivering cellular and regenerative therapies that offer a long-term alternative to invasive surgery.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#001f3f] flex items-center justify-center text-[#F5E6CC] shrink-0">
                    <i className="fa-solid fa-eye text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Our Vision</h3>
                    <p className="text-sm text-slate-600 mt-1">To become the global gold standard in clinical regeneration, bringing surgical-free recovery to patients worldwide.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#001f3f] flex items-center justify-center text-[#F5E6CC] shrink-0">
                    <i className="fa-solid fa-bullseye text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Our Mission</h3>
                    <p className="text-sm text-slate-600 mt-1">To formulate personalized, evidence-based cellular regimens that target root-cause degeneration, restoring patient vitality and motion.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl">
              <img
                src="https://genestac.com/wp-content/uploads/2025/05/optimized_new_image.jpg"
                alt="Genestac Clinic"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-[#001f3f]/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-16 bg-[#001f3f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "10k+", label: "Happy Patients" },
              { value: "4.9★", label: "Patient Rating" },
              { value: "14+", label: "Therapy Options" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl sm:text-5xl font-black text-[#F5E6CC]">{stat.value}</p>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">Why Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Our Core Pillars</h2>
            <p className="text-slate-600">The values that guide our clinical execution and patient advocacy.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Scientific Rigor", desc: "Every regimen is based on clinically verified protocols and peer-reviewed biotechnology.", icon: "fa-solid fa-microscope" },
              { title: "Patient Empathy", desc: "We focus on the patient's individual experience, lifestyle goals, and holistic recovery path.", icon: "fa-solid fa-heart" },
              { title: "Non-Invasive Focus", desc: "Prioritizing minimally invasive cellular and regenerative pathways to bypass surgical risks.", icon: "fa-solid fa-shield-halved" },
            ].map((v, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50 p-8 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mb-6">
                  <i className={`${v.icon} text-xl`}></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm leading-6 text-slate-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-[#001f3f] to-[#00305f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-black">Ready to Restore Your Mobility?</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Connect with our medical consultants today. Let us perform a comprehensive evaluation of your symptoms and outline a personalized path to recovery.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <AppointmentButton
              className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white transition-all shadow-lg"
            >
              Book a Free Appointment
            </AppointmentButton>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
