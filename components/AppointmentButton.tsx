"use client";

import { useRouter } from "next/navigation";
import { ReactNode, CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export default function AppointmentButton({ className, style, children }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/book-consultation")}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
}
