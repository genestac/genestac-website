import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck, Lock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Genestac Therapeutics",
  description: "Read Genestac Therapeutics' Privacy Policy — how we collect, use, disclose, and protect your personal and Protected Health Information (PHI).",
};

interface PolicyItem {
  bold?: string;
  text: string;
}

interface PolicySection {
  id: string;
  num: string;
  title: string;
  content: string;
  additional?: string;
  items?: PolicyItem[];
}

const sections: PolicySection[] = [
  {
    id: "intro",
    num: "01",
    title: "1. Introduction",
    content: "Welcome to Genestac (\"we,\" \"our,\" or \"us\"). We respect your privacy and are highly committed to protecting your personal and medical information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (genestac.com) and use our telehealth services, metabolic optimization protocols, and related clinical offerings.",
    additional: "By accessing or using our website and services, you agree to the terms of this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the site."
  },
  {
    id: "collect",
    num: "02",
    title: "2. Information We Collect",
    content: "We may collect personal and medical information from you in a variety of ways, including when you register on the site, fill out a health intake form, or interact with our telehealth platform. The information we collect includes:",
    items: [
      { bold: "Personal Identification Information:", text: "Your full name, email address, phone number, date of birth, and shipping/billing addresses." },
      { bold: "Medical and Health Information:", text: "Biometric data (e.g., height, weight), current and past medical conditions, biological goals, and details provided during your medical intake process." },
      { bold: "Payment Information:", text: "Credit card details and billing information (processed securely through third-party payment gateways; we do not store your full credit card number)." },
      { bold: "Automatically Collected Data:", text: "IP addresses, browser types, operating systems, access times, and the pages you have viewed directly before and after accessing the site." }
    ]
  },
  {
    id: "use",
    num: "03",
    title: "3. How We Use Your Information",
    content: "Having accurate information about you permits us to provide you with a smooth, efficient, and customized clinical experience. Specifically, we may use information collected about you via the site to:",
    items: [
      { text: "Evaluate your health profile and formulate personalized clinical treatments." },
      { text: "Process and fulfill your prescriptions through our FDA-registered compounding pharmacy partners." },
      { text: "Manage overnight cold-chain logistics and order deliveries." },
      { text: "Allow our board-certified physicians and dedicated Health Consultants to monitor your progress and provide ongoing 1-on-1 support." },
      { text: "Process payments securely and generate detailed receipts." },
      { text: "Send administrative information, such as appointment reminders, protocol updates, and order confirmations." },
      { text: "Improve our website functionality and clinical offerings." }
    ]
  },
  {
    id: "share",
    num: "04",
    title: "4. How We Share Your Information",
    content: "We strictly protect your data and do not sell your personal information to third parties. We only share information in the following situations:",
    items: [
      { bold: "Healthcare Providers:", text: "With our network of board-certified doctors, endocrinologists, and specialists who review your medical intake to prescribe and oversee your treatment." },
      { bold: "Pharmacy Partners:", text: "With certified, 503A-designated pharmacies strictly for the purpose of compounding and fulfilling your prescribed medications." },
      { bold: "Third-Party Service Providers:", text: "With trusted logistics partners (for secure, temperature-controlled delivery) and IT service providers who assist us in operating our platform securely." },
      { bold: "Legal Obligations:", text: "If required by law, subpoena, or regulatory mandates, we may disclose your information to protect the safety of our patients and clinical staff." }
    ]
  },
  {
    id: "security",
    num: "05",
    title: "5. Data Security and HIPAA Compliance",
    content: "Your privacy is our top clinical priority. Because we facilitate clinical-grade telehealth, we adhere to strict data security standards. We use administrative, technical, and physical security measures, including HIPAA-compliant encrypted servers, to help protect your personal and Protected Health Information (PHI). While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable."
  },
  {
    id: "cookies",
    num: "06",
    title: "6. Cookies and Tracking Technologies",
    content: "We may use cookies, web beacons, tracking pixels, and other tracking technologies on our website to help customize the site and improve your experience. You can choose to disable cookies through your browser settings, though this may affect your ability to use certain features of our site."
  },
  {
    id: "retention",
    num: "07",
    title: "7. Data Retention",
    content: "We will retain your personal and medical information only for as long as is necessary for the purposes set out in this Privacy Policy, and to the extent necessary to comply with our legal obligations (such as state and federal medical record retention laws), resolve disputes, and enforce our legal agreements and policies."
  },
  {
    id: "rights",
    num: "08",
    title: "8. Your Privacy Rights",
    content: "Depending on your location, you may have the following rights regarding your personal data:",
    items: [
      { text: "The right to access and receive a copy of your personal data." },
      { text: "The right to request correction of any inaccurate or incomplete information." },
      { text: "The right to request the deletion of your personal data (subject to mandatory medical record retention requirements)." },
      { text: "The right to opt out of non-essential marketing communications." }
    ]
  },
  {
    id: "contact",
    num: "09",
    title: "9. Contact Us",
    content: "If you have questions or comments about this Privacy Policy or wish to exercise your data rights, please contact our clinical headquarters:"
  }
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white overflow-x-hidden min-h-screen pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── HERO ── */}
      <section className="relative py-20 bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Legal & Trust
          </span>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#F5E6CC] font-medium max-w-2xl mx-auto">
            Genestac Therapeutics is committed to protecting your privacy and handling your personal &amp; medical data with clinical-grade security and transparency.
          </p>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Effective Date: June 2026</p>
        </div>
      </section>

      {/* ── POLICY SECTIONS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {sections.map((sec) => (
            <div
              key={sec.id}
              id={sec.id}
              className="scroll-mt-28 rounded-[2rem] border border-slate-100 bg-white p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-6">
                <span className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-[#001f3f] text-[#F5E6CC] font-black text-sm shrink-0">
                  {sec.num}
                </span>
                <div className="space-y-4 flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{sec.title}</h2>
                  <p className="text-slate-600 leading-7">{sec.content}</p>
                  {sec.additional && (
                    <p className="text-slate-600 leading-7">{sec.additional}</p>
                  )}
                  {sec.items && (
                    <ul className="space-y-3 pt-2">
                      {sec.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-6">
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>
                            {item.bold && <strong className="text-slate-900 font-semibold">{item.bold} </strong>}
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {sec.id === "contact" && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-6 space-y-4">
                      <h3 className="font-bold text-[#001f3f] text-base">Genestac Headquarters</h3>
                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          Unit No. 106, 1st Floor, Unitech Business Zone, The Close North Avenue,<br />
                          Nirvana Country, Sector 50, Gurgaon, Haryana 122018, India
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 pt-2 text-sm">
                        <a href="mailto:info@genestac.com" className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:underline">
                          <Mail className="w-4 h-4" /> info@genestac.com
                        </a>
                        <a href="tel:+919971114121" className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:underline">
                          <Phone className="w-4 h-4" /> +91 9971114121
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-gradient-to-br from-[#001f3f] to-[#00305f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black">Questions About Your Privacy?</h2>
          <p className="text-slate-300 max-w-xl mx-auto">
            Reach out to our clinical team at <strong className="text-[#F5E6CC]">info@genestac.com</strong> or call <strong className="text-[#F5E6CC]">+91 9971114121</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/contact-us" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white transition-all shadow-lg">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 transition-all">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

