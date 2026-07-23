import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Genestac Therapeutics",
  description: "Read the Terms and Conditions of service for Genestac Therapeutics consultations, therapies, and program enrollments.",
};

export default function TermsConditionsPage() {
  return (
    <main className="bg-white overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-white">
            Terms & Conditions
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm">
            Last Updated: June 24, 2026. Please read these terms carefully before scheduling or initiating treatment.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 sm:p-12 shadow-sm space-y-8 text-slate-600 leading-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Medical Disclaimer</h2>
              <p>
                All therapies and consultation content provided on this website are for informational and clinical guidance purposes. Regenerative medicine outcomes vary, and no treatment constitutes a guaranteed cure. Eligibility is determined solely by Genestac's qualified medical board after clinical assessment.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Appointment Scheduling & Cancellations</h2>
              <p>
                Appointments can be booked online or via phone. In order to respect our medical team's schedule, cancellations or rescheduling requests must be made at least 24 hours prior to the slot.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Payments & Refund Policy</h2>
              <p>
                Payments for diagnostic reporting, specialized laboratory cell preparations, and infusions must be made prior to the procedure. Due to the highly customized, personalized nature of autologous cell preparations, laboratory processing costs are non-refundable once collection has occurred.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Limitation of Liability</h2>
              <p>
                Genestac Therapeutics operates under strict medical regulations. By enrolling in our programs, patients acknowledge the nature of biological autologous procedures and agree to follow all post-treatment protocols provided by the medical team.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-between items-center flex-wrap gap-4">
              <p className="text-xs text-slate-400">Genestac Therapeutics &copy; 2026. All rights reserved.</p>
              <Link href="/" className="text-sm font-bold text-[#001f3f] hover:text-emerald-600">
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
