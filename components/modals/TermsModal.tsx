"use client";

import React from "react";
import { useModals } from "@/context/ModalContext";
import { X } from "lucide-react";

export const TermsModal: React.FC = () => {
  const { isTermsOpen, setTermsOpen } = useModals();

  if (!isTermsOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-md z-[150] flex items-center justify-center px-3 py-4 sm:px-4 sm:py-8 transition-opacity">
      <div className="acrylic-card bg-white/95 rounded-[2.5rem] w-full max-w-4xl max-h-full overflow-y-auto p-8 md:p-12 relative shadow-2xl animate-fade-in no-scrollbar border-white">
        <div className="sticky top-0 right-0 flex justify-end z-10 -mt-4 -mr-4 mb-4">
          <button
            onClick={() => setTermsOpen(false)}
            className="text-brand-400 hover:text-brand-900 transition-colors bg-white border border-brand-100 p-2.5 rounded-full shadow-sm hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="font-sans text-slate-700 font-medium leading-relaxed text-sm sm:text-base">
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 mb-2 text-center">
            Terms and Conditions
          </h2>
          <p className="text-center text-sm text-slate-500 mb-10">
            <strong>Last Updated:</strong> April 27, 2026
          </p>
          <div className="bg-red-50/80 border-l-4 border-red-500 p-6 rounded-r-2xl my-8 text-red-900 text-sm sm:text-base shadow-sm">
            <p>
              <strong className="text-red-700">IMPORTANT MEDICAL DISCLAIMER:</strong> The
              information provided on this website, and the products sold, are for informational and
              wellness purposes only. We are not a medical facility. Always consult with a
              healthcare professional before starting any treatment.
            </p>
          </div>
          {/* Terms content - can be expanded or kept identical */}
          <div className="space-y-4 text-slate-600 font-normal leading-relaxed">
            <p>
              By accessing and using this site, you accept and agree to be bound by the terms and
              provisions of this agreement. In addition, when using this site&apos;s particular services,
              you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
            <p>
              All materials contained on this site, including text, graphics, logos, and images are
              the property of Genestac and protected by applicable copyright and trademark law.
              Any unauthorized use of any materials on this site may violate copyright laws, trademark
              laws, and other communications regulations and statutes.
            </p>
            <p>
              Under no circumstances shall Genestac be liable for any direct, indirect, special,
              incidental or consequential damages, including, but not limited to, loss of data or profit,
              arising out of the use, or the inability to use, the materials on this site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
