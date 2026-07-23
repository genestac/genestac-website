import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
// Removed unused Toaster import
import { ModalProvider } from "@/context/ModalContext";
import LeadCapturePopup from "@/components/LeadCapturePopup";

// Import Modals
import { CartModal } from "@/components/modals/CartModal";
import { EnquiryPopup } from "@/components/modals/EnquiryPopup";
import { IntakeModal } from "@/components/modals/IntakeModal";
import { LoginModal } from "@/components/modals/LoginModal";
import { PrivacyModal } from "@/components/modals/PrivacyModal";
import { TermsModal } from "@/components/modals/TermsModal";

import ClientToaster from "@/components/ClientToaster";
import { Header } from "@/components/Header";
import { ChatBot } from "@/components/weightLoss/ChatBot";
import { Footer } from "@/components/Footer";

const outfit = localFont({
  src: "../public/fonts/Outfit-Light.ttf",
  variable: "--font-outfit-local",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Genestac Therapeutics | Regenerative Medicine & Pain Management",
  description:
    "World-class non-surgical pain management, regenerative medicine, stem cell therapy, PRP, and advanced weight loss programs at Genestac Therapeutics, Gurugram.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${outfit.variable} ${outfit.className} bg-white overflow-x-hidden`}>
        <ModalProvider>
          <CartProvider>
            <Header />
            {children}

            {/* Global Modals */}
            <CartModal />
            {/* <EnquiryPopup /> */}
            <IntakeModal />
            <LoginModal />
            <PrivacyModal />
            <TermsModal />
            <ChatBot />
            <LeadCapturePopup />
            <ClientToaster />
            <Footer/>
          </CartProvider>
        </ModalProvider>
      </body>
    </html>
  );
}
