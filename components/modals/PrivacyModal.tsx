"use client";

import React, { useEffect, useRef, useState } from "react";
import { useModals } from "@/context/ModalContext";
import { X, Mail, Phone } from "lucide-react";

export const PrivacyModal: React.FC = () => {
  const { isPrivacyOpen, setPrivacyOpen } = useModals();
  const [activeSection, setActiveSection] = useState("intro");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPrivacyOpen) return;

    const sections = ["intro", "collect", "use", "share", "security", "cookies", "retention", "rights", "contact"];
    const scrollArea = scrollAreaRef.current;

    if (!scrollArea) return;

    const handleScroll = () => {
      let current = "intro";
      for (const sectionId of sections) {
        const el = document.getElementById(`privacy-${sectionId}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Check if section is near the top of the scroll container
          if (rect.top - 120 <= 0) {
            current = sectionId;
          }
        }
      }
      setActiveSection(current);
    };

    scrollArea.addEventListener("scroll", handleScroll);
    return () => scrollArea.removeEventListener("scroll", handleScroll);
  }, [isPrivacyOpen]);

  if (!isPrivacyOpen) return null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`privacy-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { id: "intro", label: "1. Introduction" },
    { id: "collect", label: "2. Information We Collect" },
    { id: "use", label: "3. How We Use Info" },
    { id: "share", label: "4. How We Share Info" },
    { id: "security", label: "5. Security & HIPAA" },
    { id: "cookies", label: "6. Cookies & Tracking" },
    { id: "retention", label: "7. Data Retention" },
    { id: "rights", label: "8. Privacy Rights" },
    { id: "contact", label: "9. Contact Us" },
  ];

  return (
    <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-md z-[150] flex items-center justify-center px-3 py-4 sm:px-4 sm:py-8 transition-opacity">
      <div
        ref={scrollAreaRef}
        className="acrylic-card bg-white/95 rounded-[1.5rem] sm:rounded-[2.5rem] w-full max-w-6xl max-h-[92vh] overflow-y-auto relative shadow-2xl animate-fade-in no-scrollbar border-white flex flex-col"
      >
        {/* Close Button (Sticky) */}
        <div className="sticky top-0 right-0 flex justify-end z-20 p-6 pb-0 pointer-events-none">
          <button
            onClick={() => setPrivacyOpen(false)}
            className="pointer-events-auto text-brand-400 hover:text-brand-900 transition-colors bg-white border border-brand-100 p-2.5 rounded-full shadow-sm hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hero Section */}
        <div className="px-8 md:px-12 pt-4 pb-8 border-b border-slate-200">
          <span className="text-sm font-bold tracking-wide text-brand-600 uppercase mb-2 block font-sans">
            Legal Documentation
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-brand-950 mb-4">
            Privacy Policy
          </h2>
          <p className="text-lg text-slate-500 font-sans">
            Effective Date: <span className="font-medium text-brand-900 font-sans">May 11, 2026</span>
          </p>
        </div>

        {/* Content Area (Sidebar + Main) */}
        <div className="px-8 md:px-12 py-8 flex-1 font-sans">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 relative">
            
            {/* Sidebar Table of Contents */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-8">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">
                  Contents
                </h3>
                <nav className="space-y-1 border-l-2 border-slate-100">
                  {navLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className={`block w-full text-left pl-4 py-2 text-sm transition font-medium -ml-[2px] ${
                        activeSection === link.id
                          ? "active-toc border-l-2 border-brand-500 text-brand-600 font-bold"
                          : "text-slate-500 hover:text-brand-900 hover:border-l-2 hover:border-brand-500"
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Text */}
            <div className="col-span-12 lg:col-span-9">
              <article className="prose prose-slate max-w-none text-slate-600 prose-headings:font-serif prose-headings:text-brand-950 prose-a:text-brand-600">
                
                <section id="privacy-intro" className="scroll-mt-10 mb-8">
                  <h2 className="text-2xl font-serif font-bold text-brand-950 mb-4">1. Introduction</h2>
                  <p className="leading-relaxed mb-4">
                    Welcome to Genestac (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are highly committed to protecting your personal and medical information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (genestac.com) and use our telehealth services, metabolic optimization protocols, and related clinical offerings.
                  </p>
                  <p className="leading-relaxed mb-4">
                    By accessing or using our website and services, you agree to the terms of this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the site.
                  </p>
                </section>

                <hr className="my-8 border-slate-200" />

                <section id="privacy-collect" className="scroll-mt-10 mb-8">
                  <h2 className="text-2xl font-serif font-bold text-brand-950 mb-4">2. Information We Collect</h2>
                  <p className="leading-relaxed mb-4">
                    We may collect personal and medical information from you in a variety of ways, including when you register on the site, fill out a health intake form, or interact with our telehealth platform. The information we collect includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>
                      <strong>Personal Identification Information:</strong> Your full name, email address, phone number, date of birth, and shipping/billing addresses.
                    </li>
                    <li>
                      <strong>Medical and Health Information:</strong> Biometric data (e.g., height, weight), current and past medical conditions, biological goals, and details provided during your medical intake process.
                    </li>
                    <li>
                      <strong>Payment Information:</strong> Credit card details and billing information (processed securely through third-party payment gateways; we do not store your full credit card number).
                    </li>
                    <li>
                      <strong>Automatically Collected Data:</strong> IP addresses, browser types, operating systems, access times, and the pages you have viewed directly before and after accessing the site.
                    </li>
                  </ul>
                </section>

                <hr className="my-8 border-slate-200" />

                <section id="privacy-use" className="scroll-mt-10 mb-8">
                  <h2 className="text-2xl font-serif font-bold text-brand-950 mb-4">3. How We Use Your Information</h2>
                  <p className="leading-relaxed mb-4">
                    Having accurate information about you permits us to provide you with a smooth, efficient, and customized clinical experience. Specifically, we may use information collected about you via the site to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Evaluate your health profile and formulate personalized clinical treatments.</li>
                    <li>Process and fulfill your prescriptions through our FDA-registered compounding pharmacy partners.</li>
                    <li>Manage overnight cold-chain logistics and order deliveries.</li>
                    <li>Allow our board-certified physicians and your dedicated Health Consultants to monitor your progress and provide ongoing 1-on-1 support.</li>
                    <li>Process payments and issue refunds.</li>
                    <li>Send administrative information, such as appointment reminders, protocol updates, and order confirmations.</li>
                    <li>Improve our website functionality and clinical offerings.</li>
                  </ul>
                </section>

                <hr className="my-8 border-slate-200" />

                <section id="privacy-share" className="scroll-mt-10 mb-8">
                  <h2 className="text-2xl font-serif font-bold text-brand-950 mb-4">4. How We Share Your Information</h2>
                  <p className="leading-relaxed mb-4">
                    We strictly protect your data and do not sell your personal information to third parties. We only share information in the following situations:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>
                      <strong>Healthcare Providers:</strong> With our network of board-certified doctors, endocrinologists, and specialists who review your medical intake to prescribe and oversee your treatment.
                    </li>
                    <li>
                      <strong>Pharmacy Partners:</strong> With certified, 503A-designated pharmacies strictly for the purpose of compounding and fulfilling your prescribed medications (e.g., GLP-1, NAD+, or peptide therapies).
                    </li>
                    <li>
                      <strong>Third-Party Service Providers:</strong> With trusted logistics partners (for secure, temperature-controlled delivery) and IT service providers who assist us in operating our platform securely.
                    </li>
                    <li>
                      <strong>Legal Obligations:</strong> If required by law, subpoena, or regulatory mandates, we may disclose your information to protect the safety of our patients and clinical staff.
                    </li>
                  </ul>
                </section>

                <hr className="my-8 border-slate-200" />

                <section id="privacy-security" className="scroll-mt-10 mb-8">
                  <h2 className="text-2xl font-serif font-bold text-brand-950 mb-4">5. Data Security and HIPAA Compliance</h2>
                  <p className="leading-relaxed mb-4">
                    Your privacy is our top clinical priority. Because we facilitate clinical-grade telehealth, we adhere to strict data security standards. We use administrative, technical, and physical security measures, including HIPAA-compliant encrypted servers, to help protect your personal and Protected Health Information (PHI). While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.
                  </p>
                </section>

                <hr className="my-8 border-slate-200" />

                <section id="privacy-cookies" className="scroll-mt-10 mb-8">
                  <h2 className="text-2xl font-serif font-bold text-brand-950 mb-4">6. Cookies and Tracking Technologies</h2>
                  <p className="leading-relaxed mb-4">
                    We may use cookies, web beacons, tracking pixels, and other tracking technologies on our website to help customize the site and improve your experience. You can choose to disable cookies through your browser settings, though this may affect your ability to use certain features of our site.
                  </p>
                </section>

                <hr className="my-8 border-slate-200" />

                <section id="privacy-retention" className="scroll-mt-10 mb-8">
                  <h2 className="text-2xl font-serif font-bold text-brand-950 mb-4">7. Data Retention</h2>
                  <p className="leading-relaxed mb-4">
                    We will retain your personal and medical information only for as long as is necessary for the purposes set out in this Privacy Policy, and to the extent necessary to comply with our legal obligations (such as state and federal medical record retention laws), resolve disputes, and enforce our legal agreements and policies.
                  </p>
                </section>

                <hr className="my-8 border-slate-200" />

                <section id="privacy-rights" className="scroll-mt-10 mb-8">
                  <h2 className="text-2xl font-serif font-bold text-brand-950 mb-4">8. Your Privacy Rights</h2>
                  <p className="leading-relaxed mb-4">
                    Depending on your location, you may have the following rights regarding your personal data:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>The right to access and receive a copy of your personal data.</li>
                    <li>The right to request correction of any inaccurate or incomplete information.</li>
                    <li>The right to request the deletion of your personal data (subject to mandatory medical record retention requirements).</li>
                    <li>The right to opt out of non-essential marketing communications.</li>
                  </ul>
                </section>

                <hr className="my-8 border-slate-200" />

                <section id="privacy-contact" className="scroll-mt-10 mb-8">
                  <h2 className="text-2xl font-serif font-bold text-brand-950 mb-4">9. Contact Us</h2>
                  <p className="leading-relaxed mb-4">
                    If you have questions or comments about this Privacy Policy or wish to exercise your data rights, please contact our clinical headquarters:
                  </p>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-6 not-prose">
                    <h4 className="font-bold text-brand-950 mb-2">Genestac Headquarters</h4>
                    <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                      A Block, Unitech Business Zone, 106<br />
                      Nirvana Country, Sector 50<br />
                      Gurugram, Haryana 122018
                    </p>
                    <div className="flex flex-col space-y-3 text-sm">
                      <a href="mailto:info@genestac.com" className="text-brand-600 font-bold hover:underline flex items-center gap-2">
                        <Mail className="h-4 w-4" /> info@genestac.com
                      </a>
                      <a href="tel:+919971114121" className="text-brand-600 font-bold hover:underline flex items-center gap-2">
                        <Phone className="h-4 w-4" /> +91 99711 14121
                      </a>
                    </div>
                  </div>
                </section>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
