"use client";

import React from "react";

export const MapSection: React.FC = () => {
  return (
    <section className="py-12 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-slate-800 font-extrabold tracking-[0.25em] uppercase text-[10px] mb-4 block">
            Clinical Headquarters
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-950 mb-4">Find Us</h2>
          <p className="text-slate-600 font-medium text-lg">
            A Block, Unitech Business Zone, 106, Nirvana Country, Sector 50, Gurugram, Haryana 122018
          </p>
        </div>
        <div className="relative w-full h-[400px] md:h-[400px] rounded-[2.5rem] overflow-hidden shadow-floating border border-white group acrylic-card p-2">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/20 via-white/10 to-transparent mix-blend-multiply group-hover:opacity-0 transition-opacity duration-1000 pointer-events-none z-10 rounded-[2.1rem]"></div>
          <iframe
            src="https://maps.google.com/maps?q=A%20Block,%20Unitech%20Business%20Zone,%20106,%20Nirvana%20Country,%20Sector%2050,%20Gurugram,%20Haryana%20122018&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0 filter grayscale-[20%] contrast-100 saturate-120 group-hover:grayscale-0 transition-all duration-1000 relative z-0 rounded-[2.1rem]"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};
