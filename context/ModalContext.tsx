"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ModalContextType {
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isIntakeOpen: boolean;
  setIntakeOpen: (open: boolean) => void;
  isPrivacyOpen: boolean;
  setPrivacyOpen: (open: boolean) => void;
  isTermsOpen: boolean;
  setTermsOpen: (open: boolean) => void;
  isEnquiryOpen: boolean;
  setEnquiryOpen: (open: boolean) => void;
  isLoginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  isExpertOpen: boolean;
  setExpertOpen: (open: boolean) => void;
  isContactOpen: boolean;
  setContactOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isIntakeOpen, setIntakeOpen] = useState(false);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [isEnquiryOpen, setEnquiryOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isExpertOpen, setExpertOpen] = useState(false);
  const [isContactOpen, setContactOpen] = useState(false);

  // Toggle body scroll when any modal is open
  useEffect(() => {
    const isAnyOpen =
      isCartOpen ||
      isIntakeOpen ||
      isPrivacyOpen ||
      isTermsOpen ||
      isEnquiryOpen ||
      isLoginOpen ||
      isExpertOpen ||
      isContactOpen;

    if (isAnyOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    // Always clean up on unmount
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [
    isCartOpen,
    isIntakeOpen,
    isPrivacyOpen,
    isTermsOpen,
    isEnquiryOpen,
    isLoginOpen,
    isExpertOpen,
    isContactOpen,
  ]);

  // Open the enquiry popup automatically on every page refresh after a short delay (once per session)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeen = sessionStorage.getItem("hasSeenEnquiryPopup");
      if (hasSeen) return;
    }

    const timer = window.setTimeout(() => {
      setEnquiryOpen(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("hasSeenEnquiryPopup", "true");
      }
    }, 2500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isCartOpen,
        setCartOpen,
        isIntakeOpen,
        setIntakeOpen,
        isPrivacyOpen,
        setPrivacyOpen,
        isTermsOpen,
        setTermsOpen,
        isEnquiryOpen,
        setEnquiryOpen,
        isLoginOpen,
        setLoginOpen,
        isExpertOpen,
        setExpertOpen,
        isContactOpen,
        setContactOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalProvider");
  }
  return context;
};
