"use client";

import { useState, ReactNode, CSSProperties } from "react";
import AppointmentModal from "@/components/modals/AppointmentModal";

interface Props {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export default function AppointmentButton({ className, style, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} style={style}>
        {children}
      </button>
      <AppointmentModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
