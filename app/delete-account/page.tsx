import Link from "next/link";
import {
  ShieldAlert,
  Trash2,
  Mail,
  CheckCircle2,
  Lock,
  ArrowRight,
  UserCheck,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

export const metadata = {
  title: "Account Deletion Policy & Request | Genestac",
  description:
    "Learn how to delete your Genestac account self-service from the app or request account deletion via email support.",
};

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header / Hero */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/60 py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 w-[600px] h-[350px] bg-rose-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldAlert className="w-3.5 h-3.5" />
            User Privacy & Data Control
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Account Deletion Request
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            At Genestac, we respect your data rights. You can easily delete your account self-service inside the app or request manual deletion through our support team.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Method 1: Self-Service Deletion */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3 text-sky-400 font-bold text-sm uppercase tracking-wider mb-3">
            <UserCheck className="w-4 h-4" />
            Option 1 — Logged-In Self-Service (Instant)
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Delete Account Directly from Settings
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            If you can log in to your Genestac account, you can perform an instant and automated account deletion directly from your account settings:
          </p>

          <ol className="space-y-4 text-sm text-slate-300 mb-8 list-none">
            <li className="flex items-start gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-sky-500/10 text-sky-400 font-bold flex items-center justify-center text-xs border border-sky-500/20">
                1
              </span>
              <div>
                <strong className="text-white block font-semibold">Log into Genestac</strong>
                Sign in to your Genestac account on the web dashboard or mobile application.
              </div>
            </li>
            <li className="flex items-start gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-sky-500/10 text-sky-400 font-bold flex items-center justify-center text-xs border border-sky-500/20">
                2
              </span>
              <div>
                <strong className="text-white block font-semibold">Navigate to Dashboard Settings</strong>
                Go to <span className="text-sky-300 font-medium">Dashboard &gt; Settings</span> (or open your user profile).
              </div>
            </li>
            <li className="flex items-start gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-sky-500/10 text-sky-400 font-bold flex items-center justify-center text-xs border border-sky-500/20">
                3
              </span>
              <div>
                <strong className="text-white block font-semibold">Scroll to Danger Zone</strong>
                Find the <span className="text-rose-400 font-medium">Danger Zone — Account Deletion</span> section at the bottom of the settings page.
              </div>
            </li>
            <li className="flex items-start gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-rose-500/10 text-rose-400 font-bold flex items-center justify-center text-xs border border-rose-500/20">
                4
              </span>
              <div>
                <strong className="text-white block font-semibold">Confirm Deletion</strong>
                Click <span className="text-rose-400 font-medium font-mono font-bold">Delete Account</span>, type <span className="text-slate-100 font-mono font-bold bg-slate-800 px-1.5 py-0.5 rounded">DELETE</span> in the confirmation box, and submit.
              </div>
            </li>
          </ol>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-slate-800/80">
            <Link
              href="/dashboard/settings#danger-zone"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition shadow-lg shadow-sky-600/20"
            >
              Go to Account Settings
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-slate-400 text-center sm:text-left">
              (Requires active login session)
            </span>
          </div>
        </section>

        {/* Method 2: Email Support Assisted Deletion */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 text-rose-400 font-bold text-sm uppercase tracking-wider mb-3">
            <Mail className="w-4 h-4" />
            Option 2 — Support-Assisted Request (If Locked Out)
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Cannot Log In? Request Account Deletion via Support Email
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            If you have lost access to your password, phone number, or account credentials, you can request account deletion by emailing our privacy team directly:
          </p>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-4">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Official Support Email</span>
                <a
                  href="mailto:support@genestac.com?subject=Account%20Deletion%20Request"
                  className="text-lg font-bold text-sky-400 hover:text-sky-300 underline"
                >
                  support@genestac.com
                </a>
              </div>
              <a
                href="mailto:support@genestac.com?subject=Account%20Deletion%20Request"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition border border-slate-700"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                Send Request Email
              </a>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p className="font-semibold text-white text-sm">Please include the following details in your email:</p>
              <ul className="space-y-2 list-disc list-inside text-slate-400">
                <li>Send from your registered email address (matching your Genestac account).</li>
                <li>Email Subject: <strong className="text-slate-200">Account Deletion Request</strong></li>
                <li>Your Registered Full Name & Registered Phone Number (if applicable).</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-xs text-rose-300">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>
              <strong>Processing Time:</strong> Manual email requests are processed by our data privacy officers within <strong>48 to 72 business hours</strong> after identity verification.
            </span>
          </div>
        </section>

        {/* Data Scope & Retention Policy */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-sm uppercase tracking-wider mb-3">
            <Lock className="w-4 h-4 text-sky-400" />
            Data Handling Policy
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">
            What Data Gets Deleted & What May Be Retained
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                <CheckCircle2 className="w-4 h-4" />
                Permanently Removed Data
              </div>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                <li>Supabase Auth credentials & login session tokens</li>
                <li>Personal profile information (Name, Email, Address, Phone)</li>
                <li>Saved health metrics, intake forms, & lifestyle choices</li>
                <li>Shopping cart items & saved preferences</li>
                <li>Saved shipping addresses & user metadata</li>
              </ul>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
                <HelpCircle className="w-4 h-4" />
                Legally Required Retention
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                In compliance with healthcare regulations, tax reporting, and fraud prevention laws, Genestac may retain anonymized financial transaction logs (invoices and completed payments) for the statutory period required by Indian law. These records are isolated and cannot be used for login or profile recreation.
              </p>
            </div>
          </div>
        </section>

        {/* Return Links */}
        <div className="text-center pt-6 border-t border-slate-800">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition uppercase tracking-wider"
          >
            ← Return to Genestac Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
