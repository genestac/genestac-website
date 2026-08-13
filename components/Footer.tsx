"use client";

import React from "react";
import { useModals } from "@/context/ModalContext";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";

export const Footer: React.FC = () => {
  const { setPrivacyOpen, setTermsOpen } = useModals();

  return (
    <footer className="bg-brand-950 pt-16 pb-8 text-slate-400 relative overflow-hidden z-10 border-t border-brand-900">
        
      <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-center gap-8 lg:gap-10 mb-12 pb-12 border-b border-white/30">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/logo.jpeg"
              alt="Genestac Logo"
              style={{ width: "90px", height: "auto" }}
              className="object-contain opacity-100 rounded-2xl"
            />
          </div>

          {/* Description */}
          <p className="text-sm text-brand-200 leading-relaxed font-light lg:max-w-[280px] lg:border-l lg:border-brand-800/60 lg:pl-8">
            The pinnacle of personalized metabolic care and cellular
            optimization for high-performance individuals.
          </p>

          {/* Contact */}
          <ul className="space-y-3 lg:space-y-2.5 text-sm font-medium lg:border-l lg:border-brand-800/60 lg:pl-8 lg:flex-1">
            <li>
              <a
                href="mailto:info@genestac.com"
                className="hover:text-white transition-colors flex items-center gap-3"
              >
                <Mail className="h-4 w-4 text-brand-400 flex-shrink-0" />
                <span className="text-brand-200">info@genestac.com</span>
              </a>
            </li>
            <li>
              <a
                href="tel:+919971114121"
                className="hover:text-white transition-colors flex items-center gap-3"
              >
                <Phone className="h-4 w-4 text-brand-400 flex-shrink-0" />
                <span className="text-brand-200">+91 9971114121</span>
              </a>
            </li>
            <li className="leading-relaxed flex items-start gap-3">
              <MapPin className="h-4 w-4 text-brand-400 mt-1 flex-shrink-0" />
              <span className="text-brand-200">
                A Block, Unitech Business Zone, 106, Nirvana Country, Sector
                50, Gurugram, Haryana 122018
              </span>
            </li>
          </ul>
        </div>
        
        {/* <hr className="border-brand-800/60 mb-6" /> */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest font-extrabold pt-2 text-brand-200/60">
          <p className="mb-4 md:mb-0">© 2026 genestac. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => setTermsOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
           
          </div>
        </div>
      </div>
    </footer>
  );
};