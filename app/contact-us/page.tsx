"use client";
import React, { useState } from "react";
import Link from "next/link";
import AppointmentButton from "@/components/AppointmentButton";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="bg-white overflow-x-hidden min-h-screen pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── HERO ── */}
      <section className="relative py-20 bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight text-white">
            Contact Genestac Therapeutics
          </h1>
          <p className="text-lg text-[#F5E6CC] font-medium max-w-2xl mx-auto">
            Have questions about our therapies? Speak directly with our clinical assistants or send us a message.
          </p>
        </div>
      </section>

      {/* ── CONTACT INFO + FORM ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-start">

            {/* Left: Info + Map */}
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">Our Location</span>
                <h2 className="text-3xl font-bold text-slate-900">Get In Touch</h2>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {[
                  {
                    icon: "fa-solid fa-location-dot",
                    label: "Address",
                    value: "A Block, Unitech Business Zone, 106, Nirvana Country, Sector 50, Gurugram, Haryana 122018",
                    href: "https://maps.google.com/?q=Unitech+Business+Zone+Nirvana+Country+Sector+50+Gurugram",
                    linkText: "Open in Maps ↗"
                  },
                  {
                    icon: "fa-solid fa-phone",
                    label: "Phone",
                    value: "+91 89289 79871",
                    href: "tel:+918928979871",
                  },
                  {
                    icon: "fa-solid fa-envelope",
                    label: "Email",
                    value: "genestractherapeutics@gmail.com",
                    href: "mailto:genestractherapeutics@gmail.com",
                  },
                  {
                    icon: "fa-brands fa-whatsapp",
                    label: "WhatsApp",
                    value: "Chat with us on WhatsApp",
                    href: "https://wa.me/919971114121",
                    color: "text-emerald-500"
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <span className={`flex items-center justify-center w-10 h-10 rounded-xl bg-[#001f3f]/10 text-[#001f3f] shrink-0 ${item.color || ""}`}>
                      <i className={item.icon}></i>
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors mt-1 block leading-5">
                        {item.value}
                      </a>
                      {item.linkText && (
                        <a href={item.href} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-emerald-600 hover:underline font-semibold mt-1 inline-block">
                          {item.linkText}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Google Map Embed */}
              <div className="rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl">
                <iframe
                  title="Genestac Therapeutics Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.949744879267!2d77.05541987499614!3d28.43437679183437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18bfccd4e1b3%3A0x65f7e7453c0dfe66!2sUnitech%20Business%20Zone%2C%20Nirvana%20Country%2C%20Sector%2050%2C%20Gurugram%2C%20Haryana%20122018!5e0!3m2!1sen!2sin!4v1719298000000!5m2!1sen!2sin"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="rounded-[2rem] border border-slate-100 bg-white p-8 sm:p-10 shadow-xl shadow-slate-900/5">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Send Us a Message</h3>
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto text-2xl">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Message Sent!</h4>
                  <p className="text-slate-500 text-sm">Our team will get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm text-emerald-600 hover:underline font-semibold">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Your Name *</label>
                    <input type="text" required placeholder="Your Name"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Mobile Number *</label>
                    <input type="tel" required placeholder="Mobile Number"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address *</label>
                    <input type="email" required placeholder="Email Address"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Your Message *</label>
                    <textarea rows={5} required placeholder="Your Message"
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition-colors resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full py-4 rounded-full bg-[#001f3f] text-[#F5E6CC] font-extrabold hover:bg-slate-800 transition-colors text-sm shadow-md">
                    Send Message
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── QUICK LINKS CTA ── */}
      <section className="py-16 bg-gradient-to-br from-[#001f3f] to-[#00305f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black">Book an Appointment</h2>
          <p className="text-slate-300 max-w-xl mx-auto">
            Ready to begin your healing journey? Schedule a consultation with our medical experts.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <AppointmentButton
              className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white transition-all shadow-lg">
              Book Appointment
            </AppointmentButton>
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 transition-all">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
