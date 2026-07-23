import Link from "next/link";

interface PolicyItem {
  bold?: string;
  text: string;
}

interface PolicySection {
  num: string;
  title: string;
  content: string;
  items?: PolicyItem[];
  footer?: string;
}

export const metadata = {
  title: "Privacy Policy | Genestac Therapeutics",
  description: "Read Genestac Therapeutics' Privacy Policy — how we collect, use, and protect your personal and health information.",
};

const sections: PolicySection[] = [
  {
    num: "01",
    title: "Information We Collect",
    content: "We may collect the following types of personal information:",
    items: [
      { bold: "Personal Details:", text: "Name, phone number, email address, and location when you fill out our contact or appointment forms." },
      { bold: "Health Information:", text: "Only if voluntarily shared through forms for consultation purposes." },
      { bold: "Technical Information:", text: "IP address, browser type, device type, pages visited, and interaction time for analytics and improvement." },
    ],
  },
  {
    num: "02",
    title: "How We Use Your Information",
    content: "We use your information to:",
    items: [
      { text: "Schedule consultations and appointments." },
      { text: "Respond to inquiries and provide services." },
      { text: "Improve our website and user experience." },
      { text: "Send updates, promotions, or service reminders (only if opted-in)." },
      { text: "Maintain internal records and comply with legal obligations." },
    ],
  },
  {
    num: "03",
    title: "Sharing Your Information",
    content: "We do not sell or rent your personal data. We may share your information with:",
    items: [
      { text: "Authorized medical staff or practitioners associated with Genestac." },
      { text: "Third-party service providers who support website functionality and communications (e.g., hosting, analytics)." },
      { text: "Law enforcement or government agencies if required by law." },
    ],
  },
  {
    num: "04",
    title: "Your Rights",
    content: "You have the right to:",
    items: [
      { text: "Access, update, or delete your personal data." },
      { text: "Withdraw consent for marketing communications." },
      { text: "Request how your data is being used." },
    ],
    footer: "To exercise these rights, please email us at info@genestac.com or call +91 9971114121.",
  },
  {
    num: "05",
    title: "Data Security",
    content: "We implement appropriate security measures to protect your information from unauthorized access, misuse, or disclosure.",
  },
  {
    num: "06",
    title: "Cookies and Tracking",
    content: "We may use cookies to personalize your experience and analyze site traffic. You can choose to accept or decline cookies through your browser settings.",
  },
  {
    num: "07",
    title: "Third-Party Links",
    content: "Our website may contain links to external websites. We are not responsible for the privacy practices of those websites.",
  },
  {
    num: "08",
    title: "Updates to This Policy",
    content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.",
  },
  {
    num: "09",
    title: "Contact Us",
    content: "For privacy-related inquiries, reach us at:",
    items: [
      { bold: "Email:", text: "info@genestac.com" },
      { bold: "Phone:", text: "+91 9971114121" },
      { bold: "Address:", text: "Unit No. 106, 1st Floor, Unitech Business Zone, The Close North Avenue, Nirvana Country, Sector 50, Gurgaon, Haryana, India, 122018" },
    ],
  },
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
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            Legal & Trust
          </span>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#F5E6CC] font-medium max-w-2xl mx-auto">
            Genestac Therapeutics is committed to protecting your privacy and handling your personal data with care and transparency.
          </p>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Last Updated: June 2026</p>
        </div>
      </section>

      {/* ── POLICY SECTIONS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {sections.map((sec, idx) => (
            <div key={idx} className="rounded-[2rem] border border-slate-100 bg-white p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-6">
                <span className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-[#001f3f] text-[#F5E6CC] font-black text-sm shrink-0">
                  {sec.num}
                </span>
                <div className="space-y-4 flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{sec.title}</h2>
                  <p className="text-slate-600 leading-7">{sec.content}</p>
                  {sec.items && (
                    <ul className="space-y-2">
                      {sec.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-6">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>
                            {item.bold && <strong className="text-slate-800">{item.bold} </strong>}
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {sec.footer && (
                    <p className="text-sm text-emerald-700 font-medium pt-2 border-t border-slate-100">{sec.footer}</p>
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
            Reach out to our team at <strong className="text-[#F5E6CC]">info@genestac.com</strong> or call <strong className="text-[#F5E6CC]">+91 8287776752</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/contact-us" className="inline-flex items-center justify-center rounded-full bg-[#F5E6CC] px-8 py-4 text-sm font-extrabold text-[#001f3f] hover:bg-white transition-all shadow-lg">
              Contact Us
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
