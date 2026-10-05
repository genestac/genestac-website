"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { ChevronDown } from "lucide-react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, callback: () => void) => void };
  }
}

const FEE = 200;
const CONCERNS = [
  "Weight Management",
  "Fat Loss",
  "Longevity",
  "Pain & Regeneration",
  "Hair Treatment",
  "Heart & Disease",
  "Skin Laser Treatment",
  "Other"
];

const SLOTS = {
  Morning: ["9:00 AM", "10:00 AM", "11:00 AM"],
  Afternoon: ["12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
};

type Day = { iso: string; dow: string; d: number };

export default function BookConsultation() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [concern, setConcern] = useState(CONCERNS[0]);
  const [customConcern, setCustomConcern] = useState("");
  
  const [days, setDays] = useState<Day[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [booked, setBooked] = useState<string[]>([]);
  
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [tried, setTried] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const list: Day[] = Array.from({ length: 7 }, (_, i) => {
      const dt = new Date();
      dt.setDate(dt.getDate() + i);
      return {
        iso: dt.toISOString().slice(0, 10),
        dow: i === 0 ? "Today" : dt.toLocaleDateString("en-IN", { weekday: "short" }),
        d: dt.getDate(),
      };
    });
    setDays(list);
    setDate(list[0].iso);
  }, []);

  // Load already-booked slots for the chosen date (optional: create /api/slots yourself)
  useEffect(() => {
    if (!date) return;
    setTime("");
    // Fallback to empty booked slots for now as we haven't implemented /api/slots
    setBooked([]);
  }, [date]);

  const errors = useMemo(
    () => ({
      name: name.trim().length < 2 ? "Enter your full name" : "",
      phone: phone.replace(/\D/g, '').length === 10 ? "" : "Enter a valid 10-digit mobile number",
      email: email && !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email address" : "",
      customConcern: concern === "Other" && customConcern.trim().length < 2 ? "Please specify your health concern" : "",
    }),
    [name, phone, email, concern, customConcern]
  );
  
  const show = (k: keyof typeof errors) => (touched[k] || tried) && errors[k];
  const step1Ok = !errors.name && !errors.phone && !errors.email && !errors.customConcern;
  const slotLabel = date && time ? `${days.find((d) => d.iso === date)?.dow} ${days.find((d) => d.iso === date)?.d}, ${time}` : "";
  const finalConcern = concern === "Other" ? customConcern : concern;

  function next() {
    if (step === 1) {
      setTried(true);
      if (step1Ok) setStep(2);
    } else {
      if (date && time) pay();
    }
  }

  const saveToLeads = async () => {
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          condition: finalConcern,
          source: "consultation_payment_incomplete",
        }),
      });
    } catch {}
  };

  async function pay() {
    setLoading(true);
    setPayError("");
    try {
      // 1. Create order
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          phone, 
          condition: finalConcern, 
          date, 
          time 
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to create order");
      
      // 2. Open Razorpay
      const rzp = new window.Razorpay({
        key: data.keyId,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: "Genestac Therapeutics",
        description: `Consultation – ${finalConcern}`,
        image: "/logo2.png",
        prefill: { name, email, contact: phone },
        theme: { color: "#12A67C" },
        handler: async (response: any) => {
          setLoading(true);
          try {
            // 3. Verify payment on success
            const verRes = await fetch("/api/consultation/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                name,
                email,
                phone,
                condition: finalConcern,
                date,
                time,
              }),
            });
            const verData = await verRes.json();
            if (verData.success) {
              setDone(true);
            } else {
              throw new Error(verData.message);
            }
          } catch (err: any) {
            await saveToLeads();
            setPayError(err.message || "Payment verification failed. We have saved your details.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            saveToLeads();
          }
        }
      });
      
      rzp.on('payment.failed', async () => {
        await saveToLeads();
        setLoading(false);
        setPayError("Payment failed. Please try again.");
      });
      
      rzp.open();
    } catch (err: any) {
      setPayError(err.message || "Couldn’t start the payment. Check your connection and try again.");
      setLoading(false);
    }
  }

  const ctaLabel = step === 1 ? "Continue" : (date && time ? `Pay ₹${FEE} and confirm` : "Pick a date and time");

  if (done) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F4FBF8] p-6 text-center text-[#16352E]">
        <div className="max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-[#DCEEE7]">
          <h1 className="text-xl font-semibold">You’re booked! 🎉</h1>
          <p className="mt-2 text-sm text-[#4F6F66]">
            {slotLabel} · {finalConcern}. Our team will contact you shortly at +91 {phone}.
          </p>
          <a href="/" className="mt-6 inline-block rounded-xl bg-[#12A67C] px-6 py-3 text-sm font-semibold text-white">
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4FBF8] pb-32 text-[#16352E] md:pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />



      <div className="mx-auto max-w-5xl gap-8 px-4 pt-5 md:grid md:grid-cols-[1fr_1.1fr] md:pt-10 lg:max-w-7xl lg:gap-20 lg:pt-16">
        {/* Left: compact hero */}
        <section className="md:pt-4">
          <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
            <div className="flex-1">
              <h1 className="text-[22px] font-semibold leading-tight text-[#123B31] md:text-4xl lg:text-5xl">
                Talk to a doctor who listens
              </h1>
              <p className="mt-1 text-sm md:text-lg text-[#355A4F]">Genestac Therapeutics · Expert Medical Care</p>
            </div>
            <Image
              src="/doctor_consulation.png"
              alt="Genestac Therapeutics"
              width={400}
              height={400}
              priority
              className="h-24 w-auto md:h-auto md:w-64 lg:w-[380px] flex-none object-contain drop-shadow-lg"
            />
          </div>
          <p className="mt-6 text-sm md:text-base text-[#355A4F]">
            Private video call, 20 minutes. Get a personalised plan made for you.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-xs md:text-sm text-[#0F6E56]">
            <li className="rounded-full bg-[#E1F5EE] px-3 py-1">4.8 from 2,000+ patients</li>
            <li className="rounded-full bg-[#E1F5EE] px-3 py-1">Verified doctors</li>
            <li className="rounded-full bg-[#E1F5EE] px-3 py-1">Private and secure</li>
          </ul>
          <blockquote className="mt-4 hidden rounded-xl bg-white p-4 text-sm text-[#355A4F] ring-1 ring-[#DCEEE7] md:block">
            “The doctor explained everything calmly. I felt heard.”
            <footer className="mt-1 text-xs text-[#5B7A70]">Priya S., Delhi</footer>
          </blockquote>
        </section>

        {/* Right: form */}
        <section className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#DCEEE7] md:mt-0 md:p-6">
          <div className="mb-1 flex gap-1.5" aria-hidden>
            {[1, 2].map((n) => (
              <span key={n} className={`h-1 flex-1 rounded ${n <= step ? "bg-[#12A67C]" : "bg-[#D5EBE2]"}`} />
            ))}
          </div>
          <p className="mb-4 text-xs text-[#4F6F66]">
            Step {step} of 2 · {["Your details", "Date and time"][step - 1]}
          </p>

          {step === 1 && (
            <div className="space-y-4">
              <Field label="Full name" error={show("name")}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  autoComplete="name"
                  placeholder="Priya Sharma"
                  className={inputCls(!!show("name"))}
                />
              </Field>
              <Field label="WhatsApp number" error={show("phone")}>
                <div className="flex">
                  <span className="grid place-items-center rounded-l-xl border border-r-0 border-[#C5DED5] bg-[#EDF7F3] px-3 text-sm">+91</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="98765 43210"
                    className={inputCls(!!show("phone")) + " rounded-l-none"}
                  />
                </div>
              </Field>
              <Field label="Health concern">
                <div className="relative">
                  <select 
                    value={concern} 
                    onChange={(e) => setConcern(e.target.value)} 
                    className={inputCls(false) + " appearance-none cursor-pointer pr-12 relative z-10 bg-transparent"}
                    style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                  >
                    {CONCERNS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <div className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none z-0">
                    <ChevronDown className="w-5 h-5 text-[#8AA79C]" />
                  </div>
                </div>
              </Field>
              
              {concern === "Other" && (
                <Field label="Specify your concern" error={show("customConcern")}>
                  <input
                    value={customConcern}
                    onChange={(e) => setCustomConcern(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, customConcern: true }))}
                    placeholder="Briefly describe your health concern..."
                    className={inputCls(!!show("customConcern"))}
                  />
                </Field>
              )}
              
              <Field label="Email for your receipt (optional)" error={show("email")}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  autoComplete="email"
                  placeholder="priya@email.com"
                  className={inputCls(!!show("email"))}
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-2 text-sm font-medium">Date</p>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                {days.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    onClick={() => setDate(d.iso)}
                    className={`flex-none rounded-xl border px-3 py-2 text-center text-xs ${
                      date === d.iso ? "border-[#12A67C] bg-[#12A67C] text-white" : "border-[#C5DED5] bg-white text-[#355A4F]"
                    }`}
                  >
                    {d.dow}
                    <span className="block text-base font-semibold">{d.d}</span>
                  </button>
                ))}
              </div>
              {!date && <p className="mt-2 text-sm text-[#5B7A70]">Pick a date to see open times.</p>}
              {date &&
                Object.entries(SLOTS).map(([group, list]) => (
                  <div key={group} className="mt-3">
                    <p className="mb-2 text-sm font-medium">{group}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {list.map((t) => {
                        let isPast = false;
                        if (date === days[0]?.iso) { // Today
                          const [timeStr, modifier] = t.split(" ");
                          let [hours, minutes] = timeStr.split(":").map(Number);
                          if (modifier === "PM" && hours !== 12) hours += 12;
                          if (modifier === "AM" && hours === 12) hours = 0;
                          
                          const now = new Date();
                          const slotTime = new Date();
                          slotTime.setHours(hours, minutes, 0, 0);
                          if (now > slotTime) isPast = true;
                        }

                        const off = booked.includes(t) || isPast;
                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={off}
                            onClick={() => setTime(t)}
                            className={`rounded-xl border py-2.5 text-sm ${
                              time === t
                                ? "border-[#12A67C] bg-[#12A67C] text-white"
                                : off
                                ? "border-[#E5ECE9] bg-[#F1F5F3] text-[#A7B8B1] line-through"
                                : "border-[#C5DED5] bg-white text-[#355A4F]"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              {payError && <p role="alert" className="text-sm text-red-600 mt-4 text-center font-medium">{payError}</p>}
            </div>
          )}

          <div className="mt-5 pt-3">
            <div className="mx-auto flex max-w-5xl gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="rounded-xl border border-[#C5DED5] px-4 text-sm text-[#355A4F]"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={next}
                disabled={loading}
                className={`flex-1 rounded-xl py-3.5 text-[15px] font-semibold text-white transition active:scale-[0.98] ${
                  step === 2 && !(date && time) ? "bg-[#8FCFBA]" : "bg-[#12A67C]"
                }`}
              >
                {loading ? "Processing..." : ctaLabel}
              </button>
            </div>
            {step === 2 && (
              <p className="mt-2 text-center text-xs text-[#5B7A70]">UPI, cards and net banking · Secured by Razorpay</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function inputCls(bad: boolean) {
  return `h-12 w-full rounded-xl border bg-[#F8FCFA] px-3 text-base text-[#16352E] outline-none placeholder:text-[#8AA79C] focus:ring-2 focus:ring-[#12A67C]/30 ${
    bad ? "border-red-400" : "border-[#C5DED5]"
  }`;
}

function Field({ label, error, children }: { label: string; error?: string | false; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-[#355A4F]">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
