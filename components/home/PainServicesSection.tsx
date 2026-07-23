"use client";
import Link from "next/link";
import React from "react";
import {
  PersonStanding,
  Bone,
  ScanFace,
  Footprints,
  Hand,
  Activity,
  ShieldAlert,
  Brain,
  Dumbbell,
  Zap,
  HeartPulse,
  Ribbon,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

type Accent = "blue" | "teal" | "coral" | "amber";

const ACCENTS: Record<
  Accent,
  { fg: string; bg: string; ring: string; blob: string }
> = {
  blue: {
    fg: "#1a67aa",
    bg: "rgba(26,103,170,0.10)",
    ring: "rgba(26,103,170,0.35)",
    blob: "rgba(26,103,170,0.16)",
  },
  teal: {
    fg: "#00a3c4",
    bg: "rgba(0,180,216,0.10)",
    ring: "rgba(0,180,216,0.35)",
    blob: "rgba(0,180,216,0.16)",
  },
  coral: {
    fg: "#e8623f",
    bg: "rgba(232,98,63,0.10)",
    ring: "rgba(232,98,63,0.35)",
    blob: "rgba(232,98,63,0.16)",
  },
  amber: {
    fg: "#c98a12",
    bg: "rgba(201,138,18,0.10)",
    ring: "rgba(201,138,18,0.35)",
    blob: "rgba(201,138,18,0.16)",
  },
};

const painConditions: {
  icon: LucideIcon;
  label: string;
  blurb: string;
  accent: Accent;
  image: string;
}[] = [
  {
    icon: PersonStanding,
    label: "Back Pain",
    blurb: "Lower & upper spine relief",
    accent: "blue",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBWvplg77RsND6nNqxr4_bgjC1qCkZn70VzpKRADyaQw&s=10",
  },
  {
    icon: Bone,
    label: "Slipped Disc",
    blurb: "Disc decompression therapy",
    accent: "coral",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlRcyh0Yk_IwMcDMyItSyjO_cta84I5RsAyWtvvKPHng&s=10",
  },
  {
    icon: ScanFace,
    label: "Neck Pain",
    blurb: "Cervical mobility care",
    accent: "teal",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqaIw_65O2rtBbRMvagtulwlbgyYAioZsxSc8qhw_w8A&s=10",
  },
  {
    icon: Footprints,
    label: "Knee Pain",
    blurb: "Restore joint movement",
    accent: "amber",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6YHavhTBJpWE3zeCvcizeOTBR1OCHkb-sFHN_zbP2-A&s=10",
  },
  {
    icon: Hand,
    label: "Joint Pain",
    blurb: "Non-surgical joint relief",
    accent: "blue",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQETtbq0SRcE0OQcMZRfE0P2Fes3-9-zqyPP9-TKtF2bw&s=10",
  },
  {
    icon: Activity,
    label: "Arthritis Pain",
    blurb: "Long-term symptom control",
    accent: "coral",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY3wliztmCGPGADLeZ__EwU8zhYnb54AIXVp-nzrd4HA&s=10",
  },
  {
    icon: ShieldAlert,
    label: "Ankle & Heel Pain",
    blurb: "Targeted foot therapy",
    accent: "teal",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOyASWTTQVXetYn-F1dU3NetMn-lJOz3F7NmDLa80_7Q&s=10",
  },
  {
    icon: Brain,
    label: "Headache",
    blurb: "Chronic migraine support",
    accent: "amber",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwz68eVk_gWCTJlqDxz3upr18xFBkHsb5hqE8Qt62lgg&s=10",
  },
  {
    icon: Dumbbell,
    label: "Sports Injuries",
    blurb: "Fast return-to-play care",
    accent: "blue",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnJOquWPO9QDH3U2DKkiQ5UsNvVHXbzvCHbf8SChbfHQ&s=10",
  },
  {
    icon: Zap,
    label: "Neuralgic Pain",
    blurb: "Nerve pain management",
    accent: "coral",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQVC4BKdFknK-iCRiiDu9qNoBSHCKrKItu0b79_r-Q5g&s=10",
  },
  {
    icon: HeartPulse,
    label: "Fibromyalgia",
    blurb: "Whole-body pain relief",
    accent: "teal",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHNBqzWzndquwBwxTOHVHRZDTNzbZaK16pkBUMCKE_Yg&s=10",
  },
  {
    icon: Ribbon,
    label: "Cancer Pain",
    blurb: "Palliative pain support",
    accent: "amber",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTZDN-u1tyQ39ErN8wzd8Uq9AfccuPRoZxsYo6ohqfUQ&s=10",
  },
];

export const PainServicesSection: React.FC = () => (
  <section id="services" style={{ fontFamily: "'Poppins', sans-serif" }}>
    <div
      className="py-20 px-5 text-center"
      style={{
        background: "linear-gradient(135deg, #eaf3ff 0%, #fff5e1 100%)",
      }}
    >
      <span
        className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider mb-4"
        style={{ background: "rgba(26,103,170,0.1)", color: "#1a67aa" }}
      >
        What We Treat
      </span>
      <h2 className="text-[2.5rem] font-bold mb-4" style={{ color: "#145388" }}>
        Our Pain Treatment Services
      </h2>
      <p className="text-lg text-[#212529] max-w-[700px] mx-auto mb-12 leading-relaxed">
        We provide advanced non-surgical treatments for a wide range of pain
        conditions, helping patients restore mobility and live pain-free.
      </p>

      <div
        className="grid gap-6 max-w-[1150px] mx-auto"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
      >
        {painConditions.map((c) => {
          const a = ACCENTS[c.accent];
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="group relative bg-white rounded-2xl text-left overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
              style={{
                border: "1px solid rgba(20,83,136,0.08)",
                boxShadow: "0 4px 16px rgba(20,83,136,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 20px 40px -12px ${a.ring}`;
                e.currentTarget.style.borderColor = a.ring;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(20,83,136,0.06)";
                e.currentTarget.style.borderColor = "rgba(20,83,136,0.08)";
              }}
            >
              {/* image header */}
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={c.image}
                  alt={c.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(20,83,136,0) 40%, rgba(15,30,45,0.55) 100%)",
                  }}
                />
               
              </div>

              {/* icon badge overlapping the image edge */}
              <div
                className="relative flex items-center justify-center w-14 h-14 rounded-xl -mt-7 ml-6 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                style={{
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(20,83,136,0.15)",
                }}
              >
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-lg"
                  style={{ background: a.bg }}
                >
                  <Icon
                    className="w-5.5 h-5.5"
                    style={{ color: a.fg }}
                    strokeWidth={1.75}
                  />
                </div>
              </div>

              <div className="px-6 pb-6">
                <h4 className="text-lg font-semibold text-[#212529] mb-1.5">
                  {c.label}
                </h4>
                <p className="text-sm text-[#6b7280] leading-relaxed mb-4">
                  {c.blurb}
                </p>
                <div className="flex items-center text-sm font-bold opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0" style={{ color: a.fg }}>
                  Explore Treatment <ArrowUpRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weight Loss Banner */}
      <div
        className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden mt-20 max-w-275 mx-auto shadow-[0_20px_50px_rgba(26,103,170,0.08)] text-left border border-[rgba(0,180,216,0.15)]"
        style={{ minHeight: 550 }}
      >
        <div className="md:w-[42%] relative overflow-hidden">
          <img
            src="/advance_weight_loss.webp"
            alt="Advanced Weight Loss Program"
            className="w-full h-full object-cover object-top p-4  rounded-3xl"
          />
        </div>
        <div
          className="md:w-[58%] px-10 py-16 flex flex-col justify-center"
          style={{
            background: "linear-gradient(135deg,#ffffff 0%,#f0f8fc 100%)",
          }}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider mb-4 w-max"
            style={{ background: "rgba(0,180,216,0.1)", color: "#00b4d8" }}
          >
            Transform Your Life
          </span>
          <h3
            className="text-[2.2rem] font-bold mb-4 leading-[1.2]"
            style={{ color: "#145388" }}
          >
            Advanced Medical Weight Loss
          </h3>
          <p className="text-base mb-6 text-[#555]">
            Achieve your ideal body weight with our personalized, science-backed
            medical weight loss programs. No fad diets, just real results.
          </p>
          <ul className="list-none p-0 mb-9 space-y-3">
            {[
              "Medical-grade fat loss therapies",
              "Personalized nutrition & metabolic testing",
              "Safe, non-surgical and sustainable results",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-base font-medium text-[#212529]"
              >
                <span className="text-[#00b4d8] text-xl">✓</span> {item}
              </li>
            ))}
          </ul>
          <Link
            href="/start-journey"
            className="inline-block px-8 py-4 rounded-full font-semibold text-base text-white w-max transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,103,170,0.4)]"
            style={{
              background: "#1a67aa",
              boxShadow: "0 6px 15px rgba(26,103,170,0.3)",
            }}
          >
            Start Your Journey →
          </Link>
        </div>
      </div>
    </div>
  </section>
);
