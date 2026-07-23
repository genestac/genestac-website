import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Success Stories | Genestac Therapeutics",
  description: "Read real-life testimonials and success stories from Genestac Therapeutics patients who avoided major surgery and reclaimed their lives through regenerative medicine.",
};

const stories = [
  {
    name: "Rajesh Sharma",
    age: "52, Gurugram",
    condition: "Refractory Knee Osteoarthritis (Grade III)",
    treatment: "Bone Marrow Therapy + PRP",
    quote: "I was recommended total knee replacement by two orthopedic surgeons. After the bone marrow therapy at Genestac, my joint pain is nearly gone, and I am back to playing golf twice a week. Truly life-changing.",
    recoveryRate: "90% Pain Relief",
    duration: "4 Months Post-Op",
  },
  {
    name: "Dr. Ananya Goel",
    age: "45, New Delhi",
    condition: "Chronic L4-L5 Disc Herniation & Sciatica",
    treatment: "PBSE Therapy + Spine Care",
    quote: "As a practicing physician, I was skeptical of regenerative treatments. But the scientific rigor at Genestac convinced me. The sciatic pain that bothered me for years resolved after my second PBSE session.",
    recoveryRate: "No Sciatic Pain",
    duration: "6 Months Post-Op",
  },
  {
    name: "Vikram Malhotra",
    age: "38, Noida",
    condition: "Rotator Cuff Partial Tear (Sports Injury)",
    treatment: "Advanced PRP Therapy",
    quote: "My shoulder injury halted my gym routine. Genestac's ultrasound-guided PRP injection accelerated my healing process. I was back to training in less than two months without surgery.",
    recoveryRate: "Full Range of Motion",
    duration: "8 Weeks Post-Op",
  },
];

export default function SuccessStoriesPage() {
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
            Real Patient Journeys
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
            Success Stories
          </h1>
          <p className="text-lg sm:text-xl text-[#F5E6CC] max-w-3xl mx-auto font-medium">
            Hear from our patients who avoided invasive procedures, restored their mobility, and reclaimed their quality of life.
          </p>
        </div>
      </section>

      {/* Stories List */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {stories.map((story, i) => (
            <div key={i} className="rounded-[2.5rem] border border-slate-100 bg-white p-8 sm:p-12 shadow-sm hover:shadow-xl transition-all duration-300 grid gap-8 md:grid-cols-[1.5fr_0.5fr] items-center">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#001f3f]/10 text-[#001f3f] text-xs font-bold uppercase tracking-wider">
                    {story.treatment}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">{story.name}</h3>
                  <p className="text-sm text-slate-500">{story.age} &bull; {story.condition}</p>
                </div>
                <blockquote className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-emerald-400 pl-4">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
              </div>
              <div className="bg-[#001f3f] text-center p-6 rounded-[2rem] text-white space-y-3">
                <p className="text-sm uppercase tracking-widest text-slate-400 font-bold">Outcome</p>
                <p className="text-2xl font-extrabold text-[#F5E6CC]">{story.recoveryRate}</p>
                <div className="w-8 h-px bg-white/20 mx-auto" />
                <p className="text-xs text-slate-300">{story.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-[#001f3f] to-[#00305f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">Begin Your Success Story</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Contact us today for a comprehensive evaluation of your medical condition to see if regenerative therapy is the right choice for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="https://genestac.com/schedule-an-appointment/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white transition-all shadow-lg"
            >
              Schedule Consultation
            </a>
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
