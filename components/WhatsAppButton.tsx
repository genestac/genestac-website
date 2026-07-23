"use client";

import { ReactNode, useCallback } from "react";

interface Props {
  phone: string;
  message?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export default function WhatsAppButton({ phone, message = "Hello", className, style, children }: Props) {
  const handleClick = useCallback(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [phone, message]);

  return (
    <button type="button" onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  );
}
