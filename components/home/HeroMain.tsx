"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import AppointmentButton from "@/components/AppointmentButton";
import WhatsAppButton from "@/components/WhatsAppButton";

export const HeroMain: React.FC = () => {
  const router = useRouter();

  return (
    <section
      id="hero"
      className="relative w-full overflow-x-hidden min-h-[90vh] flex items-center justify-center lg:justify-start bg-gray-900 py-16 lg:py-0"
      style={{ animation: "heroFadeIn 1.2s ease-out 0.2s both" }}
    >
      <style>{`
        @keyframes heroFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Background Image with Fade Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/background_image.png"
          alt="Regenerative Medicine Background"
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/100 via-[#001f3f]/85 to-[#001f3f]/40" />
        <div className="absolute inset-0 bg-[#001f3f]/90 lg:hidden" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center py-10 lg:py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 w-max px-4 py-1.5 rounded-full bg-[#001f3f]/80 border border-[#F5E6CC]/40 mb-8 shadow-lg backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#F5E6CC] animate-pulse" />
            <span className="text-[#F5E6CC] text-[0.65rem] sm:text-xs font-bold tracking-[0.15em] uppercase">
              Excellence in Care
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-[2.5rem] sm:text-5xl lg:text-[3.8rem] xl:text-[4.2rem] font-black mb-8 leading-[1.1] tracking-tighter drop-shadow-2xl break-words"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <span className="text-white block mb-1">
              Pioneering the Future of
            </span>
            <span
              className="text-[#F5E6CC] block mt-2"
              style={{
                textShadow:
                  "0 0 30px rgba(245,230,204,0.3), 0 4px 15px rgba(0,0,0,0.9)",
              }}
            >
              Regenerative Medicine
            </span>
          </h1>

          <p
            className="text-lg sm:text-[1.15rem] leading-relaxed text-white/90 font-medium drop-shadow-lg mb-10 max-w-[600px]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Experience world-class, non-surgical pain management and
            regenerative therapies — <br className="hidden sm:block" />
            powered by innovation, compassion, and 15+ years of medical
            excellence.
          </p>

          {/* Bullet Points */}
          <ul className="space-y-5 mb-12 text-white/95 drop-shadow-md max-w-[600px]">
            {[
              {
                icon: "M5 13l4 4L19 7",
                text: "Non-surgical, evidence-based treatments for pain relief",
              },
              {
                icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
                text: "Stem cell & genetic therapies for tissue regeneration",
              },
              {
                icon: "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5",
                text: "Advanced PRP, RFA, and neuroplasty techniques",
              },
              {
                icon: "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5",
                text: "Trusted by thousands, 4.9★ patient satisfaction",
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-7 h-7 mt-0.5 rounded-full border border-white/50 flex items-center justify-center transition-all duration-300 group-hover:border-[#F5E6CC] group-hover:bg-[#F5E6CC]/10">
                  <svg
                    className="w-3.5 h-3.5 text-white group-hover:text-[#F5E6CC] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={item.icon}
                    />
                  </svg>
                </div>
                <span
                  className="text-[1.05rem] font-medium tracking-wide leading-snug"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 sm:gap-4 mb-12">
            <AppointmentButton className="w-full sm:w-auto text-center px-5 sm:px-7 lg:px-8 py-3.5 rounded-[2rem] bg-[#F5E6CC] text-[#001f3f] font-extrabold text-[0.9rem] sm:text-[1.05rem] hover:-translate-y-1.5 hover:scale-105 hover:bg-white hover:shadow-[0_12px_30px_rgba(245,230,204,0.4)] transition-all duration-300 ease-out cursor-pointer">
              Book a Free Appointment
            </AppointmentButton>
            <WhatsAppButton
              phone="919289460045"
              message="Hello"
              className="w-full sm:w-auto text-center px-5 sm:px-6 lg:px-7 py-3.5 rounded-[2rem] bg-transparent border-[1.5px] border-white/80 text-white font-bold text-[0.9rem] sm:text-[1.05rem] flex items-center justify-center gap-2 hover:-translate-y-1.5 hover:scale-105 hover:bg-white/10 hover:border-white hover:shadow-[0_12px_30px_rgba(255,255,255,0.2)] transition-all duration-300 ease-out cursor-pointer"
              // style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </WhatsAppButton>
            {/* <a
              href="tel:+919971114121"
              className="w-full sm:w-auto text-center px-5 sm:px-7 lg:px-8 py-3.5 rounded-[2rem] bg-white/10 border border-transparent text-white font-bold text-[0.9rem] sm:text-[1.05rem] flex items-center justify-center gap-2 backdrop-blur-md hover:-translate-y-1.5 hover:scale-105 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_12px_30px_rgba(255,255,255,0.2)] transition-all duration-300 ease-out"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Call a Doctor
            </a> */}
          </div>

          {/* Trust Stats */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 lg:gap-14 pt-8 border-t border-white/15 drop-shadow-md">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "4.9★", label: "Google Rating" },
              { value: "24/7", label: "Online Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <h3
                  className="text-[2rem] leading-none font-black text-[#F5E6CC] mb-1.5"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {stat.value}
                </h3>
                <p
                  className="text-[0.75rem] text-white/70 font-bold tracking-[0.1em] uppercase"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN — Video Card */}
        <div className="w-full lg:w-[45%] flex justify-center lg:justify-end lg:mt-0 relative z-10">
          <div className="bg-[#001f3f]/50 backdrop-blur-2xl p-8 lg:p-10 rounded-4xl border border-[#F5E6CC]/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] w-full max-w-105 hover:-translate-y-2 transition-all duration-500">
            <div className="text-center mb-8">
              <span
                className="inline-block px-4 py-1.5 bg-[#F5E6CC]/10 text-[#F5E6CC] text-[0.7rem] font-bold tracking-widest rounded-full mb-4 uppercase border border-[#F5E6CC]/20"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Transform Your Life
              </span>
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Advanced Weight Loss
              </h2>
              <p
                className="text-white/70 text-sm font-medium"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Medical-grade program tailored for you
              </p>
            </div>

            {/* Video */}
            <div
              className="relative w-full rounded-2xl overflow-hidden border border-[#F5E6CC]/60 shadow-[0_0_30px_rgba(245,230,204,0.15)] bg-gray-900 group/video"
              style={{ aspectRatio: "4/5", contain: "strict" }}
            >
              <div className="absolute inset-0 bg-[#F5E6CC]/20 blur-2xl rounded-full scale-90 z-0 pointer-events-none" />
              <video
                src="/video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover/video:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#001f3f] via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-5 left-0 right-0 flex justify-center z-20 pointer-events-none">
                <div className="px-5 py-2 rounded-full bg-[#001f3f]/90 backdrop-blur-md border border-[#F5E6CC]/40 shadow-xl">
                  <p
                    className="text-[#F5E6CC] text-[0.7rem] font-bold tracking-[0.15em] uppercase flex items-center gap-2.5"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    Real Results
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/pricing"
                className="inline-block w-full py-4 rounded-full text-[#001f3f] font-extrabold text-[0.9rem] tracking-widest shadow-lg hover:shadow-[#F5E6CC]/40 hover:scale-[1.02] transition-all duration-300 uppercase"
                style={{
                  background: "linear-gradient(to right, #F5E6CC, #d4bc8b)",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
