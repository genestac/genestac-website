import Link from "next/link";
import React from "react";

interface TreatmentAreaPageProps {
  title: string;
  description: string;
}

export const TreatmentAreaPage: React.FC<TreatmentAreaPageProps> = ({ title, description }) => (
  <main className="bg-white overflow-x-hidden">
    <section className="pt-28 pb-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Treatment Area</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">{title}</h1>
          <p className="max-w-3xl text-lg text-slate-200">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-slate-300/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              Home
            </Link>
            <Link href="/weightloss" className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">
              Weight Loss Program
            </Link>
          </div>
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-8 rounded-[2rem] border border-slate-200/50 bg-slate-50 p-10 shadow-xl shadow-slate-900/5">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900">Overview</h2>
            <p className="text-base leading-8 text-slate-700">
              This page is ready for your treatment content. Add clinical details, patient benefits, eligibility information, treatment protocols, and appointment guidance here.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              "Why this treatment works",
              "Who can benefit",
              "Key outcomes",
              "What to expect",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-900">{item}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">Placeholder content area for detailed copy and patient education.</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6 rounded-[2rem] border border-slate-200/70 bg-slate-950 p-8 text-slate-100 shadow-2xl shadow-slate-900/10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">Next steps</p>
            <h3 className="text-2xl font-semibold">Prepare your consultation</h3>
            <p className="text-sm leading-7 text-slate-300">Add intake notes, patient history, and common FAQs here once the detailed page content is ready.</p>
          </div>
          <div className="space-y-4 rounded-3xl bg-slate-900/80 p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Contact</p>
              <p className="text-base font-semibold text-white">info@genestac.com</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Phone</p>
              <p className="text-base font-semibold text-white">+91-9971114121</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </main>
);
