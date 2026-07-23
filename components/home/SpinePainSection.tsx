"use client";
import React from "react";
import AppointmentButton from "@/components/AppointmentButton";

const features = [
  "Best Pain Experts", "Digital Laboratory", "Online Appointment",
  "Advanced Technology", "Same Day Discharge", "24/7 online support",
];

const specialties = [
  {
    icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    title: "Pain Procedure",
    desc: "Minimally invasive interventions targeting the root cause of pain to provide immediate and lasting comfort.",
  },
  {
    icon: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></>,
    title: "Regenerative Therapy",
    desc: "Cutting-edge biological treatments designed to accelerate natural healing and safely restore joint function.",
  },
  {
    icon: <path d="M17 10c-.7-.7-1.69 0-2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7-.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c0 .28.22.5.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5l7-7Z" />,
    title: "Spine",
    desc: "Comprehensive evaluation and personalized management plans for acute and chronic spinal conditions.",
  },
];

const whyItems = [
  { title: "Personalized Treatment Plans", desc: "Every patient's pain is unique, and so is our approach to resolving it." },
  { title: "World-Class Infrastructure", desc: "Equipped with the latest diagnostic and therapeutic medical technologies." },
  { title: "Multidisciplinary Team", desc: "Collaborative care from surgeons, therapists, and pain medicine specialists." },
];

