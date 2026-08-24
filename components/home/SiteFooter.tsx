"use client";
import React from "react";
import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";
import WhatsAppButton from "@/components/WhatsAppButton";

const quickLinks = ["About Us", "Our Services", "Patient Stories", "News & Insights", "Frequently Asked Questions (FAQ)"];
const treatments = ["Spine & Nerve Disorders", "Joint & Sports Injuries", "Chronic Pain Treatment", "PRP & Stem Cell Therapy", "Advanced Hair Treatment"];

const socials = [
  { href: "https://www.facebook.com/profile.php?id=61570478709506", label: "Facebook", icon: "f" },
  { href: "#", label: "Twitter", icon: "𝕏" },
  { href: "https://www.instagram.com/genestactherapeutics/", label: "Instagram", icon: "📷" },
  { href: "https://www.linkedin.com/company/106439052/admin/dashboard/", label: "LinkedIn", icon: "in" },
];

export const SiteFooter: React.FC = () => (
  <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t-4 border-blue-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Top CTA */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between shadow-2xl border border-blue-500/30 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">Start Your Pain-Free Journey Today</h2>
          <p className="text-blue-100">Experience world-class non-surgical regenerative therapies and stem cell treatments.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <AppointmentButton
            className="group inline-flex items-center justify-center gap-2 rounded-full py-3 px-8 font-bold text-blue-700 bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
          >
            📅 Free Appointment
          </AppointmentButton>
          <WhatsAppButton
            phone="919971114121"
            className="inline-flex items-center justify-center gap-2 rounded-full py-3 px-8 font-bold text-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
            style={{ background: "linear-gradient(to right, #10b981, #059669)" }}
          >
            💬 WhatsApp
          </WhatsAppButton>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-4">

        {/* Brand */}
        <div className="space-y-6">
          <div className="bg-white/95 rounded-xl px-5 py-3 inline-flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <img src="https://genestac.com/wp-content/uploads/2024/08/Genestac-Logo-1.png" alt="Genestac Logo" className="w-40 h-auto object-contain" />
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            At the forefront of regenerative medicine and pain management. We heal you with advanced stem cell therapy, PRP, and CRISPR solutions.
          </p>
          <div className="flex space-x-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 text-sm font-bold"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map((l) => (
              <li key={l}>
                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 text-sm">
                  <span className="text-blue-500 text-xs">›</span> {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Treatment Areas */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">Treatment Areas</h3>
          <ul className="space-y-3">
            {treatments.map((t) => (
              <li key={t}>
                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 text-sm">
                  <span className="text-blue-500 text-xs">›</span> {t}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">Contact Us</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-0.5">📍</span>
              <span>Genestac Therapeutics<br />Gurugram, Delhi NCR, India</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-500">📞</span>
              <span>+91-9971114121</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-500">✉️</span>
              <span>info@genestac.com</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-500">🕐</span>
              <span>24/7 Online Support</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-400">© 2026 Genestac Therapeutics. All rights reserved.</p>
        <div className="flex space-x-4 text-sm text-gray-400">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>|</span>
          <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
        </div>
      </div>
    </div>
  </footer>
);
