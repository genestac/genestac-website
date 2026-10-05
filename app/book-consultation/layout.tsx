import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Consultation | Genestac Therapeutics",
  description:
    "Book your expert medical consultation at Genestac Therapeutics. Choose your condition — Weight Management, Fat Loss, Pain & Regeneration, Hair Treatment, Heart Disease, Skin Laser, and more. ₹200 consultation fee.",
  openGraph: {
    title: "Book a Consultation — ₹200 | Genestac Therapeutics",
    description:
      "Select your condition and book a personalised medical consultation with our expert doctors at Genestac Therapeutics.",
    url: "https://genestac.com/book-consultation",
    siteName: "Genestac Therapeutics",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