export const SpinePainSection: React.FC = () => (
  <div style={{ fontFamily: "'Poppins', sans-serif" }}>
    {/* HERO */}
    <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 px-6 lg:px-12 overflow-hidden bg-[#F5F1E8]">
      {/* Static decorative blobs - no animation to avoid compositor thrash */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "rgba(11,61,145,0.04)", filter: "blur(80px)" }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "rgba(184,147,90,0.08)", filter: "blur(60px)" }} />
      <style>{`
        @keyframes floatBlob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        .btn-sweep { position:relative; overflow:hidden; background:#0B3D91; transition:transform 0.3s, box-shadow 0.3s; }
        .btn-sweep:hover { transform:translateY(-3px); box-shadow:0 15px 30px -5px rgba(11,61,145,0.4); }
        .btn-outline-fill { transition:color 0.3s, background 0.3s, border-color 0.3s; }
        .btn-outline-fill:hover { color:white; border-color:#0B3D91; background:#0B3D91; }
      `}</style>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — Doctor Image */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start relative mt-10 lg:mt-0">
            <div className="relative">
              <div className="relative z-10 rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl hover:scale-[1.02] transition-transform duration-500">
              <img src="./xray.webp" alt="Lead Doctor" className="w-[300px] h-[400px] md:w-[400px] md:h-[500px] lg:w-[450px] lg:h-[550px] object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D91]/40 to-transparent" />
              </div>
              {/* Badge: Experience */}
              <div className="absolute -bottom-12 -right-6 md:-right-12 z-20 bg-white p-4 md:p-5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] flex items-center gap-4" style={{ animation:"floatBlob 8s ease-in-out infinite" }}>
                <div className="bg-[#EBE5D9] p-3 rounded-full text-[#0B3D91]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0B3D91]">15+</p>
                  <p className="text-sm text-gray-500 font-medium">Years Experience</p>
                </div>
              </div>
              {/* Badge: Patients */}
              <div className="absolute -top-14 -left-8 md:-left-12 z-20 bg-white p-4 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] flex items-center gap-3">
                <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="P1" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" alt="P2" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#0B3D91] flex items-center justify-center text-white text-xs font-bold">+10k</div>
                </div>
                <div className="ml-2">
                  <p className="text-sm font-bold text-gray-800">Happy Patients</p>
                  <div className="flex text-[#D4AF37]">{"★★★★★".split("").map((s, i) => <span key={i} className="text-xs">{s}</span>)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Text */}
          <div className="order-1 lg:order-2 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-[#0B3D91] font-semibold text-sm mb-6 border border-white shadow-sm w-max">
              <svg className="w-4 h-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" /></svg>
              <span>Genestac Advanced Care</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-[#0B3D91] leading-[1.1] mb-6 tracking-tight">
              Welcome To The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B3D91] to-[#2E74E6]">Spine &amp; Pain</span>{" "}
              Hospital Gurgaon
            </h1>
            <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-5 leading-snug border-l-4 border-[#B8935A] pl-4">
              Experience World-Class Pain Relief with Genestac's Advanced Pain Management Solutions.
            </h2>
            <p className="text-gray-600 mb-10 text-base md:text-lg leading-relaxed max-w-xl">
              At Genestac Therapeutics Gurgaon, we are a leading pain management clinic in Delhi NCR, specializing in cutting-edge, non-surgical treatments for chronic pain. Our multidisciplinary team of pain specialists combines expertise with personalized care to deliver lasting relief and restore your quality of life.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10">
              {features.map((f) => (
                <div key={f} className="flex items-center space-x-3 group">
                  <div className="bg-white rounded-full p-1 shadow-sm group-hover:bg-[#0B3D91] transition-colors duration-300">
                    <svg className="w-5 h-5 text-[#0B3D91] group-hover:text-white transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <span className="text-gray-700 font-medium">{f}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <AppointmentButton className="btn-sweep text-white px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-2 cursor-pointer">
                Book a free appointment →
              </AppointmentButton>
              <div className="flex items-center gap-3 px-4 py-2 cursor-pointer group hover:bg-[#EBE5D9]/50 rounded-full transition-colors">
                <div className="bg-[#EBE5D9] p-3 rounded-full text-[#0B3D91] group-hover:bg-[#0B3D91] group-hover:text-white transition-colors duration-300">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Emergency 24/7</p>
                  <p className="text-[#0B3D91] font-bold text-lg">+91 9971114121</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* SPECIALTIES CARDS */}
    <section className="bg-[#EBE5D9] pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h3 className="text-[#B8935A] font-bold tracking-widest uppercase text-sm mb-3">Our Specialties</h3>
          <h2 className="text-3xl md:text-5xl font-bold text-[#0B3D91] mb-6">Advanced Treatments For Your Well-being</h2>
          <p className="text-gray-600 text-lg">We bring together world-class medical expertise and state-of-the-art technology to provide the best possible care.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {specialties.map((sp) => (
            <div key={sp.title} className="bg-white rounded-3xl p-10 text-center shadow-lg hover:shadow-[0_25px_50px_-15px_rgba(11,61,145,0.2)] hover:-translate-y-4 transition-all duration-500 group border border-transparent hover:border-[#0B3D91]/20 relative overflow-hidden cursor-pointer">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B3D91] to-[#2E74E6] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="bg-[#F5F1E8] w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 group-hover:bg-[#0B3D91] group-hover:scale-110 transition-all duration-500">
                <svg className="w-12 h-12 text-[#0B3D91] group-hover:text-white transition-colors duration-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  {sp.icon}
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-[#0B3D91] mb-4">{sp.title}</h4>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed px-2">{sp.desc}</p>
              {/* <div className="mt-8 text-[#0B3D91] font-semibold flex items-center justify-center w-full gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Learn More →
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* WHY CHOOSE US */}
    <section className="bg-white py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute top-0 left-0 w-full h-full bg-[#EBE5D9] rounded-br-[100px] rounded-tl-[100px] -translate-x-4 translate-y-4 group-hover:-translate-x-6 group-hover:translate-y-6 transition-transform duration-500" />
          <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop" alt="Hospital" className="relative z-10 rounded-br-[100px] rounded-tl-[100px] shadow-2xl object-cover h-[500px] w-full group-hover:scale-[1.01] transition-transform duration-700" />
          <div className="absolute -bottom-8 -right-8 z-20 bg-[#0B3D91] text-white p-6 rounded-3xl shadow-xl max-w-[200px] hidden md:block group-hover:-translate-y-2 transition-transform duration-500">
            <p className="text-3xl font-bold mb-1">24/7</p>
            <p className="text-sm text-blue-100">Emergency Support &amp; Care Available</p>
          </div>
        </div>
        <div>
          <h3 className="text-[#B8935A] font-bold tracking-widest uppercase text-sm mb-3">Why Choose Genestac?</h3>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B3D91] mb-6 leading-tight">A Legacy of Excellence in Pain Management</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">We understand that living with chronic pain affects every aspect of your life. Our facility is designed not just to treat symptoms, but to uncover and resolve the underlying causes.</p>
          <div className="space-y-6">
            {whyItems.map((w) => (
              <div key={w.title} className="flex gap-4 group cursor-pointer hover:bg-[#F5F1E8]/50 p-2 rounded-xl transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-[#EBE5D9] flex items-center justify-center text-[#0B3D91] group-hover:bg-[#0B3D91] group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-[#0B3D91] transition-colors">{w.title}</h4>
                  <p className="text-gray-500">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <AppointmentButton className="btn-outline-fill mt-10 border-2 border-[#0B3D91] text-[#0B3D91] px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-2 w-fit cursor-pointer">
            Meet Our Doctors →
          </AppointmentButton>
        </div>
      </div>
    </section>
  </div>
);
